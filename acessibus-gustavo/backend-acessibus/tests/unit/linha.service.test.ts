import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('../../api/lib/prisma', () => ({ prisma: {} }));
import { LinhaRepository } from '../../api/repositories/LinhaRepository';
import { LinhaService } from '../../api/services/LinhaService';

const findByTermoSpy = vi.spyOn(LinhaRepository.prototype, 'findByTermo');
const createSpy = vi.spyOn(LinhaRepository.prototype, 'create');

describe('LinhaService', () => {
    beforeEach(() => {
        findByTermoSpy.mockReset();
        createSpy.mockReset();
        vi.clearAllMocks();
    });

    it('should create a new line', async () => {
        createSpy.mockResolvedValue({
            id: 'line-1',
            codigo: '100',
            nome_linha: 'Linha 100',
            itinerario: 'A -> B',
            sentido: 'Ida'
        });

        const service = new LinhaService();
        const linha = await service.create('100', 'Linha 100', 'A -> B', 'Ida');

        expect(linha.id).toBe('line-1');
        expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({ codigo: '100' }));
    });

    it('should return empty array when no linhas match', async () => {
        findByTermoSpy.mockResolvedValue([]);

        const service = new LinhaService();
        const results = await service.getLinhasByTermo('nonexistent');

        expect(results).toEqual([]);
    });

    it('should throw when search term is empty', async () => {
        const service = new LinhaService();
        await expect(service.getLinhasByTermo('')).rejects.toThrow('O termo de busca não pode ser vazio');
    });
});
