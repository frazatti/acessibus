import { PrismaClient } from "@prisma/client";
import type { CreateLinhaInput, Linha } from "../types/linhas/types";

const prisma: PrismaClient = new PrismaClient();

export class LinhaRepository {
    
    public async create(data: CreateLinhaInput): Promise<Linha> {
        return await prisma.linhas.create({
            data: data
        })
    }

    public async findByTerm(termo: string): Promise<Linha[] | null> {
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
            where: { id: Number(id) }
        });
    }
}