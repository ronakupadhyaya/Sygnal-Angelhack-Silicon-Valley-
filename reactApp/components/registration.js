import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardActions, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

// or change it to axios request

class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      username: '',
      password: ''
    };
    this.handleUser = this.handleUser.bind(this);
    this.handlePass = this.handlePass.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUser(e) {
    this.setState({username: e.target.value});
  }

  handlePass(e) {
    this.setState({password: e.target.value});
  }

  handleSubmit() {
    var self = this;
    axios.post('https://sygnalapp.mybluemix.net/register', {
      username: this.state.username,
      password: this.state.password
    })
    .then(function({ data }) {
      if(data.success) {
        self.props.history.push('/');
      }
    })
    .catch(function(err) {
      console.log('There is a massive error :)', err);
    });
  }

  render() {
    return(
      <div className="loginContainer">
        <Card className="card">
          <CardMedia
            className="icon"
            mediaStyle={{width: "200px", height: "200px"}}
          >
            <img src='img/signal_logo.jpg' />
          </CardMedia>
          <CardTitle titleStyle={{textAlign: 'center'}} title="Sygnal" subtitle="The WiFi sharing App you wish you had" />
          <CardText>
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
              style={{'boxShadow': 'none'}}
              value={this.state.password}
              onChange={(event) => this.handlePass(event)}
            />
            <br></br>
          </CardText>
          <CardActions>
            <RaisedButton
              label="To Login"
              containerElement={<Link to='/'></Link>}
            />
            <RaisedButton
              label="Register"
              primary={true}
              onTouchTap={() => this.handleSubmit()}
            />
          </CardActions>
        </Card>
        <small style={{alignSelf: 'center', marginBottom: '20px'}}>2017 Sygnal.Inc</small>
      </div>
    );
  }

}

export default Registration;
