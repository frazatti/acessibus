import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

// Utility functions for audio encoding/decoding
export function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768; // Convert float to 16-bit integer
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0; // Convert 16-bit int to float
    }
  }
  return buffer;
}

interface LiveSessionCallbacks {
  onMessage: (message: LiveServerMessage) => void;
  onError: (event: ErrorEvent) => void;
  onClose: (event: CloseEvent) => void;
  onAudioData: (audioBuffer: AudioBuffer) => void;
}

interface LiveSessionControls {
  sendRealtimeInput: (input: { media: { data: string; mimeType: string } }) => void;
  close: () => void;
}

let nextStartTime = 0;
const inputAudioContext = new window.AudioContext({ sampleRate: 16000 });
const outputAudioContext = new window.AudioContext({ sampleRate: 24000 });
const outputNode = outputAudioContext.createGain();
const sources = new Set<AudioBufferSourceNode>();

export const startLiveSession = async (
  callbacks: LiveSessionCallbacks,
): Promise<LiveSessionControls> => {
  // Para aplicativos cliente-side com Vite, variáveis de ambiente são acessadas via `import.meta.env`
  // e devem ser prefixadas com `VITE_` em seu arquivo `.env` (ex: VITE_API_KEY).
  // A diretriz de `@google/genai` para usar `process.env.API_KEY` é tipicamente para ambientes Node.js server-side.
  // Aqui, estamos aderindo ao espírito de usar uma variável de ambiente.
  const apiKey = import.meta.env.VITE_API_KEY as string;

  if (!apiKey) {
    console.error('API Key (VITE_API_KEY) não encontrada nas variáveis de ambiente. Verifique seu arquivo .env.');
    throw new Error('API Key não configurada. Por favor, adicione VITE_API_KEY no seu arquivo .env.');
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

  let stream: MediaStream | null = null;
  let scriptProcessor: ScriptProcessorNode | null = null;
  let mediaStreamSource: MediaStreamAudioSourceNode | null = null;

  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          console.debug('Sessão Gemini Live aberta');
          // Stream de áudio do microfone para o modelo.
          mediaStreamSource = inputAudioContext.createMediaStreamSource(stream!);
          scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
            const pcmBlob = createBlob(inputData);
            sessionPromise.then((session) => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };
          mediaStreamSource.connect(scriptProcessor);
          scriptProcessor.connect(inputAudioContext.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64EncodedAudioString) {
            nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
            const audioBuffer = await decodeAudioData(
              decode(base64EncodedAudioString),
              outputAudioContext,
              24000,
              1,
            );
            callbacks.onAudioData(audioBuffer);
            const source = outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputNode);
            source.connect(outputAudioContext.destination);
            source.addEventListener('ended', () => {
              sources.delete(source);
            });

            source.start(nextStartTime);
            nextStartTime = nextStartTime + audioBuffer.duration;
            sources.add(source);
          }

          const interrupted = message.serverContent?.interrupted;
          if (interrupted) {
            console.debug('Saída do modelo interrompida.');
            for (const source of sources.values()) {
              source.stop();
              sources.delete(source);
            }
            nextStartTime = 0;
          }
          callbacks.onMessage(message);
        },
        onerror: (e: ErrorEvent) => {
          console.error('Erro na sessão Gemini Live:', e);
          callbacks.onError(e);
        },
        onclose: (e: CloseEvent) => {
          console.debug('Sessão Gemini Live fechada', e);
          if (scriptProcessor) {
            scriptProcessor.disconnect();
            scriptProcessor.onaudioprocess = null;
          }
          if (mediaStreamSource) {
            mediaStreamSource.disconnect();
          }
          stream?.getTracks().forEach(track => track.stop());
          callbacks.onClose(e);
        },
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        systemInstruction: 'Você é um assistente de ônibus útil. Forneça informações concisas e claras sobre linhas de ônibus, horários e rotas em português.',
        inputAudioTranscription: {},
        outputAudioTranscription: {},
      },
    });

    const session = await sessionPromise;

    return {
      sendRealtimeInput: (input) => {
        session.sendRealtimeInput(input);
      },
      close: () => {
        session.close();
      },
    };

  } catch (error) {
    console.error('Erro ao configurar a sessão Live:', error);
    stream?.getTracks().forEach(track => track.stop());
    throw error;
  }
};