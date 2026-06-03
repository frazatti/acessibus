import type { AssignUsuarioToLinhaInput, LinhaAssigned, UsuariosWithLinhas } from "../types/usuariosLinhas/types";
import { prisma } from "../lib/prisma";

export class InteracaoRepository {
    public async createInteracao(data : AssignUsuarioToLinhaInput): Promise<UsuariosWithLinhas> {
            return await prisma.usuarios_linhas.create({
                data,
                include: { usuarios: true, linhas: true }
            });
        }

    public async updateInteracao(data : AssignUsuarioToLinhaInput): Promise<UsuariosWithLinhas> {
            return await prisma.usuarios_linhas.update({
                where: {
                    id_usuario_id_linha: {
                        id_linha: data.id_linha,
                        id_usuario: data.id_usuario
                    }
                },
                data: { ultimo_acesso: new Date() },
                include: { usuarios: true, linhas: true }
            });
        }

    public async getRecentes(userId: string): Promise<LinhaAssigned[]> {
        return await prisma.usuarios_linhas.findMany({
            where: { id_usuario: userId },
            orderBy: { ultimo_acesso: 'desc' },
            take: 5,
            include: { linhas: true }
        });
    }

    public async updateFavorito(data: AssignUsuarioToLinhaInput): Promise<UsuariosWithLinhas> {
        return await prisma.usuarios_linhas.update({
            where: {
                id_usuario_id_linha: {
                    id_usuario: data.id_usuario,
                    id_linha: data.id_linha
                }
            },
            data: { favorito: data.favorito },
            include: { usuarios: true, linhas: true }
        });
    }


    public async getFavoritos(userId: string): Promise<LinhaAssigned[]> {
        return await prisma.usuarios_linhas.findMany({
            where: {
                id_usuario: userId,
                favorito: true
            },
            include: { linhas: true }
        })
    }

    public async getInteracao(userId: string, linhaId: string): Promise<UsuariosWithLinhas | null> {
        return await prisma.usuarios_linhas.findFirst({
            where: {
                id_usuario: userId,
                id_linha: linhaId
            },
            include: { usuarios: true, linhas: true }
        })
    }
}