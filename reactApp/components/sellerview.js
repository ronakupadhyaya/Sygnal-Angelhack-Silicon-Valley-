import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TimePicker from 'material-ui/TimePicker';
import Slider from 'material-ui/Slider';
import { GridList, GridTile } from 'material-ui/GridList';
import FontIcon from 'material-ui/FontIcon';

class SellerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      finished: false,
      stepIndex: 0,
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
    const styles = {
      root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        margin: '20px'
      },
      gridList: {
        width: 700,
        height: 450,
        overflowY: 'auto',
      },
    };
    const {finished, stepIndex} = this.state;
    const dashboard = [
      {
        id: 0,
        title: 'Your Wifi Analytics',
        img: 'img/seller_dash_board.png',
        featured: true,
      }, {
        id: 1,
        title: 'Select next on sale period',
        element:
                <div style={{marginTop: '70px', marginLeft: '10px', marginRight: '10px'}}>
                  <TimePicker
                    hintText="Start Wifi Sale"
                    minutesStep={20}
                  />
                  <br></br>
                  <TimePicker
                    hintText="End Wifi Sale"
                    minutesStep={20}
                  />
                </div>
      }, {
        id: 2,
        title: 'Already sold data vs Desired total',
        element: <div style={{marginTop: '120px', marginLeft: '10px', marginRight: '10px'}}>
          <Slider defaultValue={0.2} /></div>
      }
    ]

    return(
      <div className="sellerview">
        <div style={styles.root}>
          <GridList
            cols={2}
            cellHeight={200}
            padding={1}
            style={styles.gridList}
          >
            {dashboard.map((tile) => (
              <GridTile
                key={tile.id}
                title={tile.title}
                titlePosition="top"
                actionIcon={<FontIcon className="material-icons" style={{marginRight: '10px'}}>settings</FontIcon>}
                actionPosition="right"
                cols={tile.featured ? 2 : 1}
                rows={tile.featured ? 2 : 1}
              >
                {/* <img src='img/placeholder.jpg' /> */}
                {tile.img ? <img src={tile.img} style={{maxWidth: '100%', maxHeight: '100%', marginTop: '20px'}} /> : ''}
                {tile.element ? tile.element : ''}
              </GridTile>
            ))}
        </GridList>
        </div>
        {/* <div className="sellerDashboardItem">
          <p>Select Wifi on sale time</p>
          <br></br>
          <TimePicker
            hintText="Wifi Start Sale"
            minutesStep={20}
          />
          <br></br>
          <TimePicker
            hintText="Wifi End Sale"
            minutesStep={20}
          />
          <br></br>
        </div>
        <div className="sellerDashboardItem">
          <p>Percent Wifi Sold According to Plan</p>
          <br></br>
          <Slider defaultValue={0.2} />
        </div> */}
      </div>
    );
  }
}

export default SellerView;
