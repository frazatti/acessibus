import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('../../api/lib/prisma', () => ({ prisma: {} }));
import { InteracaoRepository } from '../../api/repositories/InteracaoRepository';
import { InteracaoService } from '../../api/services/InteracaoService';

const createInteracaoSpy = vi.spyOn(InteracaoRepository.prototype, 'createInteracao');
const getRecentesSpy = vi.spyOn(InteracaoRepository.prototype, 'getRecentes');
const getFavoritosSpy = vi.spyOn(InteracaoRepository.prototype, 'getFavoritos');
const updateFavoritoSpy = vi.spyOn(InteracaoRepository.prototype, 'updateFavorito');

describe('InteracaoService', () => {
    beforeEach(() => {
        createInteracaoSpy.mockReset();
        getRecentesSpy.mockReset();
        getFavoritosSpy.mockReset();
        updateFavoritoSpy.mockReset();
        vi.clearAllMocks();
    });

    it('should create a new acesso when valid data is provided', async () => {
        createInteracaoSpy.mockResolvedValue({ id_usuario: 'user1', id_linha: 'line1', ultimo_acesso: new Date(), favorito: false, usuarios: null, linhas: null });

        const service = new InteracaoService();
        const result = await service.createAcesso({ id_usuario: 'user1', id_linha: 'line1', ultimo_acesso: new Date(), favorito: false });

        expect(result).toHaveProperty('id_usuario', 'user1');
        expect(createInteracaoSpy).toHaveBeenCalled();
    });

    it('should throw when missing data for histórico', async () => {
        const service = new InteracaoService();
        await expect(service.createAcesso({ id_usuario: '', id_linha: '', ultimo_acesso: new Date(), favorito: false }))
            .rejects.toThrow('Dados inválidos para histórico');
    });

    it('should map recent interactions into InteracaoOutput', async () => {
        getRecentesSpy.mockResolvedValue([
            { linhas: { id: 'line1', codigo: '100', nome_linha: 'Linha 100', itinerario: 'A -> B', sentido: 'Ida' }, favorito: false, ultimo_acesso: new Date() }
        ]);

        const service = new InteracaoService();
        const recentes = await service.getRecentes('user1');

        expect(recentes[0]).toMatchObject({ codigo: '100', favorito: false });
    });

    it('should map favorites results with favorito true', async () => {
        getFavoritosSpy.mockResolvedValue([
            { linhas: { id: 'line1', codigo: '100', nome_linha: 'Linha 100', itinerario: 'A -> B', sentido: 'Ida' }, favorito: true }
        ]);

        const service = new InteracaoService();
        const favoritos = await service.getFavoritos('user1');

        expect(favoritos[0]).toMatchObject({ favorito: true, codigo: '100' });
    });
});
