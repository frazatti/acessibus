export interface User {
  id?: string;
  nome?: string;
  email?: string;
  senha?: string;
  foto?: string;
  [key: string]: unknown;
}

export interface AuthContextType {
  signed: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
}
