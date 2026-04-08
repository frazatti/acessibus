import axios from 'axios';

const API_URL = 'http://10.161.200.114:3000'; 

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
    console.log(`[AXIOS] Enviando ${config.method.toUpperCase()} para: ${config.url}`);
    console.log(`[AXIOS] Dados enviados:`, config.data);
    return config;
}, (error) => {
    console.log(`[AXIOS] Erro no envio:`, error);
    return Promise.reject(error);
});

// --- LOG DE RESPOSTA (CHEGADA) ---
api.interceptors.response.use((response) => {
    console.log(`[AXIOS] Resposta recebida de ${response.config.url}:`, response.status);
    // console.log(`[AXIOS] Dados:`, response.data); // Descomente se quiser ver tudo
    return response;
}, (error) => {
    if (error.response) {
        // O servidor respondeu, mas com erro (ex: 401, 500)
        console.log(`[AXIOS] Erro do Servidor (${error.response.status}):`, error.response.data);
    } else if (error.request) {
        // A requisição saiu, mas NINGUÉM respondeu (Provável Firewall ou IP errado)
        console.log(`[AXIOS] Sem resposta (Network Error): O servidor não foi alcançado.`);
    } else {
        console.log(`[AXIOS] Erro desconhecido:`, error.message);
    }
    return Promise.reject(error);
});

export default api;