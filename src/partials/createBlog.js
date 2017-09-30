import React,{Component} from 'react'
import axios from 'axios'
import ReactDOM from 'react-dom';
import ShowPreview from './showPreview'
import debounce from 'lodash/debounce';
import {convertFromRaw,convertToRaw, Editor, EditorState,RichUtils} from 'draft-js';
import {Button,Form, Segment,Image,Header,Confirm, Icon,Modal, Grid ,Loader,Input,Divider,Label,Select,Dropdown} from 'semantic-ui-react'
import config from '../environments/conf'
import EditorsForm from './editorsForm'
const env = config[process.env.NODE_ENV] || 'development'
const cats = {
    Development:'dev',
    Business:'business',
    Technology:'tech'
}
class NestedModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Modal
                dimmer={false}
                open={this.props.confirmOpen}
                onOpen={this.open}
                onClose={this.close}
                size='small'
                trigger={<Button primary icon>Proceed <Icon name='right chevron' /></Button>}
            >
                <Modal.Header>Modal #2</Modal.Header>
                <Modal.Content>
                    <p>That's everything!</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button icon='check' content='cancel' onClick={this.props.handleCancel} />
                    <Button icon='check' content='confrm' onClick={this.props.handleConfirm} />
                </Modal.Actions>
            </Modal>
        )
    }
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
            filledForm:false,
            continueEdit:false,
            isPublished:false,
            open:false,
            previewOpen:false,
            confirmOpen:false
        };
        this.handleKeyCommand = this._handleKeyCommand.bind(this);
        this.onTab = this._onTab.bind(this);
        this.toggleBlockType = this._toggleBlockType.bind(this);
        this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
        this.saveContent = this.saveContent.bind(this);
        this.handleEditorState = this.handleEditorState.bind(this);
        this.publish = this.publish.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleTopicChange = this.handleTopicChange.bind(this);
        this.handleUTAChange = this.handleUTAChange.bind(this);
        this.onFinishClick = this.onFinishClick.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.reinInitEditorState=this.reinInitEditorState.bind(this)
    }
    isLoading(value){
        this.setState({ isLoaded: value });
    };
    onChange = (editorState) =>{
        const contentState = editorState.getCurrentContent();
        this.setState({editorState});
        this.saveContent(contentState)
        this.setState({hasSavedContent:false})

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
        this.setState({ open: true })
        const content = localStorage.getItem('draftContent');
        const blogData = JSON.parse(localStorage.getItem('blogData'))
        if(content && blogData){
            let obj = JSON.parse(content)
            let title = obj.blocks[0].text
            obj.blocks.splice(0,1)
            axios.post(env.httpURL, {
                type:cats[blogData.type],
                title:title,
                query:"publish",
                topics:blogData.topics,
                images:["blogs_pic.jpg"],
                author:"Danstan Onyango",
                body:JSON.stringify(obj),
                hasSavedContent:true,
                accepted:false,
                publishing:false
            })
                .then(function (response) {
                    if(response.data.state===true){
                        window.localStorage.removeItem('blogData')
                        window.localStorage.removeItem('draftContent')
                        localStorage.clear();
                        this.setState({isPublished:true,filledForm:true})
                        console.log(this.state.filledForm)

                    }
                    else {
                    }
                    this.closePreview()
                }.bind(this))

                .catch(function (err) {
                    this.setState({filledForm:true})
                    this.setState({isPublished:false})
                }.bind(this))
        }
        else{

        }

    };
    saveContent = debounce((content) => {
        window.localStorage.setItem('draftContent', JSON.stringify(convertToRaw(content)));
    }, 1000);
    componentDidMount() {
        this.handleEditorState()
    }
    handleEditorState(){
        const editorState = window.localStorage.getItem('draftContent')
        const blogDataState = window.localStorage.getItem('blogData')
        if(editorState && blogDataState){
            this.setState({hasSavedContent:false,filledForm:true,continueEdit:true,editorState:EditorState.createWithContent(convertFromRaw(JSON.parse(editorState)))});
        }
        else {
            this.setState({filledForm:true,editorState : EditorState.createEmpty()});
        }
    };
    handleCategoryChange(e,data){
        this.setState({category:data.value,dialogInComplete:(this.state.topics && this.state.category && this.state.termsAccept)});
    }
    handleTopicChange(e,data){
        this.setState({topics:data.value,dialogInComplete:(this.state.topics && this.state.category && this.state.termsAccept)});
    }
    handleUTAChange(e,data){
        this.setState({termsAccept:data.value,dialogInComplete:(this.state.topics && this.state.category && this.state.termsAccept)});
    }
    onFinishClick(){
        let blogDta = {
            type:this.state.category,
            topics:this.state.topics
        }
        window.localStorage.setItem('blogData',JSON.stringify(blogDta))
        this.setState({filledForm:false})
    }
    startPublish = ()=>{
        this.showPreview()
    }
    showConfirm = () => {
        this.setState({ confirmOpen: true })
    }
    showPreview=()=>{
        this.setState({ previewOpen: true })
    }
    closePreview=()=>{
        this.setState({ previewOpen: false })
    }
    handleConfirm = () => {
        this.closePreview()
        this.setState({startPublish:true, confirmOpen: false })
        this.publish()
    }
    handleCancel = () =>{
        this.reinInitEditorState(this.state.editorState)
        this.closePreview()
        this.setState({ confirmOpen: false })
    }
    reinInitEditorState (state){
        this.setState({editorState:state})
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
                                this.state.filledForm?
                                    <EditorsForm onFinishClick={this.onFinishClick} handleUTAChange={this.handleUTAChange} handleCategoryChange={this.handleCategoryChange} handleTopicChange={this.handleTopicChange} />:
                                    <div>

                                    </div>
                            }
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column width={3}>

                        </Grid.Column>
                        <Grid.Column width={10}>
                            {
                                (this.state.filledForm)?
                                    <div>
                                        This should be ivisible
                                    </div>:
                                    <div style={{ margin:'0em 0em 5em 0em'}}>
                                        <div className="RichEditor-root">
                                            <div className="TextEditTools">
                                                <BlockStyleControls
                                                    editorState={editorState}
                                                    onToggle={this.toggleBlockType}
                                                />
                                                <br/>
                                                <InlineStyleControls
                                                    editorState={editorState}
                                                    onToggle={this.toggleInlineStyle}
                                                />
                                            </div>
                                            <Modal open ={this.state.previewOpen}>
                                                <Modal.Header ><Header style={{ margin:'1em 0em 0em 0em', textAlign :'left',alignment:'center'}} color='green' as='h1'>
                                                    You are about to publish this article.
                                                </Header></Modal.Header>
                                                <Modal.Content>
                                                    <div>
                                                        <Header style={{ margin:'1em 0em 0em 0em', textAlign :'left',alignment:'center'}} color='green' as='h2'>
                                                            You are about to publish this article.
                                                        </Header>
                                                        <p>
                                                            This is how will appear. Review and publish. Click back if you need to make changes
                                                        </p>
                                                    </div>
                                                    <hr/>
                                                    <Modal.Description>
                                                        <div>
                                                            <ShowPreview reinInitEditorState = {this.reinInitEditorState} editoPreview={this.state.editorState}/>
                                                        </div>
                                                    </Modal.Description>
                                                </Modal.Content>
                                                <Modal.Actions>
                                                    <Button.Group>
                                                        <Button color="blue" onClick={this.closePreview}>Back</Button>
                                                        <Button.Or />
                                                        <Button color="green" onClick={this.handleConfirm}>Publish</Button>
                                                    </Button.Group>
                                                </Modal.Actions>
                                            </Modal>
                                            <div className={className}>
                                                <Editor
                                                    blockStyleFn={getBlockStyle}
                                                    customStyleMap={styleMap}
                                                    editorState={editorState}
                                                    handleKeyCommand={this.handleKeyCommand}
                                                    onChange={this.onChange}
                                                    onTab={this.onTab}
                                                    placeholder="Start putting it down..."
                                                    ref="editor"
                                                    spellCheck={true}
                                                />
                                            </div>
                                            <Button disabled = {this.state.hasSavedContent} style={{float:'right'}} type="button"  onClick={this.startPublish}  color='green' size='large'>Publish</Button>
                                        </div>
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
        backgroundColor: 'red',
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
                <Icon color="black" name = {this.props.icon}/>
              {this.props.label}
            </span>
        );
    }
}
const BLOCK_TYPES = [
    {label: 'H1', style: 'header-one',icon:'header'},
    {label: 'H2', style: 'header-two',icon:'header'},
    {label: 'H3', style: 'header-three',icon:'header'},
    {label: 'H4', style: 'header-four',icon:'header'},
    {label: 'H5', style: 'header-five',icon:'header'},
    {label: 'H6', style: 'header-six',icon:'header'},
    {label: 'Blockquote', style: 'blockquote',icon:'header'},
    {label: 'UL', style: 'unordered-list-item',icon:'unordered list'},
    {label: 'OL', style: 'ordered-list-item',icon:'ordered list'},
    {label: 'Code Block', style: 'code-block',icon:'indent'},
];
const BlockStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
    return (
        <div  className="RichEditor-controls">
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                    icon={type.icon}
                />
            )}
        </div>
    );
};
var INLINE_STYLES = [
    {label: 'Bold', style: 'BOLD',icon:'bold'},
    {label: 'Italic', style: 'ITALIC',icon:'italic'},
    {label: 'Underline', style: 'UNDERLINE',icon:'underline'},
    {label: 'Monospace', style: 'CODE',icon:'font'},
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
                    icon={type.icon}
                />
            )}
        </div>
    );
};


export default RichEditorExample