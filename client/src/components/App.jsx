import React, { Component } from 'react';
import {Switch, Route, NavLink } from 'react-router-dom';
import axios from "axios";

import Goals from "./Goals";
import Transaction from "./Transaction";
import Report from "./Report";
import Budget from "./Budget";

class App extends Component {
  constructor (props){
    super(props);
    this.state = {token : "", 
    username : "", 
    password : "",
    existingUser : false,
    error : {} 
    };
    axios.defaults.baseURL = '/api';

  }
  /**sets token */
  handleChange = (event) => {

    this.setState({ [event.target.name]: event.target.value });  
    console.log(this.state, "hanlde change");

  }
  handleLoad(){

  }
  /** login a user */
  handleLogIn = (event) => {
    this.setState({error: {}}); 
    var self = this; 
    var path; 
    //for existing user, signin: 
    if (self.state.existingUser === true){
      console.log("signin");
      path = "/users/signin";
      
    }
    //for new user, signup: 

    else{
      path = "/users/signup";
    }
    //ask from backend:

    axios.post(path, 
      {"email" : self.state.username,
      "password" : self.state.password})
    .then( (response) => {
      //set token: 
      self.setState({token: response.data.token });
      //catch any errors: 
    }).catch( (err)=> { 
    
      this.setState({error: err}); 
    } );

    
  }
  
  isExistingUser = (event) =>{
    var negate = ! (this.state.existingUser ) ;
    this.setState({existingUser : negate});


  }
    render() {
      var res;
      //first time up, ask for email/username and password: 
      if (this.state.token.length === 0 ){
        
        res = (
          <div>
          <input type="checkbox" value="I am an existing user" onClick={this.isExistingUser}/>
          <label > I am an existing user  </label>
          <br/>
          <br/>

          <label > email/username:  </label>
          <input type="text" name="username" value = {this.state.username} onChange={this.handleChange}  />
          <br/>
          <label > password:  </label>
          
          <input type="password" name="password" value = {this.state.password} onChange={this.handleChange}/>
          
          <input type="submit" value="login" onClick={this.handleLogIn}/>
          
          
          </div>
          );
      }

      else{
        res  = (
          <div>
            <div className = "row">
                <div className = "col-xs-offset-2 col-xs-8">
                    <div className = "page-header">
                        <h2>Dashboard</h2>
                    </div>              
                </div>
            </div>
            
            <div className = "row">
              <div className="span4">
              <div className = "col-xs-2 col-xs-offset-2">
                  <div className = "list-group">
                      <NavLink className = "list-group-item" to="/goal">Goal</NavLink>
                      <NavLink className = "list-group-item" to="/transaction">Transaction</NavLink>
                      <NavLink className = "list-group-item" to="/report">Report</NavLink>
                      <NavLink className = "list-group-item" to="/budget">Budgeting</NavLink>
                  </div>              
              </div>
              </div>
              <div className = "col-xs-6">
                <div className = "panel">
                    <div className = "panel-body">
                      <Switch>
                        <Route exact path='/transaction'render={() => (<Transaction token = {this.state.token}/>)}/>
                        <Route path='/goal'  render={() => (<Goals token = {this.state.token}/>)} />
                        <Route path='/report'  render={() => (<Report token = {this.state.token}/>)}/>
                        <Route path='/budget'  render={() => (<Budget token = {this.state.token}/>)}/>
                      
                      </Switch>
                    </div>              
                </div>
              </div>
            </div>
          </div>
        
        );
      }
    return res;
    }
  }
  
  export default App;