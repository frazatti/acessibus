import { PrismaClient } from "@prisma/client";
import type { CreateUsuarioInput, UpdateUsuarioInput, Usuario } from "../types/usuarios/types";

const prisma = new PrismaClient();

export class UsuarioRepository {
    public async create(data: CreateUsuarioInput): Promise<Usuario> {
        return await prisma.usuarios.create({
            data: data
        })
    }

    public async update(id: string, data: UpdateUsuarioInput): Promise<Usuario> {
        return await prisma.usuarios.update({
            where: { id: id },
            data: data
        })
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