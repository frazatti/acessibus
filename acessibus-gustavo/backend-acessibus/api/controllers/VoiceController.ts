import type { Request, Response } from "express";
import { VoiceService } from "../services/VoiceService";
import { existsSync, unlinkSync } from "fs";

export class VoiceController {
    private voiceService: VoiceService = new VoiceService();

    public async transcribe(req: Request, res: Response) {
        const audioFile = req.file as Express.Multer.File | undefined;

        try {
            if (!audioFile) {
                return res.status(400).json({ error: 'nenhum áudio enviado' });
            }

            console.log("Processando áudio...", audioFile.path);

            const textoTranscrito = await this.voiceService.transcribeAudio(audioFile.path);

            console.log("Google entendeu:", textoTranscrito);

            unlinkSync(audioFile.path);

            return res.status(200).json({ text: textoTranscrito });
        } catch (error) {
            console.log("Erro na transcrição:", error);

            if (audioFile && existsSync(audioFile.path)) {
                unlinkSync(audioFile.path);
            }
            return res.status(500).json({ error: "Erro ao transcrever o áudio" });
        }
    }
}