const db = require('../config/db.config.js');
const config = require('../config/config.js');
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

const Expenses = db.Expenses;

/**
 * Save an Expenses object to database MySQL/PostgreSQL
 * @param {*} req 
 * @param {*} res 
 */

 exports.signup = (req, res) => {
	// Save User to Database
	console.log("Processing func -> SignUp");
	
	User.create({
		firstname: req.body.firstname,
        lastname: req.body.lastname,
		username: req.body.username,
        name: "USER",
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 8)
	}).then(user => {
		
			
        res.status(200).send("User registered successfully!");
            
		}).catch(err => {
			res.status(500).send("Error -> " + err);
		});
	
}

exports.signin = (req, res) => {
	console.log("Sign-In");
	
	User.findOne({
		where: {
			username: req.body.username
		}
	}).then(user => {
		if (!user) {
			return res.status(404).send('User Not Found.');
		}

		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		if (!passwordIsValid) {
			return res.status(401).send({ auth: false, accessToken: null, reason: "Invalid Password!" });
		}
		
		var token = jwt.sign({ id: user.id }, config.secret, {
		  expiresIn: 86400 // expires in 24 hours
		});
		
		res.status(200).send({ auth: true, accessToken: token, id: user.id, username: user.username, email:user.email });
		
	}).catch(err => {
		res.status(500).send('Error -> ' + err);
	});
}

exports.userContent = (req, res) => {
	User.findOne({
		where: {id: req.userId},
		attributes: ['name', 'username', 'email'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['userId', 'roleId'],
			}
		}]
	}).then(user => {
		res.status(200).json({
			"description": "User Content Page",
			"user": user
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access User Page",
			"error": err
		});
	})
}

exports.adminBoard = (req, res) => {
	User.findOne({
		where: {id: req.userId},
		attributes: ['name', 'username', 'email'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['userId', 'roleId'],
			}
		}]
	}).then(user => {
		res.status(200).json({
			"description": "Admin Board",
			"user": user
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access Admin Board",
			"error": err
		});
	})
}

exports.createExpenses = (req, res) => {
    Expenses.findOne({
		where: {
			title: req.body.title
		}
	}).then(data => {


    let expenses = {};

    try{
        // Building Expenses object from upoading request's body
        expenses.title = req.body.title;
        expenses.amount = req.body.amount;
        expenses.expensesType = req.body.expensesType;
        expenses.date = req.body.date;
        expenses.userId = req.body.user.id;
    
        // Save to MySQL database
        Expenses.create(expenses, 
                          {attributes: ['id', 'title', 'amount', 'expensesType', 'date', "userId"]})
                    .then(result => {    
                         res.status(200).json(result);
                      //res.status(200).json(result);
                    }).catch(err => {
                        res.status(500).send('Error -> ' + err);
                    });
    }catch(error){
        res.status(500).json({
            message: "Failed!",
            error: error.message
        });
    }

}).catch(err => {
    res.status(500).send('Error -> ' + err);
});

}

/**
 * Retrieve Expenses information from database
 * @param {*} req 
 * @param {*} res 
 */
exports.expenses = (req, res) => {
    // find all Expenses information from 
    try{
        Expenses.findAll({attributes: ['id', 'title', 'amount', 'expensesType', 'date', 'userId']})
        .then(expenses => {
            res.status(200).json(expenses);
        })
    }catch(error) {
        // log on console
        console.log(error);

        res.status(500).json({
            message: "Error!",
            error: error
        });
    }
}

exports.getExpenses = (req, res) => {
    Expenses.findByPk(req.params.id, 
                        {attributes: ['id', 'title', 'amount', 'expensesType', 'date', 'userId']})
        .then(expenses => {
          res.status(200).json(expenses);
        }).catch(error => {
          // log on console
          console.log(error);

          res.status(500).json({
              message: "Error!",
              error: error
          });
        })
}

exports.getExpensesbyuserid = (req, res) => {
    Expenses.findAll({
		where: {userId: req.params.id}, 
                        attributes: ['id', 'title', 'amount', 'expensesType', 'date', 'userId']
    })
        .then(expenses => {
          res.status(200).json(expenses);
        }).catch(error => {
          // log on console
          console.log(error);

          res.status(500).json({
              message: "Error!",
              error: error
          });
        })
}

/**
 * Updating a Expenses
 * @param {*} req 
 * @param {*} res 
 */
exports.updateExpenses = async (req, res) => {
    try{
        let expense = await Expenses.findByPk(req.body.id);
    
        if(!expense){
            // return a response to client
            res.status(404).json({
                message: "Not Found for updating a expenses with id = " + req.body.id,
                error: "404"
            });
        } else {    
            // update new change to database
            let updatedObject = {
                title: req.body.title,
                amount: req.body.amount,
                expensesType: req.body.expensesType,
                date: req.body.date,
                userId: req.body.user.id
            }
            let result = await Expenses.update(updatedObject,
                              { 
                                returning: true, 
                                where: {id: req.body.id},
                                attributes: ['id', 'title', 'amount', 'expensesType', 'date', 'userId']
                              }
                            );

            // return the response to client
            if(!result) {
                res.status(500).json({
                    message: "Error -> Can not update a expenses with id = " + req.params.id,
                    error: "Can NOT Updated",
                });
            }

            res.status(200).json(result);
        }
    } catch(error){
        res.status(500).json({
            message: "Error -> Can not update a expenses with id = " + req.params.id,
            error: error.message
        });
    }
}

/**
 *  Delete a expenses by ID
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteExpenses = async (req, res) => {
    try{
        let expensesId = req.params.id;
        let expenses = await Expenses.findByPk(expensesId);

        if(!expenses){
            res.status(404).json({
                message: "Does Not exist a expenses with id = " + expensesId,
                error: "404",
            });
        } else {
            await expenses.destroy();
            res.status(200);
        }
    } catch(error) {
        res.status(500).json({
            message: "Error -> Can NOT delete a expenses with id = " + req.params.id,
            error: error.message
        });
    }
}