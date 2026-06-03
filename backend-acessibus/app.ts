import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRoutes from './api/routes/UsuarioRoutes';
import linhaRoutes from './api/routes/LinhaRoutes';
import interacaoRoutes from './api/routes/InteracaoRoutes';
import voiceRoutes from './api/routes/VoiceRoutes';
import type { Express, Request, Response, NextFunction } from 'express';

const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
    console.log(`[SERVER] 🟢 Recebido: ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log(`[SERVER] 📦 Body:`, req.body);
    }
    next();
};

export function createApp(): Express {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(requestLogger);

    app.use('/', userRoutes);
    app.use('/', linhaRoutes);
    app.use('/', interacaoRoutes);
    app.use('/', voiceRoutes);

    app.use((req: Request, res: Response) => {
        res.status(404).json({ error: 'Rota não encontrada' });
    });

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error('[SERVER] ❌ Erro:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    });

    return app;
}

const app = createApp();
export default app;
