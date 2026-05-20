import type { Response } from "express";
import type { AuthRequest, TokenPayload } from "../types/auth/types";
import { verify } from "jsonwebtoken";

export class OptionalAuthMiddleware {

    validation = (req: AuthRequest, res: Response, next: any) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            req.userId = null;
            return next();
        }

        const parts = authHeader.split(' ');

        if (parts.length !== 2) {
            req.userId = null;
            return next();
        }

        const [scheme, token] = parts as [string, string];

        if (!/^Bearer$/i.test(scheme)) {
            req.userId = null;
            return next();
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
            req.userId = null;
            return next();
        }
    }
}