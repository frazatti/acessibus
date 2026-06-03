// src/types.ts (ADICIONE NO INÍCIO)

// Esta seção garante que o TypeScript reconheça as APIs de áudio do navegador
// e o navegador alternativo (webkitAudioContext) sem erros de compilação.
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

// O restante das suas interfaces e enums (BusLine, User, ActiveTab, LiveServerMessage) seguem abaixo.


export interface BusLine {
  id: string;
  line: string;
  timeRange: string;
  origin: string;
  destination: string;
  travelTime: string;
  isFavorite: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profilePicUrl?: string;
}

export enum ActiveTab {
  Home = 'home',
  Recents = 'recents',
  Favorites = 'favorites',
  Profile = 'profile',
  Login = 'login',
  Register = 'register'
}

// src/types.ts

// ... (rest of your types: BusLine, User, ActiveTab)

// Tipo simplificado para resolver o erro de compilação no HomePage.tsx
// src/types.ts

// ... (Suas outras interfaces e enum)

// Tipo para mensagens de sessão ao vivo (adaptado do SDK do Gemini)
export interface LiveServerMessage {
  type: 'response' | 'transcription' | 'error' | string;
  response?: {
    response?: {
      text?: string;
    };
    status?: 'ok' | string;
    candidates?: Array<{ content?: { parts: Array<{ text: string }> } }>;
  };
  transcription?: {
    role: 'user' | 'model';
    text: string;
    isFinal: boolean;
  };
  message?: string; // Para mensagens de erro
}

