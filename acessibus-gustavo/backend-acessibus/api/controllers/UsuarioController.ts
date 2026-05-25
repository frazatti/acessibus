import { CreateUsuarioSchema } from "../schemas/UsuarioSchema";
import { UsuarioService } from "../services/UsuarioService";
import { AuthService } from "../services/AuthService";
import type { Usuario, UsuarioOutput } from "../types/usuarios/types";
import type { LoginInput, AuthRequest } from "../types/auth/types";
import type { Request, Response } from 'express'

export class UserController {
    private usuarioService: UsuarioService = new UsuarioService();
    private authService: AuthService = new AuthService();

    public async create(req: Request, res: Response) {
        try {
            console.log("[CONTROLLER] Iniciando registro...");
            const body: Usuario = req.body;

            console.log("[CONTROLLER] body recebido: ", body);

            const validated = CreateUsuarioSchema.safeParse(body);

            if (!validated.success) {
                console.log("ZOD ERROR:", validated.error.flatten())

                return res.status(409).json({ error: validated.error.flatten() })
            }

            const data = await this.usuarioService.create(validated.data);

            console.log("[CONTROLLER] Usuário criado com sucesso!");
            return res.status(201).json({ message: "usuário criado com sucesso", content: data });
        } catch (error) {

            if (error instanceof Error) {

                console.log("[CONTROLLER] 🔴 Erro no registro:", error.message);

                if (error.message === "Email inválido") {
                    return res.status(400).json({ error: error.message });
                }

            }
            console.log("[CONTROLLER] 🔴 Erro no registro:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    public async update(req: AuthRequest, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ error: "Acesso negado" });
            }

            const body: Usuario = req.body;
            const { id: _, ...data } = body;

            const updatedUser = await this.usuarioService.updateUser(userId, data);

            return res.json(updatedUser);

        } catch (error) {
            if (error instanceof Error) {

                console.log("Erro ao atualizar", error);

                if (error.message === "Email inválido, por favor, insira outro email.") {
                    return res.status(400).json({ error: error.message });
                }

                if (error.message === "Usuário não encontrado") {
                    return res.status(404).json({ error: error.message });
                }
            }
            return res.status(500).json({ error: "Falha ao atualizar usuário" });
        }
    }

    public async login(req: Request, res: Response) {
        try {
            const body: LoginInput = req.body;
            console.log(`[CONTROLLER] Login solicitado para: ${body.email}`);

            const data = await this.authService.login(body);
            console.log("[CONTROLLER] ✅ Login autorizado. Token gerado.");

            return res.status(200).json(data)
        } catch (error) {
            if (error instanceof Error) {
                console.log("[CONTROLLER] 🔴 Falha no login:", error.message);
                if (error.message === "Email ou senha inválidos") {
                    return res.status(401).json({ error: error.message });
                }
            }
            console.log("[CONTROLLER] 🔴 Falha no login:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    public async getProfile(req: AuthRequest, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ error: "Acesso negado" });
            }

            const user: UsuarioOutput = await this.usuarioService.getUserById(userId);
            return res.json(user);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Erro ao buscar perfil" });
        }
    }
}
