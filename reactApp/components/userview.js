import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import * as colors from 'material-ui/styles/colors';
import { List, ListItem } from 'material-ui/List';
import { convertToRaw, ContentState } from 'draft-js';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
console.log('Chilling');

export default class UserView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myDocs: [],
      docID: '',
      docPass: '',
      sharedDocID: '',
      docCreateModal: false,
      docShareModal: false
    };
  }

  handleNewDocChange(event) {
    this.setState({
      docID: event.target.value
    });
  }

  handleNewDocPassChange(event) {
    this.setState({
      docPass: event.target.value
    });
  }

  handleNewDocSubmit() {
    //update with material modal
    var self = this;
    var title = this.state.docID;
    var password = this.state.docPass;
    axios.post('https://desolate-depths-35755.herokuapp.com/newdoc', {
      title: title,
      password: password,
      editorState: JSON.stringify(convertToRaw(ContentState.createFromText('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n')))
    })
      .then(function({ data }){
        if(data.success) {
          //add new doc to mydocs
          var newMyDocs = self.state.myDocs.concat(data.document);
          self.setState({
            myDocs: newMyDocs
          });
          self.props.history.push(`/documents/${data.document._id}`);
        }else{
          console.log('failure making doc. redirect back to doc portal');
        }
      });

    self.setState({
      docID: '',
      docPass: ''
    });

  }

  handleSharedDocChange(event) {
    this.setState({
      sharedDocID: event.target.value
    });
  }

  handleSharedDocSubmit() {
    //update with material modal
    var self = this;
    var sharedDocID = this.state.sharedDocID;
    var password = this.state.docPass;
    // post to route in Backend
    axios.post('https://desolate-depths-35755.herokuapp.com/search-shared', {
      docID: sharedDocID,
      password: password
    })
      .then( function({ data }) {
        // process response and either stay on doc portal with the proper alert or redirect to populated document page
        if(data.success){
          self.props.history.push(`/documents/${sharedDocID}`);
        } else {
          self.setState({docShareModal: false});
        }
      });
  }

  onDeleteClick(docID) {
    var self = this;
    console.log('TRYING TO DELETE');
    // var docID = e.target.value;
    axios.post('https://desolate-depths-35755.herokuapp.com/deletedoc', {docID: docID})
    .then( function({data}) {
      if(data.sucess){

        var newMyDocs = self.state.myDocs.slice();
        newMyDocs = newMyDocs.filter(doc => doc._id !== docID );
        console.log('hereboihereboi', newMyDocs);
        self.setState({
          myDocs: newMyDocs
        });

      }
    });
  }

  componentWillMount() {
    //load all the documents into the state of this component under myDocs
    var self = this;

    axios.get('https://desolate-depths-35755.herokuapp.com/getdocs')
    .then(function({ data }){
      if(data.success) {
        self.setState({
          myDocs: data.found_docs
        });
      }
    });
  }

  render() {
    const createActions = [
      <TextField
        floatingLabelText="Password"
        type="text"
        style={{'boxShadow': 'none'}}
        value={this.state.docPass}
        onChange={(e) => this.handleNewDocPassChange(e)}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={() => this.handleNewDocSubmit()}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={() => this.setState({docCreateModal: false})}
      />
    ];
    const shareActions = [
      <TextField
        floatingLabelText="Password"
        type="text"
        style={{'boxShadow': 'none'}}
        value={this.state.docPass}
        onChange={(e) => this.handleNewDocPassChange(e)}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={() => this.handleSharedDocSubmit()}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={() => this.setState({docShareModal: false})}
      />
    ];
    return(
      <div className="docportal">
        <Subheader inset={true}>My Documents</Subheader>
        <div className = "docportal-main">
          {this.state.myDocs.length !== 0 ?
            <div className ='list-docs'>
              <List className = "my-docs">
                {this.state.myDocs.map( doc => {
                  return (
                    <div key={doc._id} className="listItem">
                      <ListItem
                      className="doc-item"
                      leftAvatar={<Avatar icon={<ActionAssignment />} backgroundColor={colors.blue500} />}
                      containerElement={<Link to={`/documents/${doc._id}`}></Link>}
                      primaryText={doc.title}
                    />
                     <IconButton
                       iconClassName="material-icons"
                       iconStyle={{color: colors.blue500, display: 'in-line'}}
                       onTouchTap={() => this.onDeleteClick(doc._id)}>delete_forever
                     </IconButton>
                  </div>
                  );
                })}
              </List>
            </div> : <div></div>
          }

          <div className='doc-controls'>
            <div className = "new-doc">
              <TextField
                floatingLabelText="New Document Title"
                type="text"
                style={{'boxShadow': 'none'}}
                value={this.state.docID}
                onChange={(event) => this.handleNewDocChange(event)}
              />
              <br></br>
              <RaisedButton
                label="Create Document"
                onTouchTap={() => this.setState({docCreateModal: true})}
              />
            </div>
            <div className = "shared-doc">
              <TextField
                floatingLabelText="paste a doc ID shared with you"
                type="text"
                style={{'boxShadow': 'none'}}
                value={this.state.sharedDocID}
                onChange={(event) => this.handleSharedDocChange(event)}
              />
              <br></br>
              <RaisedButton
                label="Search for Shared Doc"
                onTouchTap={() => this.setState({docShareModal: true})}
              />
            </div>
            <div className="logout">
              <Link to='/'>
                <FlatButton
                  className="button"
                  label="Log out"
                  icon={<FontIcon className='material-icons'>account_circle</FontIcon>}
                />
              </Link>
          </div>
          <div className="modals">
            <Dialog
              title="Enter a password"
              actions={createActions}
              modal={true}
              open={this.state.docCreateModal}
            />
          </div>
          <div className="modals">
            <Dialog
              title="Enter the password for shared document"
              actions={shareActions}
              modal={true}
              open={this.state.docShareModal}
            />
          </div>
        </div>
        </div>
      </div>
    );
  }

}
