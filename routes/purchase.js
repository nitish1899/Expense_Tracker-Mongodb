const express = require('express');

const purchaseController = require('../controllers/purchase');

const authenticateMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/premiummembership', authenticateMiddleware.authenticate, purchaseController.purchasepremium);

router.post('/updatetransactionstatusSuccess', authenticateMiddleware.authenticate, purchaseController.updateTransactionStatusSuccess);

router.post('/updatetransactionstatusFail', authenticateMiddleware.authenticate, purchaseController.updatetransactionstatusFail);

module.exports = router; 