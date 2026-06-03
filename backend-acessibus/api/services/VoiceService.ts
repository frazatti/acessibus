import { protos, SpeechClient } from "@google-cloud/speech";
import ffmpegPath from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import { existsSync, readFileSync, unlinkSync } from "fs";

if (!ffmpegPath) {
    throw new Error("ffmpeg binary not found")
}

ffmpeg.setFfmpegPath(ffmpegPath);

export class VoiceService {
    private client = new SpeechClient();

    public convertAudio(inputPath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const outputPath = inputPath + '.wav';

            ffmpeg(inputPath)
                .toFormat('wav')
                .audioChannels(1)
                .audioFrequency(16000)
                .on('error', (error) => {
                    console.error("Erro no FFmpeg", error);
                    reject(error);
                })
                .on('end', () => {
                    resolve(outputPath);
                })
                .save(outputPath);
        });
    }

    public async transcribeAudio(originalFilePath: string) {
        let convertedFilePath: string | undefined = undefined;
        try {
            console.log("Convertendo áudio para formato compatível...")

            convertedFilePath = await this.convertAudio(originalFilePath);

            const file = readFileSync(convertedFilePath);
            const audioBytes: string = file.toString('base64');

            const audio: protos.google.cloud.speech.v1.IRecognitionAudio = { content: audioBytes };
            const config: protos.google.cloud.speech.v1.IRecognitionConfig = {
                encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16,
                sampleRateHertz: 16000,
                languageCode: 'pt-BR',
                model: 'default',
                enableAutomaticPunctuation: true
            };

            const request: protos.google.cloud.speech.v1.IRecognizeRequest = {
                audio: audio,
                config: config
            };

            console.log("Enviando para o google...")
            const [response] = await this.client.recognize(request);

            if (!response.results) {
                throw new Error("Erro ao transcrever o áudio")
            }
            const transcription = response.results
                .flatMap(result => result.alternatives ?? [])
                .map(alt => alt.transcript)
                .filter((text): text is string => Boolean(text))
                .join("\n");

            return transcription;

        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            if (convertedFilePath && existsSync(convertedFilePath)) {
                try {
                    unlinkSync(convertedFilePath);
                } catch (error) {
                    console.log(error);
                }
            }
        }

    }
}