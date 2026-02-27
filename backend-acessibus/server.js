require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

const userRoutes = require('./api/routes/UserRoutes');
const linhaRoutes = require('./api/routes/LinhaRoutes');
const interacaoRoutes = require('./api/routes/InteracaoRoutes');
const voiceRoutes = require('./api/routes/VoiceRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// --- LOG GLOBAL (CORRIGIDO) ---
app.use((req, res, next) => {
    console.log(`[SERVER] 🟢 Recebido: ${req.method} ${req.url}`);
    
    // CORREÇÃO: Verifica se req.body existe antes de tentar ler
    if (req.body && Object.keys(req.body).length > 0) {
        console.log(`[SERVER] 📦 Body:`, req.body);
    }
    next();
});

app.use('/', userRoutes);
app.use('/', linhaRoutes);
app.use('/', interacaoRoutes);
app.use('/', voiceRoutes);

const PORT = 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log("Aguardando conexões de qualquer dispositivo na rede...");
});