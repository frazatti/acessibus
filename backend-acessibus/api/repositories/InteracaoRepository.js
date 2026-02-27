const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class InteracaoRepository {
    async registrarAcesso(userId, linhaId) {
        const relacaoExistente = await prisma.usuarios_linhas.findFirst({
            where: {
                id_usuario: Number(userId),
                id_linha: Number(linhaId)
            }
        });

        if (relacaoExistente) {
            return await prisma.usuarios_linhas.update({
                where: {
                    id_usuario_id_linha: {
                        id_usuario: Number(userId),
                        id_linha: Number(linhaId)
                    }
                },
                data: { ultimo_acesso: new Date() }
            });
        } else {
            return await prisma.usuarios_linhas.create({
                data: {
                    id_usuario: Number(userId),
                    id_linha: Number(linhaId),
                    ultimo_acesso: new Date(),
                    favorito: false
                }
            });
        }
    }

    async getRecentes(userId) {
        return await prisma.usuarios_linhas.findMany({
            where: { id_usuario: Number(userId) },
            orderBy: { ultimo_acesso: 'desc' },
            take: 5,
            include: { linhas: true }
        });
    }

    async toggleFavorito(userId, linhaId) {
        let relacao = await this.registrarAcesso(userId, linhaId);

        return await prisma.usuarios_linhas.update({
            where: {
                id_usuario_id_linha: {
                    id_usuario: Number(userId),
                    id_linha: Number(linhaId)
                }
            },
            data: { favorito: !relacao.favorito }
        });
    }


    async listarFavoritos(userId) {
        return await prisma.usuarios_linhas.findMany({
            where: {
                id_usuario: Number(userId),
                favorito: true
            },
            include: { linhas: true }
        })
    }
}

module.exports = new InteracaoRepository();