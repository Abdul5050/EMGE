import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';
import AuthenticationService from '../services/AuthenticationService';

class ExpensesEdit extends Component {

  emptyExpenses = {
    firstname: '',
    lastname: '',
    age: '',
    address: '',
    copyrigtby: ''
  };

  constructor(props) {
    super(props);
	
	const user = AuthenticationService.getCurrentUser();
    this.state = {
      item: {
    firstname: '',
    lastname: '',
    age: '',
    address: '',
    copyrigtby: '',
	message: "",
	user: user
  }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      const expenses = await (await fetch(`/api/expenses/${this.props.match.params.id}`)).json();
      this.setState({item: expenses});
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = {...this.state.item};
    item[name] = value;
    this.setState({item});
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    await fetch('/api/expenses', {
      method: (item.id) ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
    }).then(
        response => {
			
			this.props.history.push('/expenses');
        },
        error => {
          //console.log("Fail! Error = " + error.toString());
          alert("This title already exist, please try a new one ");
          
        }
      );  
    
  }

  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Expenses' : 'Add Expenses'}</h2>;

    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input type="text" name="title" id="title" value={item.title || ''}
                   onChange={this.handleChange} autoComplete="title"/>
          </FormGroup>
          <FormGroup>
            <Label for="amount">Amount</Label>
            <Input type="text" name="amount" id="amount" value={item.amount || ''}
                   onChange={this.handleChange} autoComplete="amount"/>
          </FormGroup>          
          <FormGroup>
            <Label for="expensesType">Expenses Type</Label>
            <Input type="text" name="expensesType" id="expensesType" value={item.expensesType || ''}
                   onChange={this.handleChange} autoComplete="expensesType"/>
          </FormGroup>
          <FormGroup>
            <Label for="date">date</Label>
            <Input type="date" name="date" id="date" value={item.date || ''}
                   onChange={this.handleChange} autoComplete="date"/>
          </FormGroup>
          <FormGroup>
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" tag={Link} to="/expenses">Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(ExpensesEdit);