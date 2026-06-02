import request from 'supertest';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import jwt from 'jsonwebtoken';

vi.mock('../../api/lib/prisma', () => ({ prisma: {} }));

const mockFindUserByEmail = vi.fn();
const mockFindUserById = vi.fn();
const mockCreateUser = vi.fn();
const mockUpdateUser = vi.fn();
const mockFindByTermo = vi.fn();
const mockCreateLinha = vi.fn();
const mockCreateInteracao = vi.fn();
const mockUpdateFavorito = vi.fn();
const mockGetRecentes = vi.fn();
const mockGetFavoritos = vi.fn();

vi.mock('../../api/repositories/UsuarioRepository', () => {
    return {
        UsuarioRepository: class {
            findUserByEmail = mockFindUserByEmail;
            findUserById = mockFindUserById;
            create = mockCreateUser;
            update = mockUpdateUser;
        }
    };
});

vi.mock('../../api/repositories/LinhaRepository', () => {
    return {
        LinhaRepository: class {
            findByTermo = mockFindByTermo;
            create = mockCreateLinha;
        }
    };
});

vi.mock('../../api/repositories/InteracaoRepository', () => {
    return {
        InteracaoRepository: class {
            createInteracao = mockCreateInteracao;
            updateFavorito = mockUpdateFavorito;
            getRecentes = mockGetRecentes;
            getFavoritos = mockGetFavoritos;
            getInteracao = vi.fn();
        }
    };
});

process.env.JWT_SECRET = 'test-secret';

const { createApp } = await import('../../app');
const app = createApp();

describe('Backend integration routes', () => {
    beforeEach(() => {
        mockFindUserByEmail.mockReset();
        mockFindUserById.mockReset();
        mockCreateUser.mockReset();
        mockUpdateUser.mockReset();
        mockFindByTermo.mockReset();
        mockCreateLinha.mockReset();
        mockCreateInteracao.mockReset();
        mockUpdateFavorito.mockReset();
        mockGetRecentes.mockReset();
        mockGetFavoritos.mockReset();
    });

    it('should create a new user', async () => {
        mockFindUserByEmail.mockResolvedValue(null);
        mockCreateUser.mockResolvedValue({ id: 'user1', nome: 'User', email: 'user@test.com', senha: 'hash', foto: null });

        const response = await request(app)
            .post('/user')
            .send({ nome: 'User', email: 'user@test.com', senha: 'password123', foto: null });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'usuário criado com sucesso');
        expect(response.body.content.email).toBe('user@test.com');
    });

    it('should reject login with invalid credentials', async () => {
        mockFindUserByEmail.mockResolvedValue(null);

        const response = await request(app)
            .post('/auth/login')
            .send({ email: 'noone@test.com', senha: 'wrongpass' });

        expect(response.status).toBe(401);
    });

    it('should allow authenticated profile access', async () => {
        const token = jwt.sign({ id: 'user1' }, 'test-secret');
        mockFindUserById.mockResolvedValue({ id: 'user1', nome: 'User', email: 'user@test.com', senha: 'hash', foto: null });

        const response = await request(app)
            .get('/user')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.email).toBe('user@test.com');
    });

    it('should search linhas without auth and return results', async () => {
        mockFindByTermo.mockResolvedValue([{ id: 'line1', codigo: '100', nome_linha: 'Linha 100', itinerario: 'A -> B', sentido: 'Ida' }]);

        const response = await request(app)
            .post('/linha/search')
            .send({ termo: 'Linha' });

        expect(response.status).toBe(200);
        expect(response.body[0].codigo).toBe('100');
    });

    it('should update favorite when authenticated', async () => {
        const token = jwt.sign({ id: 'user1' }, 'test-secret');
        mockUpdateFavorito.mockResolvedValue({ id_usuario: 'user1', id_linha: 'line1', favorito: true, usuarios: null, linhas: null });

        const response = await request(app)
            .put('/favorite')
            .set('Authorization', `Bearer ${token}`)
            .send({ id_linha: 'line1', favorito: true });

        expect(response.status).toBe(200);
        expect(response.body.favorito).toBe(true);
    });
});
