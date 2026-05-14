import { LinhaRepository } from "../repositories/LinhaRepository";
import type { Linha } from "../types/linhas/types";

const linhaRepository: LinhaRepository = new LinhaRepository()

export class LinhaService {
    public async create(codigo: string, nomeLinha: string, itinerario: string, sentido: string): Promise<Linha> {
        const newLinha: Linha = await linhaRepository.create({
            codigo,
            nome_linha: nomeLinha,
            itinerario,
            sentido
        });

        return newLinha;
    }

    public async searchLinhas(termo: string): Promise<Linha[] | null> {
        if (!termo || termo.trim() === '') {
            throw new Error("O termo de busca não pode ser vazio");
        }

        const linhas: Linha[] | null = await linhaRepository.findByTerm(termo);

        if (linhas == null || linhas.length === 0) {
            return [];
        }

        return linhas;
    }

    public async findById(id: string): Promise<Linha | null> {
        const linha: Linha | null = await linhaRepository.findById(id);
        if (!linha) {
            throw new Error("Não foi possível encontrar a linha");
        }
        return linha;
    }
}
