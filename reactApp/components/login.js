import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardActions, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      username: '',
      password: '',
      status: ''
    };

    this.handleUser = this.handleUser.bind(this);
    this.handlePass = this.handlePass.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleUser(e) {
    this.setState({username: e.target.value});
  }

  handlePass(e) {
    this.setState({password: e.target.value});
  }

  handleSubmit() {
    var self = this;
    axios.post('https://sygnalapp.herokuapp.com/login', {
      username: this.state.username,
      password: this.state.password
    })
    .then(function({ data }) {
      console.log('This log should contain the data', data);
      if(data.success) {
        console.log('The user should be taken to maps page');
        self.props.history.push('/userview');
      } else {
        self.setState({status: 'There was a problem with logging in!'});
      }
    });
  }

  render() {
    return(
      <div className="loginContainer">
        <Card className="card">
          <CardMedia
            className="icon"
            mediaStyle={{width: "150px", height: "150px"}}
          >
            <img src='img/signal_logo.jpg' />
          </CardMedia>
          <CardTitle
            titleStyle={{textAlign: 'center'}}
            subtitleStyle={{textAlign: 'center'}}
            title="Sygnal" subtitle="For all your connective needs"/>
          <CardText>
            <p style={{color: 'red'}}>{this.state.status}</p>
            <TextField
              floatingLabelText="Username"
              type="text"
              style={{'boxShadow': 'none'}}
              value={this.state.username}
              onChange={(event) => this.handleUser(event)}
            />
            <br></br>
            <TextField
              floatingLabelText="Password"
              type="password"
              style={{'boxShadow': 'none', 'clear': 'both'}}
              value={this.state.password}
              onChange={(event) => this.handlePass(event)}
            />
            <br></br>
          </CardText>
          <CardActions>
            <RaisedButton
              label="New user"
              containerElement={<Link to='/registration'></Link>}
            />
            <RaisedButton
              label="Login"
              primary={true}
              containerElement={<Link to='/userview'></Link>}
              // onTouchTap={() => this.handleSubmit()}
            />
          </CardActions>
        </Card>
        <small style={{alignSelf: 'center', marginBottom: '20px'}}>2017 Sygnal.Inc</small>
      </div>
    );
  }

}

export default Login;
