import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://10.161.200.114:3000';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const method = config.method?.toUpperCase() || 'UNKNOWN';
    console.log(`[AXIOS] Enviando ${method} para: ${config.url}`);
    console.log(`[AXIOS] Dados enviados:`, config.data);
    return config;
  },
  (error) => {
    console.log(`[AXIOS] Erro no envio:`, error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`[AXIOS] Resposta recebida de ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    if (error.response) {
      console.log(
        `[AXIOS] Erro do Servidor (${error.response.status}):`,
        error.response.data
      );
    } else if (error.request) {
      console.log(
        `[AXIOS] Sem resposta (Network Error): O servidor não foi alcançado.`
      );
    } else {
      console.log(`[AXIOS] Erro desconhecido:`, error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
