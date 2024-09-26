const express = require('express');

const { authenticateJWT } = require('../middlewares/authenticateJWT');
const {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} = require('../handlers/users');

const router = express.Router();

router.post('/', authenticateJWT, createUser);
router.get('/:id', authenticateJWT, getUser);
router.get('/', authenticateJWT, getUsers);
router.put('/:id', authenticateJWT, updateUser);
router.delete('/:id', authenticateJWT, deleteUser);

module.exports = router;
