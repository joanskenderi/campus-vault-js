const express = require('express');

const { authenticateJWT } = require('../middlewares/authenticateJWT');

const {
  createGrade,
  getGrade,
  getGrades,
  updateGrade,
} = require('../handlers/grades');

const router = express.Router();

router.post('/', authenticateJWT, createGrade);
router.get('/:id', authenticateJWT, getGrade);
router.get('/', authenticateJWT, getGrades);
router.put('/:id', authenticateJWT, updateGrade);

module.exports = router;
