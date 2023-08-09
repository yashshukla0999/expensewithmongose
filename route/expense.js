const express = require('express');

const auth = require('../midleware/auth');

const router = express.Router();

const path = require('path');

const jwt = require('jsonwebtoken');

const expenseController = require('../controller/expensee');

//GETEXPENSE
router.get('/getExpense', auth.authenticate, expenseController.getExpense);
//GETEXPENSE BY ID
router.get('/getExpenseByPk', expenseController.getExpenseByPk);
//ADD EXPENSE       
router.post('/addExpense', auth.authenticate, expenseController.addExpense);
//EDIT EXPENSE
router.put('/editExpense/:Nid', expenseController.editExpense);
//DELETE EXPENSE
router.delete('/deleteExpense/:Nid', auth.authenticate, expenseController.deleteExpense);
//DOWNLOAD FILE
router.get('/download', auth.authenticate, expenseController.download);

module.exports = router;