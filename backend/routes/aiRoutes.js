const express = require('express');
const multer = require('multer');
const { matchResumeToJobs } = require('../controllers/aiController');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze-resume', upload.single('resume'), matchResumeToJobs);

module.exports = router;