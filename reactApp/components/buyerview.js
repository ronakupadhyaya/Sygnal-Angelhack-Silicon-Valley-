import React from 'react';
import MapView from './mapview.js';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

class BuyerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      finished: false,
      stepIndex: 0,
      tutorial: true
    };
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
    const {tutorial, finished, stepIndex} = this.state;
    console.log('rendering buyer view');
    return(
      <div className="buyerview">
        <div style={{width:"60%", height: "30%", margin: '30px'}}>
          <MapView />
        </div>
        <div style={{width: '100%', marginTop: '600px'}}>
        {tutorial ?
        <div /*style={{width: '100%', marginTop: '380px'}} */ >
          <Stepper activeStep={stepIndex} style={{backgroundColor: '#eaeff7'}} >
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
          <div style={{marginRight: '16px', marginLeft: '16px', marginBottom: '20px', textAlign: 'center'}}>
            {finished ? (
              <div>
                <FlatButton
                  label='Restart tutorial'
                  onTouchTap={(event) => {
                    event.preventDefault();
                    this.setState({stepIndex: 0, finished: false});
                  }}
                />
                <FlatButton
                  label='Hide tutorial'
                  onTouchTap={(event) => {
                    event.preventDefault();
                    this.setState({tutorial: false});
                  }}
                />
              </div>
            ) : (
              <div>
                <p>{this.getStepContent(stepIndex)}</p>
                <div style={{marginTop: '12px', marginBottom: '20px'}}>
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
        </div> : ''
        }
      </div>
      </div>
    );
  }
}

export default BuyerView;
