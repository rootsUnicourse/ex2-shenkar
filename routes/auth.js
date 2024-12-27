const express = require('express');
const { signup, login } = require('../controllers/authController');
const verifyToken = require('../utils/verifyToken');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
