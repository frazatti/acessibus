const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class LinhaRepository {
    
    async create(data) {
        return await prisma.linhas.create({
            data: data
        })
    }

    async findByTerm(termo) {
        return await prisma.linhas.findMany({
            where: {
                OR: [
                    { nome_linha: { contains: termo } }, 
                    { itinerario: { contains: termo } }
                ]
            }
        });
    }

    async findById(id) {
        return await prisma.linhas.findUnique({
            where: { id: Number(id) }
        });
    }
}

module.exports = new LinhaRepository();