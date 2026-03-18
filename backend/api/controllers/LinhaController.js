const linhaService = require('../services/LinhaService');
const interacaoService = require('../services/InteracaoService');

class LinhaController {
    register = async (req, res) => {
        const { codigo, nomeLinha, itinerario, sentido } = req.body;

        try {
            const linha = linhaService.registerLinha(codigo, nomeLinha, itinerario, sentido);
            return res.status(200).json(linha)
        } catch (error) {
            return res.status(500).json({ error: "Erro ao salvar linha no banco" });
        }
    }

    search = async (req, res) => {
        const termo = req.body.termo || req.query.termo;
        const userId = req.userId;

        try {
            const results = await linhaService.searchLinha(termo);
            
            console.log(userId);

            if (results.length > 0 && userId) {
                const promessas = results.map(result => 
                    interacaoService.registrarAcesso(userId, result.id)
                );
                console.log(promessas);
                await Promise.all(promessas);
                console.log(`[Auto-Histórico] ${results.length} linhas salvas para o user ${userId}`);
            }
            return res.json(results);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new LinhaController();