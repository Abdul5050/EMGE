

module.exports = (sequelize, Sequelize) => {
	const Expenses = sequelize.define('expenses', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		title: {
			type: Sequelize.STRING,
			unique: true
		},
		amount: {
			type: Sequelize.STRING
		},
		expensesType: {
			type: Sequelize.STRING
		},
		date: {
			type: Sequelize.STRING
		},
		userId: {
			type: Sequelize.INTEGER,
			//defaultValue: "1"
		}
	});
	
	return Expenses;
}