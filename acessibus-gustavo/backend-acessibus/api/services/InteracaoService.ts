import { InteracaoRepository } from "../repositories/InteracaoRepository";
import type { AssignUsuarioToLinhaInput, InteracaoOutput, UsuariosWithLinhas } from "../types/usuariosLinhas/types";

export class InteracaoService {

    private interacaoRepository = new InteracaoRepository();

    public async createAcesso(data: AssignUsuarioToLinhaInput): Promise<UsuariosWithLinhas> {
        if (!data.id_usuario || !data.id_linha) {
            throw new Error("Dados inválidos para histórico");
        }
        return await this.interacaoRepository.createInteracao(data);
    }

    public async updateAcesso(data: AssignUsuarioToLinhaInput): Promise<UsuariosWithLinhas> {
        const relacaoExistente = await this.interacaoRepository.getInteracao(data.id_usuario, data.id_linha);

        if (!relacaoExistente) {
            throw new Error("Não foi encontrada uma relação entre o usuário e a linha");
        }
        return await this.interacaoRepository.updateInteracao(data);
    }
 
    public async getRecentes(userId: string): Promise<InteracaoOutput[]> {
        const recentes = await this.interacaoRepository.getRecentes(userId);

        return recentes.map(item => ({
            ...item.linhas,
            favorito: item.favorito,
            ultimoAcesso: item.ultimo_acesso
        }))
    }

    public async updateFavorito(data: AssignUsuarioToLinhaInput): Promise<UsuariosWithLinhas> {
        return await this.interacaoRepository.updateFavorito(data);
    }

    public async getFavoritos(userId: string): Promise<InteracaoOutput[]> {
        const favoritos = await this.interacaoRepository.getFavoritos(userId);

        return favoritos.map(item =>({
            ...item.linhas,
            favorito: true
        }))
    }
}