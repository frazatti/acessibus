const interacaoRepository = require('../repositories/InteracaoRepository');

class InteracaoService {
    async registrarAcesso(userId, linhaId) {
        if (!userId || !linhaId) {
            throw new Error("Dados inválidos para histórico");
        }
        return await interacaoRepository.registrarAcesso(userId, linhaId);
    }

    async getRecentes(userId) {
        const recentes = await interacaoRepository.getRecentes(userId);

        return recentes.map(item => ({
            ...item.linhas,
            favorito: item.favorito,
            ultimoAcesso: item.ultimo_acesso
        }))
    }

    async toggleFavorito(userId, linhaId) {
        return await interacaoRepository.toggleFavorito(userId,linhaId);
    }

    async getFavoritos(userId) {
        const favoritos = await interacaoRepository.listarFavoritos(userId);

        return favoritos.map(item =>({
            ...item.linhas,
            favorito: true
        }))
    }
}

module.exports = new InteracaoService();