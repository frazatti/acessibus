import express from "express";
import multer from "multer";
import { VoiceController } from "../controllers/VoiceController";

const voiceController: VoiceController = new VoiceController();
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

router.post('/transcribe', upload.single('audio'), voiceController.transcribe.bind(voiceController));

export default router;