import { LinhaRepository } from "../repositories/LinhaRepository";
import type { Linha } from "../types/linhas/types";

export class LinhaService {

    private linhaRepository = new LinhaRepository();

    public async create(codigo: string, nomeLinha: string, itinerario: string, sentido: string): Promise<Linha> {
        const newLinha: Linha = await this.linhaRepository.create({
            codigo,
            nome_linha: nomeLinha,
            itinerario,
            sentido
        });

        return newLinha;
    }

    public async getLinhasByTermo(termo: string): Promise<Linha[] | null> {
        if (!termo || termo.trim() === '') {
            throw new Error("O termo de busca não pode ser vazio");
        }

        const linhas: Linha[] | null = await this.linhaRepository.findByTermo(termo);

        if (linhas == null || linhas.length === 0) {
            return [];
        }

        return linhas;
    }

    public async findById(id: string): Promise<Linha | null> {
        const linha: Linha | null = await this.linhaRepository.findById(id);
        if (!linha) {
            throw new Error("Não foi possível encontrar a linha");
        }
        return linha;
    }
}
