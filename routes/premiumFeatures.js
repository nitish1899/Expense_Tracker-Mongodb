const express = require('express');

const premiumFeatureController = require('../controllers/premiumFeatures');
const authenticateMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/showLeaderBoard', authenticateMiddleware.authenticate, premiumFeatureController.getLeaderBoard);

module.exports = router;