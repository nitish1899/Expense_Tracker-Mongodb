const path = require('path');

const express = require('express');

const signupController = require('../controllers/user');

const router = express.Router();

 router.post('/signup', signupController.postSignUpDetails);

 router.post('/login', signupController.postLoginDetails);

module.exports = router;