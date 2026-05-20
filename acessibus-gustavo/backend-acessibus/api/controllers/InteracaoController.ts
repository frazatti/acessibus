import { InteracaoService } from "../services/InteracaoService";
import type { Request, Response } from "express";
import type { AssignUsuarioToLinhaInput } from "../types/usuariosLinhas/types";

export class InteracaoController {
    private interacaoService: InteracaoService = new InteracaoService();

    public async getRecentes(req: Request, res: Response) {
        try {
            const body = req.body
            const userId = body.userId;

            const recentes = await this.interacaoService.getRecentes(userId);

            return res.status(200).json(recentes);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Erro ao buscar recentes" });
        }
    }

    public async updateFavorito(req: Request, res: Response) {
        try {
            const body: AssignUsuarioToLinhaInput = req.body;
            const atualizado = await this.interacaoService.updateFavorito(body);

            return res.status(200).json({ favorito: atualizado.favorito });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Erro ao atualizar favorito" });
        }
    }

    public async getFavoritos(req: Request, res: Response) {
        try {
            const body = req.body;
            const userId = body.userId;
            const favoritos = await this.interacaoService.getFavoritos(userId);

            return res.status(200).json(favoritos);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar favoritos" });
        }
    }
}