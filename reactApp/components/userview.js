import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import * as colors from 'material-ui/styles/colors';
import { List, ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import { Card, CardActions, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import AppBar from 'material-ui/AppBar';
import Subheader from 'material-ui/Subheader';


class UserView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      finished: false,
      stepIndex: 0,
      selectedIndex: 0,
    };
  }

  select(index) {
    this.setState({selectedIndex: index});
  }

  handleToggle() {
    this.setState({open: !this.state.open});
  }

  handleClose() {
    this.setState({open: false});
  }

  handleNext() {
    const {stepIndex} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    });
  };

  handlePrev() {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return 'Tap button to draw';
      case 1:
        return 'Draw region to get WiFi from';
      case 2:
        return 'Select buying period';
      default:
        return '';
    }
  }

  render() {
    const styles = {
      block: {
        maxWidth: 250,
      },
      toggle: {
        marginBottom: 16,
      },
      thumbOff: {
        backgroundColor: '#ffcccc',
      },
      trackOff: {
        backgroundColor: '#ff9d9d',
      },
      thumbSwitched: {
        backgroundColor: 'red',
      },
      trackSwitched: {
        backgroundColor: '#ff9d9d',
      },
      labelStyle: {
        color: 'red',
      },
    };

    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px'};
    const sellerIcon = <FontIcon className="material-icons">settings_input_antenna</FontIcon>;
    const buyerIcon = <FontIcon className="material-icons">explore</FontIcon>;

    return(
      <div className="userview">
        <AppBar
          title="Sygnal"
          onLeftIconButtonTouchTap={() => this.handleToggle()}
          style={{width: '80%'}}
        />
        {/* <RaisedButton
          label="Open Drawer"
          onTouchTap={() => this.handleToggle()}
        /> */}
        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
          <List>
            <Subheader>Placeholder for username</Subheader>
            <ListItem
              primaryText="Profile"
              leftIcon={<FontIcon className="material-icons">account_circle</FontIcon>}
              onTouchTap={() => this.handleClose()}
            />
            <ListItem
              primaryText="Settings"
              leftIcon={<FontIcon className="material-icons">settings</FontIcon>}
              onTouchTap={() => this.handleClose()}
            />
          </List>
        </Drawer>
        <Card className="card">
          <CardMedia
            className="icon"
            mediaStyle={{width: "150px", height: "150px"}}
          >
            <img src='img/signal_logo.jpg' />
          </CardMedia>
          <CardTitle titleStyle={{textAlign: 'center'}} title="Sygnal" subtitle="The WiFi sharing App you wish you had"/>
          <CardText>

          </CardText>
          <CardActions>

          </CardActions>
        </Card>
        <div style={{width: '100%', maxWidth: 1000, margin: 'auto'}}>
          <Stepper activeStep={stepIndex}>
            <Step>
              <StepLabel>Tap</StepLabel>
            </Step>
            <Step>
              <StepLabel>Draw</StepLabel>
            </Step>
            <Step>
              <StepLabel>Select time</StepLabel>
            </Step>
          </Stepper>
          <div style={contentStyle}>
            {finished ? (
              <p>
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    this.setState({stepIndex: 0, finished: false});
                  }}
                >
                  Click here
                </a> to reset.
              </p>
            ) : (
              <div>
                <p>{this.getStepContent(stepIndex)}</p>
                <div style={{marginTop: 12, marginBottom: 20}}>
                  <FlatButton
                    label="Back"
                    disabled={stepIndex === 0}
                    onTouchTap={() => this.handlePrev()}
                    style={{marginRight: 12}}
                  />
                  <RaisedButton
                    label={stepIndex === 2 ? 'Finish' : 'Next'}
                    primary={true}
                    onTouchTap={() => this.handleNext()}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <Paper style={{width: '80%'}} zDepth={1}>
          <BottomNavigation selectedIndex={this.state.selectedIndex}>
            <BottomNavigationItem
              label="As Seller"
              icon={sellerIcon}
              onTouchTap={() => this.select(0)}
            />
            <BottomNavigationItem
              label="As Buyer"
              icon={buyerIcon}
              onTouchTap={() => this.select(1)}
            />
          </BottomNavigation>
        </Paper>
      </div>
    );
  }
}

export default UserView;
