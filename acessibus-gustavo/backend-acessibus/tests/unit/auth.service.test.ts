import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('../../api/lib/prisma', () => ({ prisma: {} }));
import bcrypt from 'bcryptjs';
import { AuthService } from '../../api/services/AuthService';
import { UsuarioRepository } from '../../api/repositories/UsuarioRepository';
import type { LoginInput } from '../../api/types/auth/types';

const findUserByEmailSpy = vi.spyOn(UsuarioRepository.prototype, 'findUserByEmail');

describe('AuthService', () => {
    beforeEach(() => {
        process.env.JWT_SECRET = 'test-secret';
        findUserByEmailSpy.mockReset();
        vi.clearAllMocks();
    });

    it('should return token and user data when credentials are correct', async () => {
        const service = new AuthService();
        findUserByEmailSpy.mockResolvedValue({
            id: 'user-1',
            nome: 'Test User',
            email: 'user@test.com',
            senha: 'hashed-password',
            foto: null
        });

        (vi.spyOn(bcrypt, 'compare') as unknown as { mockResolvedValue: (v: any) => void }).mockResolvedValue(true);

        const input: LoginInput = {
            email: 'user@test.com',
            senha: 'password123'
        };

        const result = await service.login(input);

        expect(result.id).toBe('user-1');
        expect(result.email).toBe('user@test.com');
        expect(result.token).toBeTypeOf('string');
    });

    it('should throw when user does not exist', async () => {
        const service = new AuthService();
        findUserByEmailSpy.mockResolvedValue(null);
        (vi.spyOn(bcrypt, 'compare') as unknown as { mockResolvedValue: (v: any) => void }).mockResolvedValue(false);

        await expect(service.login({ email: 'missing@test.com', senha: 'password123' }))
            .rejects.toThrow('Email ou senha inválidos');
    });

    it('should throw when password does not match', async () => {
        const service = new AuthService();
        findUserByEmailSpy.mockResolvedValue({
            id: 'user-1',
            nome: 'Test User',
            email: 'user@test.com',
            senha: 'hashed-password',
            foto: null
        });
        (vi.spyOn(bcrypt, 'compare') as unknown as { mockResolvedValue: (v: any) => void }).mockResolvedValue(false);

        await expect(service.login({ email: 'user@test.com', senha: 'wrongpass' }))
            .rejects.toThrow('Email ou senha inválidos');
    });

    it('should throw when JWT_SECRET is not configured', async () => {
        const service = new AuthService();
        process.env.JWT_SECRET = '';
        findUserByEmailSpy.mockResolvedValue({
            id: 'user-1',
            nome: 'Test User',
            email: 'user@test.com',
            senha: 'hashed-password',
            foto: null
        });
        (vi.spyOn(bcrypt, 'compare') as unknown as { mockResolvedValue: (v: any) => void }).mockResolvedValue(true);

        await expect(service.login({ email: 'user@test.com', senha: 'password123' }))
            .rejects.toThrow('JWT_SECRET não encontrado');
    });
});
