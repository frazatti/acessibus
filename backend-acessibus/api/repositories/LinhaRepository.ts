import { prisma } from "../lib/prisma";
import type { CreateLinhaInput, Linha } from "../types/linhas/types";

export class LinhaRepository {
    
    public async create(data: CreateLinhaInput): Promise<Linha> {
        return await prisma.linhas.create({
            data: data
        })
    }

    public async findByTermo(termo: string): Promise<Linha[] | null> {
        return await prisma.linhas.findMany({
            where: {
                OR: [
                    { nome_linha: { contains: termo } }, 
                    { itinerario: { contains: termo } }
                ]
            }
        });
    }

    public async findById(id: string): Promise<Linha | null> {
        return await prisma.linhas.findUnique({
            where: { id }
        });
    }
}