const express = require('express');
const router = express.Router();
const autoController = require('../controllers/AuthController');

router.post('/login', autoController.login);
router.post('/register', autoController.register);
router.get('/find/:userId', autoController.findUser);
router.get('/users', autoController.getUsers);

module.exports = router;
