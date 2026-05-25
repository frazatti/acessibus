import { InteracaoService } from "../services/InteracaoService";
import type { AuthRequest } from "../types/auth/types";
import type { Response } from "express";
import type { AssignUsuarioToLinhaInput } from "../types/usuariosLinhas/types";

export class InteracaoController {
    private interacaoService: InteracaoService = new InteracaoService();

    public async getRecentes(req: AuthRequest, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ error: "Acesso negado" });
            }

            const recentes = await this.interacaoService.getRecentes(userId);
            return res.status(200).json(recentes);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Erro ao buscar recentes" });
        }
    }

    public async updateFavorito(req: AuthRequest, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ error: "Acesso negado" });
            }
            const body: AssignUsuarioToLinhaInput = req.body;
            const atualizado = await this.interacaoService.updateFavorito({
                ...body,
                id_usuario: userId
            });

            return res.status(200).json({ favorito: atualizado.favorito });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Erro ao atualizar favorito" });
        }
    }

    public async getFavoritos(req: AuthRequest, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ error: "Acesso negado" });
            }
            const favoritos = await this.interacaoService.getFavoritos(userId);

            return res.status(200).json(favoritos);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar favoritos" });
        }
    }
}