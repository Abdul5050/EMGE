import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import AuthenticationService from '../services/AuthenticationService';

class ExpensesList extends Component {

  constructor(props) {
    super(props);
	
	const user = AuthenticationService.getCurrentUser();
    this.state = {expenses: [], isLoading: true, user: user};
    this.remove = this.remove.bind(this);
  }

  async componentDidMount() {
	  //const user = AuthenticationService.getCurrentUser();
    
    this.setState({isLoading: true});
	//const id = this.state.user.id;
	//alert(this.state.user.id);
  const id = this.state.user.id;
  
      //await fetch(`/api/expensesbyuserid/${id}`)
      //.then(response => response.json())
      //.then(data => this.setState({expenses: data, isLoading: false}));
	  //alert(JSON.stringify(this.state));
	  const expense = await (await fetch(`/api/expensesbyuserid/${id}`)).json();
	  //alert(JSON.stringify(expense));
      this.setState({expenses: expense, isLoading: false});
	  //alert(JSON.stringify(this.state.user.id));
  }

  async remove(id) {
    await fetch(`/api/expenses/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedExpenses = [...this.state.expenses].filter(i => i.id !== id);
      this.setState({expenses: updatedExpenses});
    });
  }

  render() {
    const {expenses, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const expensesList = expenses.map(expenses => {
      return <tr key={expenses.id}>
        <td style={{whiteSpace: 'nowrap'}}>{expenses.title}</td>
        <td>{expenses.amount}</td>
        <td>{expenses.expensesType}</td>
        <td>{expenses.date}</td>
        <td><a href={expenses.userId}>{expenses.userId}</a></td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/expenses/" + expenses.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(expenses.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to="/expenses/new">Add Expenses</Button>
          </div>
          <h3>Expenses List</h3>
          <Table className="mt-4">
            <thead>
              <tr>
                <th width="20%">Title</th>
                <th width="20%">Amount</th>
                <th width="10%">Expenses Type</th>
                <th>Date</th>
                <th>User ID</th>
                <th width="10%">Actions</th>
              </tr>
            </thead>
            <tbody>
            {expensesList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default ExpensesList;