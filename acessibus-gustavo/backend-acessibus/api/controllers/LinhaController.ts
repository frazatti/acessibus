import type { Request, Response } from "express";
import { LinhaService } from "../services/LinhaService";
import { InteracaoService } from "../services/InteracaoService";
import type { Linha, SearchLinhaInput } from "../types/linhas/types";
import type { AssignUsuarioToLinhaInput } from "../types/usuariosLinhas/types";

export class LinhaController {
    private linhaService: LinhaService = new LinhaService();
    private interacaoService: InteracaoService = new InteracaoService();

    public async create(req: Request, res: Response) {
        const body: Linha = req.body;

        try {
            const linha = this.linhaService.create(body.codigo, body.nome_linha, body.itinerario, body.sentido);
            return res.status(200).json(linha)
        } catch (error) {
            return res.status(500).json({ error: "Erro ao salvar linha no banco" });
        }
    }

    public async getLinhasByTermo(req: Request, res: Response) {
        const body: SearchLinhaInput = req.body;
        const termo = body.termo;
        const userId = body.userId;

        try {
            const results: Linha[] | null = await this.linhaService.getLinhasByTermo(termo);

            console.log(userId);

            if (results && results.length > 0 && userId) {
                const promessas = results.map(result =>
                    this.interacaoService.createAcesso({ id_linha: result.id, id_usuario: userId, ultimo_acesso: new Date(), favorito: false })
                );
                console.log(promessas);
                await Promise.all(promessas);
                console.log(`[Auto-Histórico] ${results.length} linhas salvas para o user ${userId}`);
            }
            return res.json(results);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error, message: "Erro interno do servidor"})
        }
    }
}