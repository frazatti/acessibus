export interface BusLine {
  id: string | number;
  nome_linha?: string;
  nome?: string;
  itinerario?: string;
  favorito?: boolean;
  [key: string]: unknown;
}

export interface ApiErrorResponse {
  error?: string;
  message?: string;
  [key: string]: unknown;
}
