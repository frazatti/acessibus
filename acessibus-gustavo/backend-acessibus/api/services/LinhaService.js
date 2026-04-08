const linhaRepository = require('../repositories/LinhaRepository')

class LinhaService {
    async registerLinha(codigo, nomeLinha, itinerario, sentido) {
        const newLinha = await linhaRepository.create({
            codigo,
            nome_linha: nomeLinha,
            itinerario,
            sentido
        });

        return newLinha;
    }

    async searchLinha(termo) {
        if (!termo || termo.trim() === '') {
            throw new Error("O termo de busca não pode ser vazio");
        }

        const linhas = await linhaRepository.findByTerm(termo);

        if (linhas.length === 0) {
            return [];
        }

        return linhas;
    }

    async findById(id) {
        const linha = await linhaRepository.findById(id);
        if (!linha) {
            throw new Error("Não foi possível encontrar a linha");
        }
        return linha;
    }
}

module.exports = new LinhaService();