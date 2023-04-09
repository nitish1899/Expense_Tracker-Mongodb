
const express = require('express');

const expenseController = require('../controllers/expense');
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.post('/add-expense', userAuthentication.authenticate, expenseController.postExpenseDetails);

router.get('/get-expense', userAuthentication.authenticate, expenseController.getExpenseDetails);

router.delete('/delete-expense/:id',userAuthentication.authenticate, expenseController.deleteExpenseDetails);

router.get('/download', userAuthentication.authenticate, expenseController.downloadexpense);

router.get('/urlTable', userAuthentication.authenticate, expenseController.getUrlTable);

module.exports = router; 