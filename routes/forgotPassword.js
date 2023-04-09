const express = require('express');

const forgotPasswordController = require('../controllers/forgotPassword');

const router = express.Router();

router.use('/forgotPassword', forgotPasswordController.forgotpassword);

router.use('/resetPassword/:id', forgotPasswordController.resetpassword);

router.use('/updatePassword/:resetpasswordid', forgotPasswordController.updatepassword);

module.exports = router;