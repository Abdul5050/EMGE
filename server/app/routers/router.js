
const verifySignUp = require('./verifySignUp');
const authJwt = require('./verifyJwtToken');


let express = require('express');
let router = express.Router();

const expenses = require('../controllers/controller.js');

router.post('/api/auth/signup', [verifySignUp.checkDuplicateUserNameOrEmail], expenses.signup);
router.post('/api/auth/signin', expenses.signin);
router.get('/api/test/user', [authJwt.verifyToken], expenses.userContent);
router.get('/api/test/admin', [authJwt.verifyToken, authJwt.isAdmin], expenses.adminBoard);

router.post('/api/expenses', expenses.createExpenses);
router.get('/api/expenses/:id', expenses.getExpenses);
router.get('/api/expensesbyuserid/:id', expenses.getExpensesbyuserid);
router.get('/api/expenses', expenses.expenses);
router.put('/api/expenses', expenses.updateExpenses);
router.delete('/api/expenses/:id', expenses.deleteExpenses);


module.exports = router;