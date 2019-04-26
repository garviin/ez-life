import React, {Component} from 'react';
import PubSub from 'pubsub-js';

import GoalItem from './goalItem';
import axios from 'axios';
export default class GoalList extends Component{
    constructor (props) {
    super(props);   
    this.state = {
        name : "at least 3 characters",
        amount : "at least > 1",
        preference :"1 to 5 ",
        due : "YYYY-MM-DD",
        progress : "at least > 1 for updating",
        goals: [
            {
                name:"empty" ,
                due: "YYYY-MM-DD",
                preference: 2,
                amount: 0,
                progress: 0
            }
        ],
        display: 'none',
        update: 'none',
        error : {}
       
       
    }
    axios.defaults.baseURL = '/api';
    axios.defaults.headers.common['Authorization'] = this.props.token;
    this.handleLoad();

}  
    handleChange = (event) => {
      event.preventDefault();

        this.setState({ [event.target.name]: event.target.value });
        console.log(this.state);

    }

    componentDidMount(){
        PubSub.subscribe('displayChange', (msg,display) => {
            this.setState({display})
        })
    }

   /* addGoals = (newGoals) => {
        console.log("newgoals", newGoals);
        const goals = this.state.goals;

        goals.push(newGoals);
        this.setState({goals});
    }*/

    handleAddClick = () => {
        this.setState({display: 'block'})
    }

    handleAddNew = (event) => {
      event.preventDefault();

        console.log("event");
    
          var self = this;
            axios.post('/goals', {
            name: this.state.name,
            amount: this.state.amount,
            preference: this.state.preference,
            due: this.state.due
          })
          .then(function (response) {
            self.handleLoad();

        })
          .catch(function (err) {
            self.setState({error: err});
          });
    }

    handleLoad = ()=>{
        console.log();
        var self = this; 
        axios.get('/goals')
      .then(function (response) {
        console.log("get data:" );
        var d = response.data;
        console.log(d );
        self.setState({goals: d });
      })
      .catch(function (error) {
        console.log(error);
      });
    }
    handleUpdate = (event) => {
        event.preventDefault();

        var self = this;
    
        
        axios.put('/goals', { 
          name : this.state.name, 
          progress: this.state.progress
        })
          .then(function (response) {
            self.handleLoad();
          })
          .catch(function (err) {
            self.setState({error: err});

          });
      }

    render(){
        const {goals} = this.state
        const {display} = this.state
        const {update} = this.state
        return(
            <div>
                 <table className="table table-hover">
                    <thead>
                        <tr>
                        <th>Due Date</th>
                        <th>Goal</th>
                        <th>Total Amount</th>
                        <th>Amount Saved So Far.. </th>

                        </tr>
                    </thead>
                    <tbody>
                        {goals.map((goal,index) => (
                          
                                     
                                    <GoalItem key={index} goals ={goal}/>
                                   
                            ))
                        }
                    </tbody>
                </table>
                <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">
                  Goal
                </h3>
            </div>
            <div className="panel-body"> 
              <form>
                <label > Name: </label><input type='text' name='name' value={this.state.name} 
                  onChange={this.handleChange}/>
                <label > Total Amount:</label><input type='number' name='amount' value={this.state.amount} 
                  onChange={this.handleChange}/>

                <label> Preference:</label><input type='text' name='preference' value={this.state.preference} 
                  onChange={this.handleChange}/>
                <label > Due:</label><input type='text' name='due' value={this.state.due} 
                  onChange={this.handleChange}/>
                  <label > Add Amount:</label><input type='text' name='progress' value={this.state.progress} 
                  onChange={this.handleChange}/>

                <input type="submit" value="add new" onClick={this.handleAddNew}/> 
                <input type="submit" value="update existing" onClick={this.handleUpdate}/>
              </form>
            </div>
 
            </div>
            </div>
            
        )
    }
}