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
import BuyerView from './buyerview.js';
import SellerView from './sellerview.js';


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
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px'};
    const sellerIcon = <FontIcon className="material-icons">settings_input_antenna</FontIcon>;
    const buyerIcon = <FontIcon className="material-icons">explore</FontIcon>;

    return(
      <div>
      <div className="userview">
        <AppBar
          className = "appbarrs"
          title="Sygnal"
          onLeftIconButtonTouchTap={() => this.handleToggle()}
          style={{width: '100%'}}
        />
        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
          <List>
            <Subheader>{this.props.location.state.name}</Subheader>
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
            <ListItem
              primaryText="Help"
              leftIcon={<FontIcon className="material-icons">info_outline</FontIcon>}
              onTouchTap={() => this.handleClose()}
            />
          </List>
        </Drawer>

        {this.state.selectedIndex===0 ?
        <SellerView /* style={{width: '80%'}} */ /> :
        <BuyerView
          className = "buyerview"
          // style={{width: '150%'}}
        /> }

        <Paper style={{width: '100%'}} zDepth={1}>
          <BottomNavigation selectedIndex={this.state.selectedIndex}>
            <BottomNavigationItem
              label="As Seller"
              icon={sellerIcon}
              onTouchTap={() => {
                this.select(0);

              }}
            />
            <BottomNavigationItem
              label="As Buyer"
              icon={buyerIcon}
              onTouchTap={() => {
                this.select(1);
              }}
            />
          </BottomNavigation>
        </Paper>
        <small style={{alignSelf: 'center', marginTop: '20px', marginBottom: '20px'}}>2017 Sygnal.Inc</small>
      </div>
    </div>
    );
  }
}

export default UserView;
