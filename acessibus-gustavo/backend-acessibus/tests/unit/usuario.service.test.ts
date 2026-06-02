import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('../../api/lib/prisma', () => ({ prisma: {} }));
import { UsuarioRepository } from '../../api/repositories/UsuarioRepository';
import bcrypt from 'bcryptjs';
import { UsuarioService } from '../../api/services/UsuarioService';

const findUserByEmailSpy = vi.spyOn(UsuarioRepository.prototype, 'findUserByEmail');
const findUserByIdSpy = vi.spyOn(UsuarioRepository.prototype, 'findUserById');
const createSpy = vi.spyOn(UsuarioRepository.prototype, 'create');
const updateSpy = vi.spyOn(UsuarioRepository.prototype, 'update');

describe('UsuarioService', () => {
    beforeEach(() => {
        findUserByEmailSpy.mockReset();
        findUserByIdSpy.mockReset();
        createSpy.mockReset();
        updateSpy.mockReset();
        vi.clearAllMocks();
    });

    it('should create a new user with hashed password', async () => {
        findUserByEmailSpy.mockResolvedValue(null);
        createSpy.mockResolvedValue({
            id: 'user-1',
            nome: 'New User',
            email: 'new@test.com',
            senha: 'hashed-password',
            foto: null
        });
        (vi.spyOn(bcrypt, 'genSalt') as unknown as { mockResolvedValue: (v: any) => void }).mockResolvedValue('salt');
        (vi.spyOn(bcrypt, 'hash') as unknown as { mockResolvedValue: (v: any) => void }).mockResolvedValue('hashed-password');

        const service = new UsuarioService();
        const created = await service.create({ nome: 'New User', email: 'new@test.com', senha: 'password123', foto: null });

        expect(created.nome).toBe('New User');
        expect(created.email).toBe('new@test.com');
        expect(created.foto).toBeUndefined();
        expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({ senha: 'hashed-password' }));
    });

    it('should reject duplicate email for create', async () => {
        findUserByEmailSpy.mockResolvedValue({ id: 'user-1', nome: 'Existing', email: 'exist@test.com', senha: 'hash', foto: null });

        const service = new UsuarioService();
        await expect(service.create({ nome: 'Existing', email: 'exist@test.com', senha: 'password123', foto: null }))
            .rejects.toThrow('Email inválido');
    });

    it('should update user and hash new password', async () => {
        findUserByIdSpy.mockResolvedValue({ id: 'user-1', nome: 'Existing', email: 'exist@test.com', senha: 'hash', foto: null });
        findUserByEmailSpy.mockResolvedValue(null);
        updateSpy.mockResolvedValue({ id: 'user-1', nome: 'Existing Update', email: 'exist@test.com', senha: 'new-hash', foto: null });
        (vi.spyOn(bcrypt, 'genSalt') as unknown as { mockResolvedValue: (v: any) => void }).mockResolvedValue('salt');
        (vi.spyOn(bcrypt, 'hash') as unknown as { mockResolvedValue: (v: any) => void }).mockResolvedValue('new-hash');

        const service = new UsuarioService();
        const updated = await service.updateUser('user-1', { nome: 'Existing Update', senha: 'new-password' });

        expect(updated.nome).toBe('Existing Update');
        expect(updateSpy).toHaveBeenCalledWith('user-1', expect.objectContaining({ senha: 'new-hash' }));
    });

    it('should throw when user to update is not found', async () => {
        findUserByIdSpy.mockResolvedValue(null);

        const service = new UsuarioService();
        await expect(service.updateUser('missing-id', { nome: 'Test' }))
            .rejects.toThrow('Usuário não encontrado.');
    });
});
