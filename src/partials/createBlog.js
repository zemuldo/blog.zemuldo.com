import React from 'react';
import axios from 'axios'
import ReactDOM from 'react-dom';
import debounce from 'lodash/debounce';
import {convertFromRaw,convertToRaw, Editor, EditorState,RichUtils} from 'draft-js';
import {Button,Form, Segment,Image,Header, Icon, Grid ,Loader,Input,Divider,Label,Select,Dropdown} from 'semantic-ui-react'
import config from '../environments/conf'
import EditorsForm from './editorsForm'
const env = config[process.env.NODE_ENV] || 'development'
const cats = {
    Development:'dev',
    Business:'business',
    Technology:'tech'
}
class RichEditorExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState:EditorState.createEmpty(),
            isLoaded:false,
            category:null,
            topics:null,
            termsAccept:false,
            dialogInComplete:true,
            maliza:false,
            continueEdit:false
        };
        this.handleKeyCommand = this._handleKeyCommand.bind(this);
        this.onTab = this._onTab.bind(this);
        this.toggleBlockType = this._toggleBlockType.bind(this);
        this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
        this.saveContent = this.saveContent.bind(this);
        this.handleEditorState = this.handleEditorState.bind(this);
        this.isLoading = this.isLoading.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleTopicChange = this.handleTopicChange.bind(this);
        this.handleUTAChange = this.handleUTAChange.bind(this);
        this.onFinishClick = this.onFinishClick.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
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
    publish = () => {
        const content = localStorage.getItem('draftContent');
        const blogData = JSON.parse(localStorage.getItem('blogData'))
        console.log(blogData)
        let obj = JSON.parse(content)
        let title = obj.blocks[0].text
        obj.blocks.splice(0,1)
        axios.post(env.httpURL, {
            type:cats[blogData.type],
            title:title,
            query:"newPost",
            topics:blogData.topics,
            images:["blogs_pic.jpg"],
            author:"Danstan Onyango",
            body:JSON.stringify(obj),
        })
            .then(response => {
                console.log(response)
            })
            .catch(err => {
                console.log(err)
            });
    };
    saveContent = debounce((content) => {
        window.localStorage.setItem('draftContent', JSON.stringify(convertToRaw(content)));
    }, 1000);

    componentDidMount() {
        this.handleEditorState()
    }
    handleEditorState(){
        const editorState = window.localStorage.getItem('draftContent')
        if(editorState){
            this.setState({maliza:true,continueEdit:true,editorState:EditorState.createWithContent(convertFromRaw(JSON.parse(editorState)))});
            this.isLoading(true)
        }
        else {
            this.setState({editorState : EditorState.createEmpty()});
        }
    };
    handleCategoryChange(e,data){
        console.log(data.value)
        this.setState({category:data.value,dialogInComplete:(this.state.topics && this.state.category && this.state.termsAccept)});
    }
    handleTopicChange(e,data){
        console.log(data)
        this.setState({topics:data.value,dialogInComplete:(this.state.topics && this.state.category && this.state.termsAccept)});
    }
    handleUTAChange(e,data){
        console.log(data.checked)
        this.setState({termsAccept:data.value,dialogInComplete:(this.state.topics && this.state.category && this.state.termsAccept)});
    }
    onFinishClick(){
        let blogDta = {
            type:this.state.category,
            topics:this.state.topics
        }
        window.localStorage.setItem('blogData',JSON.stringify(blogDta))
        this.setState({maliza:true})
        this.isLoading(false)
    }
    render() {
        const {editorState} = this.state;
        // If the user changes block type before entering any text, we can
        // either style the placeholder or hide it. Let's just hide it now.
        let className = 'RichEditor-editor';
        let contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder';
            }
        }
        return (
            <div>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={3}>
                        </Grid.Column>
                        <Grid.Column width={13}>
                            <Header style={{ margin:'1em 0em 0em 0em', textAlign :'left',alignment:'center'}} color='green' as='h1'>
                                Draft an article on the fly.
                            </Header>
                            {
                                this.state.maliza?
                                    <div>

                                </div>:
                                    <EditorsForm onFinishClick={this.onFinishClick} handleUTAChange={this.handleUTAChange} handleCategoryChange={this.handleCategoryChange} handleTopicChange={this.handleTopicChange} />

                            }
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column width={3}>

                        </Grid.Column>
                        <Grid.Column width={10}>
                            {
                                (this.state.maliza)?
                                    <div style={{ margin:'0em 0em 5em 0em'}}>
                                        <div className="RichEditor-root">
                                            <input
                                                style={{float:'right'}}
                                                onClick={this.publish}
                                                type="button"
                                                value="Publish"
                                            />
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
                                    </div>:
                                   <div>
                                        This should be ivisible
                                   </div>
                            }
                        </Grid.Column>
                        <Grid.Column width={3}>

                        </Grid.Column>
                    </Grid.Row>
                </Grid>

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