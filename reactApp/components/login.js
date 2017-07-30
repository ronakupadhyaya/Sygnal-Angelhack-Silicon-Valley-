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
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleUser(e) {
    this.setState({username: e.target.value});
  }

  handlePass(e) {
    this.setState({password: e.target.value});
  }

  handleSubmit() {
    // e.preventDefault();
    var self = this;
    axios.post('https://sygnalapp.mybluemix.net/login', {
      username: this.state.username,
      password: this.state.password
    })
    .then(function({ data }) {
      console.log('This log should contain the data', data);
      if(data.success) {
        console.log('The user should be taken to maps page');
        self.props.history.push('/map');
      } else {
        self.setState({status: 'There was a problem with logging in!'});
      }
    });
  }

  render() {
    return(

      <Card className="card">
          <CardMedia
            // overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
          >
            <img src='img/signal_logo.jpg' />
          </CardMedia>
          <CardTitle title="Login with us" subtitle="the WiFi sharing App that you need"/>
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
              label="To Registration"
              containerElement={<Link to='/registration'></Link>}
            />
            <RaisedButton
              label="Login"
              primary={true}
              onTouchTap={() => this.handleSubmit()}
            />
          </CardActions>
        </Card>

    );
  }

}

export default Login;
