const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  validateToken 
} = require('../module/controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/validate', validateToken);

module.exports = router;