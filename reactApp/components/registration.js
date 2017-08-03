import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardActions, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';

// or change it to axios request

class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      username: '',
      password: '',
      isSeller: false,
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
    console.log("OUR STATE BABY", this.state);
    axios.post('http://localhost:3000/register', {
      username: this.state.username,
      password: this.state.password,
      isSeller: this.state.isSeller
    })
    .then(function( {data} ) {
      console.log("RESPONSE is here", data);
      if(data.success) {
        console.log('supposed to redirect');
        self.props.history.push({
          pathname: '/userview',
          // state: { name: res.data.username }
        });
      }
    })
    .catch(function(err) {
      console.log('There is a massive error :(', err);
    });
  }

  render() {
    return(
      <div className="loginContainer">
        {/* {this.state.registerSuccess ? <Redirect to='/userview' /> : ''} */}
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
            <Checkbox
              checkedIcon={<ActionFavorite />}
              uncheckedIcon={<ActionFavoriteBorder />}
              label="Become a WiFi-seller"
              style={{marginBottom: '10px', marginTop: '20px'}}
              onCheck={() => this.setState({ isSeller: true })}
            />
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
