import bcrypt from "bcryptjs";
import { UsuarioRepository } from "../repositories/UsuarioRepository";
import jwt from 'jsonwebtoken'
import type { LoginInput, LoginOutput } from "../types/auth/types";
import { LoginSchema } from "../schemas/AuthSchema";

export class AuthService {
    
    private usuarioRepository = new UsuarioRepository();
    
    public async login(data: LoginInput): Promise<LoginOutput> {
        const parsed = LoginSchema.parse(data)
        const user = await this.usuarioRepository.findUserByEmail(parsed.email);
        
        if (!user) {
            throw new Error("Email ou senha inválidos");
        }

        const isMatch = await bcrypt.compare(parsed.senha, user.senha);
        
        if (!isMatch) {
            throw new Error("Email ou senha inválidos");
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET não encontrado")
        }

        const token = jwt.sign(
            { id: user.id }, 
            secret,
            { expiresIn: '30d' }
        );

        return {
            id: user.id,
            nome: user.nome,
            email: user.email,
            foto: user.foto ?? undefined,
            token: token
        };
    }
}