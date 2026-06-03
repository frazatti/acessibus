import { prisma } from "../lib/prisma";
import type { CreateUsuarioInput, UpdateUsuarioInput, Usuario } from "../types/usuarios/types";

export class UsuarioRepository {
    public async create(data: CreateUsuarioInput): Promise<Usuario> {
        return await prisma.usuarios.create({
            data: {
                nome: data.nome,
                email: data.email,
                senha: data.senha,
                foto: data.foto ?? null
            }
        });
    }

    public async update(id: string, data: UpdateUsuarioInput): Promise<Usuario> {
        const updateData: {
            nome?: string;
            email?: string;
            senha?: string;
            foto?: string | null;
        } = {};

        if (data.nome !== undefined) {
            updateData.nome = data.nome;
        }
        if (data.email !== undefined) {
            updateData.email = data.email;
        }
        if (data.senha !== undefined) {
            updateData.senha = data.senha;
        }
        if (data.foto !== undefined) {
            updateData.foto = data.foto;
        }

        return await prisma.usuarios.update({
            where: { id: id },
            data: updateData
        });
    }

    public async findUserByEmail(email: string): Promise<Usuario | null> {
        return await prisma.usuarios.findUnique({
            where: { email }
        });
    }

    public async getAllUsers(): Promise<Usuario[]> {
        return await prisma.usuarios.findMany()
    }

    public async findUserById(id: string): Promise<Usuario | null> {
        return await prisma.usuarios.findUnique({
            where: { id: id }
        })
    }
}