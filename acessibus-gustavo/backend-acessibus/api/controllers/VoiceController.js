const fs = require('fs');
const voiceService = require('../services/VoiceService');

class VoiceController {
    transcribe = async (req, res) => {
        try {
            const audioFile = req.file;

            if (!audioFile) {
                return res.status(400).json({ error: 'nenhum áudio enviado' });
            }

            console.log("Processando áudio...", audioFile.path);

            const textoTranscrito = await voiceService.transcribeAudio(audioFile.path);

            console.log("Google entendeu:", textoTranscrito);

            fs.unlinkSync(audioFile.path);

            return res.json({ text: textoTranscrito })
        } catch (error) {
            console.log("Erro na transcrição:", error);

            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(500).json({ error: "Erro ao transcrever o áudio" })
        }
    }
}

module.exports = new VoiceController();