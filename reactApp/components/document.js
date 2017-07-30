import React from 'react';
import {  Editor,
          EditorState,
          RichUtils,
          DefaultDraftBlockRenderMap,
          convertToRaw,
          convertFromRaw,
          getDefaultKeyBinding,
          KeyBindingUtil }
from 'draft-js';
import * as colors from 'material-ui/styles/colors';
import { List, ListItem } from 'material-ui/List';
import axios from 'axios';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Popover from 'material-ui/Popover';
import Dialog from 'material-ui/Dialog';
import { TwitterPicker } from 'react-color';
import { Map } from 'immutable';
// import { Link } from 'react-router-dom';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import {Tabs, Tab} from 'material-ui/Tabs';    //revision-history && toolbar tabs
// import Toggle from 'material-ui/Toggle';
// import { Link } from 'react-router-dom';
const {hasCommandModifier} = KeyBindingUtil;

const myBlockTypes = DefaultDraftBlockRenderMap.merge(new Map({
  center: {
    wrapper: <div className="center-align" />
  },
  right: {
    wrapper: <div className="right-align" />
  }
}));

class Document extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      editorState: EditorState.createEmpty(), // EditorState.createWithContent(ContentState.createFromText('hi andrew'))
      inlineStyles: {},
      fontSize: 12,
      openColorPicker: false,
      openHighlighter: false,
      open: false,
      history: [],
      tab: 'a'

    };

    this.previousHighlight = null;

    this.onChange = (editorState) => {
      // const selection = editorState.getSelection();
      //
      // if(this.previousHighlight) {
      //   console.log('andrew');
      //   editorState = EditorState.acceptSelection(editorState, this.previousHighlight);
      //   editorState = RichUtils.toggleInlineStyle(editorState, 'RED');
      //   editorState = EditorState.acceptSelection(editorState, selection);
      // }
      //
      // editorState = RichUtils.toggleInlineStyle(editorState, 'RED');
      // this.previousHighlight = editorState.getSelection();


      this.setState({editorState});
      this.props.socket.emit('onChange', {
        contentState: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
        inlineStyles: this.state.inlineStyles,
        fontSize: this.state.fontSize,
        roomName: this.props.match.params.docID
      });
      //this is where its passed
    };

    var self = this;
    this.props.socket.on('updateOnChange', function({ contentState, fontSize, inlineStyles }) {
      console.log('yayayay');
      self.setState({
        editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(contentState))),
        fontSize: fontSize,
        inlineStyles: inlineStyles
      });
      //this is where you parse
    });
  }

  componentWillMount() {
    var self = this;
    axios.post('https://sygnalapp.mybluemix.net/retrieval', {
      docID: self.props.match.params.docID
    })
    .then(function({ data }) {
      if(data.editorState) {
        // console.log('ANDREW ', data)

        var content = JSON.parse(data.editorState);
        var newInlineStyles = Object.assign({}, self.state.inlineStyles);
        content.blocks.forEach(function(block) {
          block.inlineStyleRanges.forEach(function(i) {
            if (i.style.startsWith('#')) {
              newInlineStyles[i.style] = {
                color: i.style
              };
            } else if (i.style.startsWith('highlight')) {
              newInlineStyles[i.style] = {
                backgroundColor: i.style.substring(9, 17)
              };
            }
          });
        });
        self.setState({
          editorState: EditorState.createWithContent(convertFromRaw(content)),
          title: data.title,
          inlineStyles: newInlineStyles,
          history: data.history
        });
      } else {
        self.setState({
          title: data.title
        });
      }

    });
  }

  componentDidMount() {
    this.props.socket.emit('joinRoom', this.props.match.params.docID);
  }

  handleKeyCommand(command: string): DraftHandleValue {
    if (command === 'myeditor-save') {
      this._onSaveClick();
      return 'handled';
    }
    return 'not-handled';
  }

  formatColor(color) {
    console.log('COLOR IS', color);
    var newInlineStyles = Object.assign({}, this.state.inlineStyles,
      {[color.hex]: {
        color: color.hex,
      }}
    );
    this.setState({
      inlineStyles: newInlineStyles,
      editorState: RichUtils.toggleInlineStyle(this.state.editorState, color.hex),
      openColorPicker: false
    });
  }

  highlightText(color) {
    var newInlineStyles = Object.assign({}, this.state.inlineStyles,
      {['highlight' + color.hex]: {
        backgroundColor: color.hex,
      }}
    );
    this.setState({
      inlineStyles: newInlineStyles,
      editorState: RichUtils.toggleInlineStyle(this.state.editorState, String('highlight' + color.hex)),
      openHighlighter: false
    });
    console.log("INLINESTYLES", this.state.inlineStyles);
  }

  toggleFormat(e, style, block) {
    e.preventDefault();      //prevent the editor from losing focus, can also use ref
    console.log("STYLE", style);
    if(block) {
      console.log("REACHED here");
      this.setState({
        editorState: RichUtils.toggleBlockType(
          this.state.editorState, style
        )
      });
    } else {
      this.setState({
        editorState: RichUtils.toggleInlineStyle(
          this.state.editorState, style
        )
      });
    }
  }

  formatButton({icon, style, block}) {
    return (
      <FlatButton
        backgroundColor={
          this.state.editorState.getCurrentInlineStyle().has(style) ?
          colors.blue800 :
          colors.blue200
        }
        onMouseDown={(e) => this.toggleFormat(e, style, block)}
        icon={<FontIcon className='material-icons'>{icon}</FontIcon>}
      />
    );
  }

  handleChangeComplete() {
    this.setState({
      openColorPicker: false
    });
  }

  openColorPicker(e) {
    this.setState({
      openColorPicker: true,
      colorPickerButton: e.target
    });
  }

  closeColorPicker() {
    this.setState({
      openColorPicker: false,
    });
  }

  colorPicker() {
    return (
      <div style={{display: 'inline-block'}}>
        <FlatButton
          backgroundColor={colors.blue200}
          icon={<FontIcon className='material-icons'>format_color_fill</FontIcon>}
          onClick={this.openColorPicker.bind(this)}
        />
        <Popover
          open={this.state.openColorPicker}
          anchorEl={this.state.colorPickerButton}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.closeColorPicker.bind(this)}
        >
          <TwitterPicker onChangeComplete={this.formatColor.bind(this)}/>
        </Popover>
      </div>
    );
  }

  openHighlighter(e) {
    this.setState({
      openHighlighter: true,
      highlighterButton: e.target
    });
  }

  closeHighlighter() {
    this.setState({
      openHighlighter: false,
    });
  }

  highlighter() {
    return (
      <div style={{display: 'inline-block'}}>
        <FlatButton
          backgroundColor={colors.blue200}
          icon={<FontIcon className='material-icons'>highlight</FontIcon>}
          onClick={this.openHighlighter.bind(this)}
        />
        <Popover
          open={this.state.openHighlighter}
          anchorEl={this.state.highlighterButton}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.closeHighlighter.bind(this)}
        >
          <TwitterPicker onChangeComplete={this.highlightText.bind(this)}/>
        </Popover>
      </div>
    );
  }

  applyIncreaseFontSize(shrink) {
    var newFontSize = this.state.fontSize + (shrink ? -4 : 4);
    var newInlineStyles = Object.assign({}, this.state.inlineStyles,
      {[newFontSize]: {
        fontSize: `${newFontSize}px`
      }}
    );
    this.setState({
      inlineStyles: newInlineStyles,
      editorState: RichUtils.toggleInlineStyle(this.state.editorState, String(newFontSize)),
      fontSize: newFontSize
    });
  }

  increaseFontSize(shrink) {
    return (
      <FlatButton
        backgroundColor={colors.blue200}
        onMouseDown={() => this.applyIncreaseFontSize(shrink)}
        icon={<FontIcon className='material-icons'>{shrink ? 'zoom_out' : 'zoom_in'}</FontIcon>}
      />
    );
  }

  saveReminder() {
    var self = this;

    axios.post('https://sygnalapp.mybluemix.net/retrieval', {
      docID: self.props.match.params.docID
    })
    .then(function({ data }) {

      console.log('this is the data base stuff', JSON.stringify(convertFromRaw(JSON.parse(data.editorState)).blockMap));
      console.log('this is the stuff on the document', JSON.stringify(self.state.editorState.getCurrentContent().blockMap));

      if (JSON.stringify(convertFromRaw(JSON.parse(data.editorState)).blockMap) !== JSON.stringify(self.state.editorState.getCurrentContent().blockMap)) {
        self.setState({open: true});
      } else {
        console.log('what the god');
        self.props.history.push('/doc-portal');
      }
    });
  }

  _onSaveClick() {
    var self = this;
    axios.post('https://sygnalapp.mybluemix.net/save', {
      docID: this.props.match.params.docID,
      editorState: JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())),
    })
     .then(function({data}) {
       console.log('Document successfully saved!');
       self.setState({
         history: data.history
       })
     })
     .catch(function(err) {
       console.log('There was an error', err);
     });
  }

  _handleDiscard() {
    this.setState({open: false});
    this.props.history.push('/doc-portal');
  }

  _handleSave() {
    this.setState({open: false});
    this._onSaveClick();
    this.props.history.push('/doc-portal');
  }


  _handleHistory(time) {
    var self = this;
    // post to new route and
    axios.post('https://sygnalapp.mybluemix.net/history', {
      docID: this.props.match.params.docID,
      time: time
    })
    .then(function({data}) {
      console.log('dandy ', data);
      self.setState({
        editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(data.editorState)))
      })
    })
  }

  handleTabChange(tab) {
    this.setState({
      tab: tab,
    });
  }

  render() {
    console.log('INLINE STYLES', this.state.inlineStyles);
    const actions = [
      <FlatButton
        label="Discard Changes"
        primary={true}
        onTouchTap={() => this._handleDiscard()}
      />,
      <FlatButton
        label="Save"
        primary={true}
        onTouchTap={() => this._handleSave()}
      />,
    ];
    return (
      <div className="WRAPPER">

        <div className='title'>
          <h1>{this.state.title}</h1>
          <a className="docID">{`Document ID: ${this.props.match.params.docID}`}</a>
        </div>

        <div className="navigation">
          {/* <Toggle
            label="Enable Auto-saving"
            labelPosition="right"
            style={{"margin-top": "10px"}}
           /> */}
          <FlatButton
            className="button back-docportal"
            label="Back to Documents Portal"
            icon={<FontIcon className='material-icons'>navigate_before</FontIcon>}
            onTouchTap={() => this.saveReminder()}
          />
          <FlatButton
            className="button save"
            label="Save Changes"
            icon={<FontIcon className='material-icons'>save</FontIcon>}
            onTouchTap={() => this._onSaveClick()}
          />
          <Dialog
            title="Do you want to save?"
            actions={actions}
            modal={true}
            open={this.state.open}
          />
        </div>

        <Card style={{'boxShadow': 'none'}}>
          <CardHeader
            style={{backgroundColor: "#dddeee"}}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardActions expandable={true} style={{backgroundColor: "#dddeee"}}>
            <Tabs
              value={this.state.tab}
              onChange={() => this.handleTabChange()}
              tabItemContainerStyle={{backgroundColor: colors.blue200}}
              inkBarStyle={{backgroundColor: colors.blue500}}
            >
              <Tab label="Revision History" value="a">
                <div className = "history">
                  <List>
                    {this.state.history.map( histories => {
                      return (
                        <ListItem
                          key={histories.time}
                          value={histories.time}
                          primaryText={histories.time}
                          onClick={() => this._handleHistory(histories.time)}
                        ></ListItem>
                      )
                    })}
                  </List>
                </div>
              </Tab>
              <Tab label="Toolbar" value="b">
                <div className="toolbar">
                  <div className="toolbar1">
                    <div className="toolbar-item">
                      {this.formatButton({icon: 'format_bold', style: 'BOLD'})}
                    </div>
                    <div className="toolbar-item">
                      {this.formatButton({icon: 'format_italic', style: 'ITALIC'})}
                    </div>
                    <div className="toolbar-item">
                      {this.formatButton({icon: 'format_underlined', style: 'UNDERLINE'})}
                    </div>
                    <div className="toolbar-item">
                      {this.formatButton({icon: 'format_strikethrough', style: 'STRIKETHROUGH'})}
                    </div>
                  </div>
                  <div className="toolbar2">
                    <div className="toolbar-item">
                      {this.formatButton({icon: 'format_list_numbered', style: 'ordered-list-item', block: true })}
                    </div>
                    <div className="toolbar-item">
                      {this.formatButton({icon: 'format_list_bulleted', style: 'unordered-list-item', block: true })}
                    </div>
                    <div className="toolbar-item">
                      {this.formatButton({icon: 'format_align_left', style: 'unstyled', block: true })}
                    </div>
                    <div className="toolbar-item">
                      {this.formatButton({icon: 'format_align_center', style: 'center', block: true })}
                    </div>
                    <div className="toolbar-item">
                      {this.formatButton({icon: 'format_align_right', style: 'right', block: true })}
                    </div>
                  </div>
                  <div className="toolbar3">
                    <div className="toolbar-item">
                      {this.colorPicker()}
                    </div>
                    <div className="toolbar-item">
                      {this.increaseFontSize(true)}
                    </div>
                    <div className="toolbar-item">
                      {this.increaseFontSize(false)}
                    </div>
                    <div className="toolbar-item">
                      {this.highlighter()}
                    </div>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </CardActions>
        </Card>

        <div className="container">
          <Editor
            ref="editor"
            blockRenderMap={myBlockTypes}
            customStyleMap={this.state.inlineStyles}
            editorState={this.state.editorState}
            onChange={this.onChange}
            spellCheck={true}
            handleKeyCommand={this.handleKeyCommand.bind(this)}
            keyBindingFn={myKeyBindingFn}
          />
        </div>

    </div>
    );
  }
}

function myKeyBindingFn(e: SyntheticKeyboardEvent): string {
  if (e.keyCode === 83 /* `S` key */ && hasCommandModifier(e)) {
    return 'myeditor-save';
  }
  return getDefaultKeyBinding(e);
}

export default Document;
