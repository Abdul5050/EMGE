const express = require('express');
const app = express();

var bodyParser = require('body-parser');
 
global.__basedir = __dirname;
 
const db = require('./app/config/db.config.js');

const Expenses = db.Expenses;
const Role = db.role;

let router = require('./app/routers/router.js');

const cors = require('cors')
const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(express.static('resources'));
app.use('/', router);

// Create a Server
const server = app.listen(8080, function () {
 
  let host = server.address().address
  let port = server.address().port
 
  console.log("App listening at http://%s:%s", host, port); 
})

db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync with { force: true }');
  Expenses.sync().then(() => {
    const expenses = [
      { title: 'sale of Cow', amount: '2500', 
                expensesType: 53, date: '2021-12-16', userId: '1'},
      { title: 'Ice cream', amount: '250', 
      expensesType: 31, date: '2021-12-16', userId: '1'},
      { title: 'Eva bottle water', amount: '100', 
      expensesType: 76, date: '2021-12-16', userId: '1'},
    ]
    
    for(let i=0; i<expenses.length; i++){
      Expenses.create(expenses[i]);
    }
  })
  initial();
});

function initial(){
	Role.create({
		id: 1,
		name: "USER"
	});
	
	Role.create({
		id: 2,
		name: "ADMIN"
	});
	
}