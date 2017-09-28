import React from 'react';
import axios from 'axios'
import ReactDOM from 'react-dom';
import debounce from 'lodash/debounce';
import {convertFromRaw,convertToRaw, Editor, EditorState,RichUtils} from 'draft-js';
import { Header, Icon, Grid ,Loader,Input} from 'semantic-ui-react'
import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'
let test = {
    "_id": "59ccd29dfb85f50aa8f734e9",
    "entityMap": {},
    "blockMap": {
        "3kd8g": {
            "key": "3kd8g",
            "type": "header-one",
            "text": "What is JavaScript",
            "characterList": [
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                }
            ],
            "depth": 0,
            "data": {}
        },
        "4b62c": {
            "key": "4b62c",
            "type": "unstyled",
            "text": "Js is one of the most popular programming languages.",
            "characterList": [
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                }
            ],
            "depth": 0,
            "data": {}
        },
        "ffuoe": {
            "key": "ffuoe",
            "type": "unstyled",
            "text": "Its the language of the web. Very pupular.",
            "characterList": [
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                }
            ],
            "depth": 0,
            "data": {}
        },
        "b6o4h": {
            "key": "b6o4h",
            "type": "unstyled",
            "text": "",
            "characterList": [],
            "depth": 0,
            "data": {}
        },
        "4rleh": {
            "key": "4rleh",
            "type": "unstyled",
            "text": "Here is a sample of js code.",
            "characterList": [
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                }
            ],
            "depth": 0,
            "data": {}
        },
        "1frnv": {
            "key": "1frnv",
            "type": "unstyled",
            "text": "",
            "characterList": [],
            "depth": 0,
            "data": {}
        },
        "2q8i2": {
            "key": "2q8i2",
            "type": "code-block",
            "text": "\"use strict\"",
            "characterList": [
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                }
            ],
            "depth": 0,
            "data": {}
        },
        "6lc9g": {
            "key": "6lc9g",
            "type": "code-block",
            "text": "let x = \"asaskhdjksahdjkas\"",
            "characterList": [
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                }
            ],
            "depth": 0,
            "data": {}
        },
        "b0mdm": {
            "key": "b0mdm",
            "type": "code-block",
            "text": "console.log(x)",
            "characterList": [
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                }
            ],
            "depth": 0,
            "data": {}
        },
        "8b7p6": {
            "key": "8b7p6",
            "type": "code-block",
            "text": "",
            "characterList": [],
            "depth": 0,
            "data": {}
        },
        "95scu": {
            "key": "95scu",
            "type": "code-block",
            "text": "Pretty Right?? Yeah. I love Js",
            "characterList": [
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                },
                {
                    "style": [],
                    "entity": null
                }
            ],
            "depth": 0,
            "data": {}
        }
    },
    "selectionBefore": {
        "anchorKey": "95scu",
        "anchorOffset": 0,
        "focusKey": "95scu",
        "focusOffset": 0,
        "isBackward": false,
        "hasFocus": true
    },
    "selectionAfter": {
        "anchorKey": "95scu",
        "anchorOffset": 30,
        "focusKey": "95scu",
        "focusOffset": 30,
        "isBackward": false,
        "hasFocus": true
    }
}
class RichEditorExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState:EditorState.createEmpty(),
            isLoading:false
        };
        this.handleKeyCommand = this._handleKeyCommand.bind(this);
        this.onTab = this._onTab.bind(this);
        this.toggleBlockType = this._toggleBlockType.bind(this);
        this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
        this.saveContent = this.saveContent.bind(this);
        this.handleEditorState = this.handleEditorState.bind(this);
        this.isLoading = this.isLoading.bind(this);
    }
    isLoading(value){
        this.setState({ isLoaded: value });
    };
    onChange = (editorState) =>{
        const contentState = editorState.getCurrentContent();
        this.setState({editorState});
        this.saveContent(contentState)
        console.log(localStorage.getItem('draftContent'))

    }
    focus = () => this.refs.editor.focus();
    _handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }
    _onTab(e) {
        const maxDepth = 4;
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
    }
    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }
    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }
    logState = () => {
        const content = localStorage.getItem('draftContent');
        console.log(content);
        let save = {
            query:"addRichText",
            title:"What is Javascript",
            queryParam:{draftConten:content}
        }
        axios.post("http://localhost:8090",save)

            .then(function (success) {
                console.log(success)
            })
            .catch(function (err) {
                console.log(err)
            })
    };
    saveContent = debounce((content) => {
        window.localStorage.setItem('draftContent', JSON.stringify(convertToRaw(content)));
        fetch('http://localhost:8090', {
            query:"addRichText",
          method: 'POST',
          body: JSON.stringify({
            queryParam:{content: convertToRaw(content),}
          }),
          headers: new Headers({
            'Content-Type': 'application/json'
          })
        })
      }, 1000);

      componentDidMount() {
        this.handleEditorState()
      }
      handleEditorState(){
          axios.post(env.httpURL, {
            "query":"getRichText",
            "queryParam":{}
        })
            .then(response => {
                const draftState = response.data[0].draftConten
                this.setState({editorState:EditorState.createWithContent(convertFromRaw(JSON.parse(draftState))),isLoading:true});
            })
            .catch(exception => {
               this.state.editorState = EditorState.createEmpty();
            });
    };
    render() {
        const {editorState} = this.state;
        // If the user changes block type before entering any text, we can
        // either style the placeholder or hide it. Let's just hide it now.
        let className = 'RichEditor-editor';
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder';
            }
        }
        return (
           <div>
               {
                   this.state.isLoading?<div>
               <div className="RichEditor-root">
                   <BlockStyleControls
                       editorState={editorState}
                       onToggle={this.toggleBlockType}
                   />
                   <InlineStyleControls
                       editorState={editorState}
                       onToggle={this.toggleInlineStyle}
                   />
                   <div className={className} onClick={this.focus}>
                       <Editor
                           blockStyleFn={getBlockStyle}
                           customStyleMap={styleMap}
                           editorState={editorState}
                           handleKeyCommand={this.handleKeyCommand}
                           onChange={this.onChange}
                           onTab={this.onTab}
                           placeholder="Tell a story..."
                           ref="editor"
                           spellCheck={true}
                       />
                   </div>
               </div>
               <input
                   onClick={this.logState}
                   type="button"
                   value="Log State"
               />
           </div>:
           <Loader active inline='centered' />
               }
           </div>
        );
    }
}
// Custom overrides for "code" style.
const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
};
function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote';
        default: return null;
    }
}
class StyleButton extends React.Component {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }
    render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' RichEditor-activeButton';
        }
        return (
            <span className={className} onMouseDown={this.onToggle}>
              {this.props.label}
            </span>
        );
    }
}
const BLOCK_TYPES = [
    {label: 'H1', style: 'header-one'},
    {label: 'H2', style: 'header-two'},
    {label: 'H3', style: 'header-three'},
    {label: 'H4', style: 'header-four'},
    {label: 'H5', style: 'header-five'},
    {label: 'H6', style: 'header-six'},
    {label: 'Blockquote', style: 'blockquote'},
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'},
    {label: 'Code Block', style: 'code-block'},
];
const BlockStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};
var INLINE_STYLES = [
    {label: 'Bold', style: 'BOLD'},
    {label: 'Italic', style: 'ITALIC'},
    {label: 'Underline', style: 'UNDERLINE'},
    {label: 'Monospace', style: 'CODE'},
];
const InlineStyleControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map(type =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};


export default RichEditorExample