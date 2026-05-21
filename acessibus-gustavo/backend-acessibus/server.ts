import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRoutes from './api/routes/UsuarioRoutes';
import linhaRoutes from './api/routes/LinhaRoutes';
import interacaoRoutes from './api/routes/InteracaoRoutes';
import voiceRoutes from './api/routes/VoiceRoutes';
import type { Express, Request, Response, NextFunction } from 'express';

class Server {
    private app: Express;
    private port: number;

    constructor() {
        this.app = express();
        this.port = this.getPort();
        this.setupMiddlewares();
        this.setupRoutes();
        this.setupErrorHandler();
    }

    private getPort(): number {
        const port = process.env.PORT || 3000;
        if (typeof port === 'string') {
            return parseInt(port, 10);
        }
        return port;
    }

    private setupMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use(this.requestLogger);
    }

    private requestLogger = (req: Request, res: Response, next: NextFunction): void => {
        console.log(`[SERVER] 🟢 Recebido: ${req.method} ${req.url}`);

        if (req.body && Object.keys(req.body).length > 0) {
            console.log(`[SERVER] 📦 Body:`, req.body);
        }

        next();
    };

    private setupRoutes(): void {
        this.app.use('/', userRoutes);
        this.app.use('/', linhaRoutes);
        this.app.use('/', interacaoRoutes);
        this.app.use('/', voiceRoutes);

        // 404 Handler
        this.app.use((req: Request, res: Response) => {
            res.status(404).json({ error: 'Rota não encontrada' });
        });
    }

    private setupErrorHandler(): void {
        this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.error('[SERVER] ❌ Erro:', err.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
        });
    }

    public start(): void {
        this.app.listen(this.port, '0.0.0.0', () => {
            console.log(`✅ Servidor rodando em http://localhost:${this.port}`);
            console.log('📡 Aguardando conexões de qualquer dispositivo na rede...');
        });
    }
}

const server = new Server();
server.start();