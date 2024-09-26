const express = require('express');

const { authenticateJWT } = require('../middlewares/authenticateJWT');
const { getStudyPrograms } = require('../handlers/studyPrograms');

const router = express.Router();

router.get('/', authenticateJWT, getStudyPrograms);

module.exports = router;
