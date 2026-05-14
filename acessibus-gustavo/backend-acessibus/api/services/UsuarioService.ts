import { UsuarioRepository } from "../repositories/UsuarioRepository";
import type { Usuario, UsuarioOutput, UpdateUsuarioInput } from "../types/usuarios/types";
import bcrypt from "bcryptjs";

const usuarioRepository: UsuarioRepository = new UsuarioRepository()

export class UsuarioService {

    public async create(nome: string, email: string, senha: string, foto?: string): Promise<UsuarioOutput> {
        const userExists: Usuario | null = await usuarioRepository.findUserByEmail(email);

        if (userExists) {
            throw new Error("Já existe um usuário com este email");
        }

        const salt: string = await bcrypt.genSalt(10)
        const hashedPassword: string = await bcrypt.hash(senha, salt)
        const newUser = await usuarioRepository.create({
            nome,
            email,
            senha: hashedPassword,
            foto
        });

        const { senha: _, foto: newUserFoto, ...userOutput } = newUser;
        return {
            ...userOutput,
            foto: newUserFoto ?? undefined
        };
    }

    public async updateUser(id: string, data: UpdateUsuarioInput): Promise<UsuarioOutput> {
        const user: Usuario | null = await usuarioRepository.findUserById(id);
        if (!user) {
            throw new Error("Usuário não encontrado.")
        }

        if (data.email && data.email !== user.email) {
            const emailInUse = await usuarioRepository.findUserByEmail(data.email);
            if (emailInUse && emailInUse.id !== id) {
                throw new Error("Email inválido, por favor, insira outro email.");
            }
        }

        let newSenha: string | undefined;

        let updateData: UpdateUsuarioInput = {
            nome: data.nome ?? user.nome,
            email: data.email ?? user.email,
            foto: data.foto ?? user.foto ?? undefined,
        }

        if (data.senha) {
            const salt = await bcrypt.genSalt(10)
            newSenha = await bcrypt.hash(data.senha, salt)
            updateData.senha = newSenha
        }

        const updatedUser = await usuarioRepository.update(id, updateData);
        if (!updatedUser) {
            throw new Error("Falha ao atualizar usuário");
        }

        const { senha: _, foto: updatedUserFoto, ...userOutput } = updatedUser;
        return {
            ...userOutput,
            foto: updatedUserFoto ?? undefined
        };
    }

    public async getUserById(id: string): Promise<UsuarioOutput> {
        const user = await usuarioRepository.findUserById(id);
        if (!user) {
            throw new Error("Não foi possível encontrar o usuário");
        }
        const { senha: _, foto: userFoto, ...userOutput } = user;
        return {
            ...userOutput,
            foto: userFoto ?? undefined
        };
    }
}