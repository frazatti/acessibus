import { useState, useRef, useEffect } from 'react';
import './index.css';

interface ChatMessage {
  sender: 'user' | 'agent';
  text: string;
}

export default function App() {
  const [mode, setMode] = useState<'audio' | 'text'>('audio');

  // Áudio States
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);
  const [audioStatus, setAudioStatus] = useState("Aperte o botão para falar");

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Chat States
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // General States
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [credentials, setCredentials] = useState({
    userId: "user_teste",
    name: "Você",
    sessionId: "sessao_123"
  });

  // Mock Developer Mode States
  const [isMocking, setIsMocking] = useState(false);
  const [mockDelay, setMockDelay] = useState(8); // Segundos
  const [mockStartDelay, setMockStartDelay] = useState(30); // Delay inicial em segundos

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Rola o chat para o fim quando tem nova mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Atalho de Teclado para o Mock (Shift + M)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora se estiver digitando em um input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      if (e.shiftKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setIsMocking(prev => {
          console.log(`Mock GPS ${!prev ? 'ATIVADO' : 'DESATIVADO'} via atalho.`);
          return !prev;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  // Loop do Mock de Viagem (Dispara a injeção a cada X segundos se ativado)
  useEffect(() => {
    let interval: any;
    let startTimeout: any;

    if (isMocking && isRecording) {
      // Primeiro aguarda o Delay Inicial configurado
      startTimeout = setTimeout(() => {
        console.log(`Iniciando Mock GPS após ${mockStartDelay}s de delay inicial...`);

        interval = setInterval(async () => {
          try {
            await fetch("http://localhost:8000/mock-gps", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                sessionID: credentials.sessionId,
                message: `Sistema reporta aproximação. O ônibus está cada vez mais perto do destino.`
              })
            });
            console.log("Mock GPS Event Sent!");
          } catch (e) {
            console.error("Erro no envio do mock GPS: ", e);
          }
        }, mockDelay * 1000);

      }, mockStartDelay * 1000);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(startTimeout);
    };
  }, [isMocking, mockDelay, mockStartDelay, isRecording, credentials.sessionId]);


  // ===================== ÁUDIO LOGIC =====================
  const startRecording = async () => {
    try {
      setAudioStatus("Acessando microfone...");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, sampleRate: 16000 }
      });
      setAudioStatus("Conectando ao assistente...");
      streamRef.current = stream;
      wsRef.current = new WebSocket(`ws://localhost:8000/ws/chat/${credentials.userId}/${credentials.sessionId}`);

      wsRef.current.onopen = () => {
        setAudioStatus("Conectado! Ouvindo...");
        setIsRecording(true);
        setIsMuted(false);

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        audioContextRef.current = audioContext;
        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);

        processor.onaudioprocess = (e) => {
          if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
          const inputData = e.inputBuffer.getChannelData(0);
          const pcmData = new Int16Array(inputData.length);

          if (isMutedRef.current) {
            // Mute ativado: Preenche buffers com zeross absolutos para evitar feed reacional da I.A.
            pcmData.fill(0);
          } else {
            for (let i = 0; i < inputData.length; i++) {
              let s = Math.max(-1, Math.min(1, inputData[i]));
              pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }
          }

          wsRef.current.send(pcmData.buffer);

          const outputData = e.outputBuffer.getChannelData(0);
          outputData.fill(0);
        };

        source.connect(processor);
        processor.connect(audioContext.destination);
      };

      let nextPlayTime = 0;

      wsRef.current.onmessage = async (event) => {
        try {
          if (!audioContextRef.current) return;

          const buffer = await event.data.arrayBuffer();
          const int16Data = new Int16Array(buffer);

          const audioBuf = audioContextRef.current.createBuffer(1, int16Data.length, 24000);
          const channel = audioBuf.getChannelData(0);

          for (let i = 0; i < int16Data.length; i++) {
            channel[i] = int16Data[i] / 32768.0;
          }

          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBuf;
          source.connect(audioContextRef.current.destination);

          const currentTime = audioContextRef.current.currentTime;
          if (nextPlayTime < currentTime) nextPlayTime = currentTime;

          source.start(nextPlayTime);
          nextPlayTime += audioBuf.duration;

        } catch (e) {
          console.error("Ignorando mensagem de texto via WebSocket...", e);
        }
      };

      wsRef.current.onerror = () => {
        setAudioStatus("Erro na conexão");
        stopRecording();
      };

      wsRef.current.onclose = () => {
        stopRecording();
      };

    } catch (err) {
      console.error(err);
      setAudioStatus("Erro de microfone");
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsMuted(false);
    setIsMocking(false);
    setAudioStatus("Aperte o botão para falar");

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const handleToggle = () => {
    if (!isRecording) {
      startRecording();
    } else {
      // Se já está conectado, inverte o estado de Mutado. Nao fecha a conexão.
      setIsMuted(prev => {
        const nextState = !prev;
        setAudioStatus(nextState ? "Microfone mutado. Só escutando..." : "Conectado! Ouvindo...");
        return nextState;
      });
    }
  };


  // ===================== TEXT CHAT LOGIC =====================
  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setChatInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: credentials.userId,
          name: credentials.name,
          sessionID: credentials.sessionId,
          message: userMessage
        })
      });

      if (!response.ok) throw new Error("Erro da API Textual");
      const data = await response.json();

      setMessages(prev => [...prev, { sender: 'agent', text: data.response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: 'agent', text: "Erro ao comunicar com a rede." }]);
    } finally {
      setIsTyping(false);
    }
  };


  return (
    <div className="app-container">
      {/* Modal Overlay Config */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Credenciais e Dev Tools</h3>

            <div className="input-group">
              <label>User ID</label>
              <input
                value={credentials.userId}
                onChange={e => setCredentials({ ...credentials, userId: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Session ID</label>
              <input
                value={credentials.sessionId}
                onChange={e => setCredentials({ ...credentials, sessionId: e.target.value })}
              />
            </div>

            {/* Dev Tools Section */}
            <div className="dev-tools-section">
              <h4>🎯 Dev Tools (Mock GPS V2)</h4>

              <div className="input-group">
                <label>Intevalo entre Sinais (segundos)</label>
                <input
                  type="number"
                  min="5"
                  value={mockDelay}
                  onChange={e => setMockDelay(Number(e.target.value))}
                />
              </div>

              <div className="input-group">
                <label>Atraso de Início (segundos)</label>
                <input
                  type="number"
                  min="0"
                  value={mockStartDelay}
                  onChange={e => setMockStartDelay(Number(e.target.value))}
                />
              </div>

              <div className="toggle-group">
                <label>Ativar Mock na Chamada?</label>
                <button
                  className={`mock-btn ${isMocking ? 'active' : ''}`}
                  onClick={() => setIsMocking(!isMocking)}
                >
                  {isMocking ? 'ON / Rodando' : 'OFF'}
                </button>
              </div>
              <small style={{ fontSize: "0.7rem", opacity: 0.6 }}>
                Ativar este mock enviará sinais textuais sigilosos para a I.A simulando seu GPS caso ela esteja conectada por Áudio.
              </small>
            </div>

            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="header">
        <div className="logo-container">
          <svg className="logo-icon" viewBox="0 0 24 24">
            <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z" />
          </svg>
          <span className="logo-text">AcessiBus</span>
        </div>
        <div className="header-actions">
          <button className="icon-btn theme-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? (
              <svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4C12.92 3.04 12.46 3 12 3z" /></svg>
            )}
          </button>

          <button className="icon-btn" onClick={() => setIsModalOpen(true)}>
            <svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.73 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .43-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.49-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" /></svg>
          </button>
        </div>
      </div>

      {/* Main Content Area based on Mode */}
      {mode === 'audio' ? (
        <div className="main-content">
          <button
            className={`mic-button ${isRecording ? 'recording' : ''} ${isMuted ? 'muted' : ''}`}
            onClick={handleToggle}
            aria-label={isRecording ? (isMuted ? "Desmutar microfone" : "Mutar microfone") : "Iniciar conversa"}
          >
            {isRecording ? (
              isMuted ? (
                /* Mute Icon Cross (Mic off) */
                <svg viewBox="0 0 24 24"><path d="M10.8 4.9c0-.66.54-1.2 1.2-1.2s1.2.54 1.2 1.2l-.01 3.91L15 10.6V5c0-1.66-1.34-3-3-3S9 3.34 9 5v1.18l1.8 1.8V4.9zm8.56 14.15L5.7 5.4 4.29 6.81l3.52 3.52c-.67 1.03-1.12 2.22-1.22 3.52H4.63C4.85 17.5 7.85 20.37 11.5 20.87V23h1v-2.14c1.19-.16 2.3-.59 3.25-1.19l3.2 3.2 1.41-1.42zM12 18.05c-3.1 0-5.63-2.3-5.96-5.3h1.96c.3 1.95 2 3.45 4 3.45.69 0 1.34-.18 1.9-.48l-1.9-1.9v.03zM15 13.1l2.58 2.58c1.18-1.18 1.98-2.8 2.05-4.63h-1.95c-.07 1.3-.61 2.5-1.48 3.45h-1.2z" /></svg>
              ) : (
                <svg viewBox="0 0 24 24"><path d="M6 6h12v12H6z" /></svg>
              )
            ) : (
              <svg viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            )}
          </button>

          <div className={`visualizer ${isRecording ? 'active' : ''}`}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>

          <p className="status-text">{audioStatus}</p>
        </div>
      ) : (
        <div className="chat-container">
          <div className="chat-messages">
            {messages.length === 0 && (
              <p style={{ textAlign: 'center', opacity: 0.5, marginTop: '2rem' }}>Envie uma mensagem para iniciar o chat textual.</p>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="chat-bubble agent">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              placeholder="Escreva algo..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button className="chat-send-btn" onClick={sendMessage}>
              <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div className="nav-item home">
          <svg viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </div>

        <div className={`nav-item ${mode === 'audio' ? 'active' : ''}`} onClick={() => setMode('audio')}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line>
          </svg>
        </div>

        <div className={`nav-item ${mode === 'text' ? 'active' : ''}`} onClick={() => setMode('text')}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>

        <div className="nav-item heart">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
