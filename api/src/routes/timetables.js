const express = require('express');

const { authenticateJWT } = require('../middlewares/authenticateJWT');
const {
  createTimetable,
  getTimetables,
  updateTimetable,
  deleteTimetable,
} = require('../handlers/timetables');

const router = express.Router();

router.post('/', authenticateJWT, createTimetable);
router.get('/', authenticateJWT, getTimetables);
router.put('/:id', authenticateJWT, updateTimetable);
router.delete('/:id', authenticateJWT, deleteTimetable);

module.exports = router;
