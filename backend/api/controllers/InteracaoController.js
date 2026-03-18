const interacaoService = require('../services/InteracaoService');

class InteracaoController {
    getRecentes = async (req, res) => {
        try {
            const userId = req.userId;

            const recentes = await interacaoService.getRecentes(userId);

            return res.json(recentes);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Erro ao buscar recentes" });
        }
    }

    toggleFavorito = async (req, res) => {
        try {
            const userId = req.userId;
            const { linhaId } = req.body;
            const atualizado = await interacaoService.toggleFavorito(userId, linhaId);

            return res.json({ favorito: atualizado.favorito });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Erro ao atualizar favorito" });
        }
    }

    getFavoritos = async (req, res) => {
        try {
            const userId = req.userId;
            const favoritos = await interacaoService.getFavoritos(userId);

            return res.json(favoritos);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar favoritos" });
        }
    }
}

module.exports = new InteracaoController();