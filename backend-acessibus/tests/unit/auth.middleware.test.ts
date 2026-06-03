import { beforeEach, describe, expect, it, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { AuthMiddleware } from '../../api/middlewares/AuthMiddleware';
import { OptionalAuthMiddleware } from '../../api/middlewares/OptionalAuthMiddleware';

import type { Response } from 'express';

const makeResponse = () => ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
});

describe('AuthMiddleware', () => {
    beforeEach(() => {
        process.env.JWT_SECRET = 'test-secret';
        vi.restoreAllMocks();
    });

    it('should reject missing Authorization header', async () => {
        const req = { headers: {} } as any;
        const res = makeResponse() as unknown as Response;
        const next = vi.fn();

        await new AuthMiddleware().validation(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado. É preciso fazer login para continuar' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should accept valid Bearer token and set userId', async () => {
        const token = jwt.sign({ id: 'user-1' }, 'test-secret');
        const req = { headers: { authorization: `Bearer ${token}` } } as any;
        const res = makeResponse() as unknown as Response;
        const next = vi.fn();

        await new AuthMiddleware().validation(req, res, next);

        expect(req.userId).toBe('user-1');
        expect(next).toHaveBeenCalled();
    });
});

describe('OptionalAuthMiddleware', () => {
    beforeEach(() => {
        process.env.JWT_SECRET = 'test-secret';
        vi.restoreAllMocks();
    });

    it('should continue without token', async () => {
        const req = { headers: {} } as any;
        const res = makeResponse() as unknown as Response;
        const next = vi.fn();

        await new OptionalAuthMiddleware().validation(req, res, next);

        expect(req.userId).toBeNull();
        expect(next).toHaveBeenCalled();
    });

    it('should accept valid token when provided', async () => {
        const token = jwt.sign({ id: 'user-2' }, 'test-secret');
        const req = { headers: { authorization: `Bearer ${token}` } } as any;
        const res = makeResponse() as unknown as Response;
        const next = vi.fn();

        await new OptionalAuthMiddleware().validation(req, res, next);

        expect(req.userId).toBe('user-2');
        expect(next).toHaveBeenCalled();
    });
});
