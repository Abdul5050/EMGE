import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ExpensesList from './components/ExpensesList';
import ExpensesEdit from './components/ExpensesEdit';
import Home from './components/Home';
import Profile from './components/Profile';
import UserPage from './components/UserPage';
import SignUp from './components/SignUp';
import AdminPage from './components/AdminPage';
import Login from './components/Login';
import './App.css';

class App extends Component {
	render() {
  return (
    <Router>
	<Switch>
	<Route path='/' exact={true} component={Home} />
	<Route path='/home' exact={true} component={Home}/>
    <Route path='/profile' exact={true} component={Profile}/>
    <Route path='/user' exact={true} component={UserPage}/>
    <Route path='/admin' exact={true} component={AdminPage}/>
    <Route path='/signin' exact={true} component={Login}/>
    <Route path='/signup' exact={true} component={SignUp}/>  
	<Route path='/expenses' exact={true} component={ExpensesList} />
	<Route path='/expenses/:id' component={ExpensesEdit} />
	</Switch>
	</Router>
  )
	}
}

export default App;
