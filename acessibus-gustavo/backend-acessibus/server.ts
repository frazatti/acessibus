import app from './app';

const port = typeof process.env.PORT === 'string' ? parseInt(process.env.PORT, 10) : process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Servidor rodando em http://localhost:${port}`);
    console.log('📡 Aguardando conexões de qualquer dispositivo na rede...');
});