import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MicIcon } from '../components/Icons';
import WaveformDisplay from '../components/WaveformDisplay';
import { startLiveSession } from '../services/geminiService';
import { LiveServerMessage } from '@google/genai';

interface HomePageProps {}

interface LiveSessionControls {
  // Fix: Ensure `media` is always of type `{ data: string; mimeType: string }` as per Gemini API Blob type
  sendRealtimeInput: (input: { media: { data: string; mimeType: string } }) => void;
  close: () => void;
}

const HomePage: React.FC<HomePageProps> = () => {
  const [isListening, setIsListening] = useState(false);
  const [userTranscription, setUserTranscription] = useState<string[]>([]);
  const [modelTranscription, setModelTranscription] = useState<string[]>([]);
  const [currentInputTranscription, setCurrentInputTranscription] = useState('');
  const [currentOutputTranscription, setCurrentOutputTranscription] = useState('');
  const [statusMessage, setStatusMessage] = useState('Pressione o microfone para falar');
  const sessionRef = useRef<LiveSessionControls | null>(null);
  const transcriptionHistoryRef = useRef<{ user: string; model: string }[]>([]);

  // Function to handle audio playback (called by geminiService.ts through callback)
  // We don't need to do anything here because the audio is already connected to outputAudioContext.destination
  const handleAudioData = useCallback((audioBuffer: AudioBuffer) => {
    // Audio is already being played in the service, this callback could be used
    // for more advanced visualization or processing if needed.
    // console.log('Received audio buffer from model:', audioBuffer);
  }, []);

  const startListening = useCallback(async () => {
    if (isListening) return;

    setIsListening(true);
    setStatusMessage('Ouvindo...');
    setUserTranscription([]);
    setModelTranscription([]);
    transcriptionHistoryRef.current = [];
    setCurrentInputTranscription('');
    setCurrentOutputTranscription('');

    try {
      const session = await startLiveSession({
        onMessage: (message: LiveServerMessage) => {
          if (message.serverContent?.outputTranscription) {
            setCurrentOutputTranscription((prev) => prev + message.serverContent.outputTranscription.text);
          } else if (message.serverContent?.inputTranscription) {
            setCurrentInputTranscription((prev) => prev + message.serverContent.inputTranscription.text);
          }

          if (message.serverContent?.turnComplete) {
            const userText = currentInputTranscription; // Capture current value
            const modelText = currentOutputTranscription; // Capture current value
            transcriptionHistoryRef.current.push({ user: userText, model: modelText });
            setUserTranscription((prev) => [...prev, userText]);
            setModelTranscription((prev) => [...prev, modelText]);
            setCurrentInputTranscription(''); // Reset for next turn
            setCurrentOutputTranscription(''); // Reset for next turn
          }
        },
        onError: (e) => {
          console.error('Live session error:', e);
          setStatusMessage('Erro na conexão. Tente novamente.');
          setIsListening(false);
          sessionRef.current?.close();
          sessionRef.current = null;
        },
        onClose: () => {
          console.log('Live session closed.');
          if (isListening) { // If it closed unexpectedly while listening
            setStatusMessage('Sessão encerrada. Pressione para falar.');
            setIsListening(false);
          }
          sessionRef.current = null;
        },
        onAudioData: handleAudioData,
      });
      sessionRef.current = session;
    } catch (error: any) {
      console.error('Failed to start live session:', error);
      setStatusMessage(`Erro: ${error.message || 'Falha ao iniciar microfone.'}`);
      setIsListening(false);
    }
  }, [isListening, currentInputTranscription, currentOutputTranscription, handleAudioData]); // Dependencies for useCallback

  const stopListening = useCallback(() => {
    if (!isListening) return;
    setStatusMessage('Processando...'); // Can show a processing state if needed
    setIsListening(false);
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
  }, [isListening]);

  useEffect(() => {
    // Clean up session if component unmounts while listening
    return () => {
      if (sessionRef.current) {
        sessionRef.current.close();
        sessionRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col items-center justify-center min-h-screen-minus-header-footer bg-white text-gray-800 p-4 pt-16 pb-20 text-center relative overflow-y-auto">
      <div className="flex-grow flex flex-col items-center justify-center w-full max-w-sm">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`
            w-48 h-48 rounded-full flex items-center justify-center shadow-lg
            transition-all duration-300 ease-in-out
            ${isListening ? 'bg-red-500 scale-105' : 'bg-blue-600 hover:bg-blue-700'}
          `}
          aria-label={isListening ? "Parar de ouvir" : "Iniciar assistente de voz"}
        >
          <MicIcon size={96} color="white" />
        </button>
        <p className="mt-8 text-xl font-semibold" aria-live="polite">{statusMessage}</p>
        <WaveformDisplay isListening={isListening} />
      </div>

      <div className="mt-8 w-full max-w-md bg-gray-50 rounded-lg p-4 shadow-inner text-left flex-shrink-0">
        <h3 className="font-bold text-lg mb-2">Transcrição:</h3>
        {transcriptionHistoryRef.current.length === 0 && !currentInputTranscription && !currentOutputTranscription && (
          <p className="text-gray-500">Nenhuma conversa ativa.</p>
        )}
        {transcriptionHistoryRef.current.map((turn, index) => (
          <div key={index} className="mb-4">
            <p className="text-blue-700 font-medium">Você: {turn.user}</p>
            <p className="text-gray-700">Assistente: {turn.model}</p>
          </div>
        ))}
        {(currentInputTranscription || currentOutputTranscription) && (
          <div className="mb-4">
            {currentInputTranscription && <p className="text-blue-700 font-medium">Você (atual): {currentInputTranscription}</p>}
            {currentOutputTranscription && <p className="text-gray-700">Assistente (atual): {currentOutputTranscription}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;