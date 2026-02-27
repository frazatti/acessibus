const fs = require('fs');
const speech = require('@google-cloud/speech');
const ffmpeg = require('fluent-ffmpeg');
const ffmpePath = require('ffmpeg-static');
const path = require('path')

ffmpeg.setFfmpegPath(ffmpePath);

const client = new speech.SpeechClient();

class VoiceService {
    convertAudio(inputPath) {
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

    async transcribeAudio(originalFilePath) {
        let convertedFilePath = null;
        try {
            console.log("Convertendo áudio para formato compatível...")

            convertedFilePath = await this.convertAudio(originalFilePath);

            const file = fs.readFileSync(convertedFilePath);
            const audioBytes = file.toString('base64');

            const audio = { content: audioBytes };
            const config = {
                encoding: 'LINEAR16',
                sampleRateHertz: 16000,
                languageCode: 'pt-BR',
                model: 'default',
                enableAutomaticPunctuation: true
            };

            const request = {
                audio: audio,
                config: config
            };

            console.log("Enviando para o google...")
            const [response] = await client.recognize(request);

            const transcription = response.results
                .map(result => result.alternatives[0].transcript)
                .join('\n');

            return transcription;

        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            if (convertedFilePath && fs.existsSync(convertedFilePath)) {
                try {
                    fs.unlinkSync(convertedFilePath);
                } catch (error) {
                    console.log(error);
                }
            }
        }

    }
}

module.exports = new VoiceService();