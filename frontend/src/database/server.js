// 1. Chamar as ferramentas que instalamos
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 2. Criar o aplicativo Express (O Servidor)
const app = express();

// 3. Configurações básicas (para entender JSON e permitir CORS)
app.use(express.json()); // O servidor vai entender dados em formato JSON
app.use(cors()); // Permite que o React converse com este servidor

// 4. Conectar o Banco de Dados (MongoDB)
// ATENÇÃO: Substitua <SUA_URL_DO_MONGO> pela sua string de conexão real
const mongoURI = 'mongodb://localhost:27017/seu-app-db'; // Exemplo local
mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB Conectado com Sucesso!'))
    .catch(err => console.log('❌ Erro na Conexão do MongoDB:', err));

// 5. Rota Simples de Teste (Como o macaco verifica se o rádio funciona)
app.get('/', (req, res) => {
    res.send('O servidor backend está funcionando! Conectado ao banco.');
});

// 6. Ligar o Servidor em uma Porta
const PORT = 3001; // Usamos 3001 para não conflitar com o React (que geralmente usa 3000)
app.listen(PORT, () => {
    console.log(`🐵 Servidor Node.js rodando na porta ${PORT}`);
});