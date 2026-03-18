const express = require('express');
const voiceController = require('../controllers/VoiceController');
const multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

router.post('/transcribe', upload.single('audio'), voiceController.transcribe);

module.exports = router;