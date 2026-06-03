import type { Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import type { AuthRequest, TokenPayload } from "../types/auth/types";

export class AuthMiddleware {
    public async validation(req: AuthRequest, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "Acesso negado. É preciso fazer login para continuar" });
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2) {
            return res.status(401).json({ error: "Erro no formato do token" });
        }

        const [scheme, token] = parts as [string, string];

        if (!/^Bearer$/i.test(String(scheme))) {
            return res.status(401).json({ error: "Token malformatado " });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ error: "Configuração de servidor inválida" });
        }

        try {
            const decoded = verify(token, jwtSecret) as TokenPayload;
            req.userId = decoded.id;
            return next();
        } catch (err) {
            return res.status(401).json({ error: "Token inválido" });
        }

    }
}