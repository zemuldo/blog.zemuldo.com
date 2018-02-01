import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import ShowPreview from './prevEditor'
import debounce from 'lodash/debounce'
import Editor from 'draft-js-plugins-editor';
import createHashtagPlugin from 'draft-js-hashtag-plugin';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createCounterPlugin from 'draft-js-counter-plugin';
import createSideToolbarPlugin from 'draft-js-side-toolbar-plugin';
import Prism from 'prismjs';
import createPrismPlugin from 'draft-js-prism-plugin';
import 'draft-js-side-toolbar-plugin/lib/plugin.css';
import {
    AtomicBlockUtils,
    convertFromRaw,
    convertToRaw,
    EditorState,
    RichUtils
} from 'draft-js'
import {Button, Header, Icon, Modal, Input} from 'semantic-ui-react'
import config from '../env/conf'
import {bindActionCreators} from 'redux'
import * as VarsActions from '../store/actions/vars'
import * as BlogActions from '../store/actions/blog'
import PropTypes from 'prop-types'
import editorStyles from './editorStyle.css';
import {
    styles,
    mediaBlockRenderer,
    decorator,
    BlockStyleControls,
    getBlockStyle,
    InlineStyleControls,
    styleMap
} from './editorToolkit'

const prismPlugin = createPrismPlugin({
    // Provide your own instance of PrismJS
    prism: Prism
});

const hashtagPlugin = createHashtagPlugin();
const linkifyPlugin = createLinkifyPlugin();
const counterPlugin = createCounterPlugin();
const sideToolbarPlugin = createSideToolbarPlugin();


const {CharCounter, WordCounter, LineCounter} = counterPlugin;
const {SideToolbar} = sideToolbarPlugin;


const plugins = [
    hashtagPlugin,
    linkifyPlugin,
    counterPlugin,
    sideToolbarPlugin,
    prismPlugin
];

const env = config[process.env.NODE_ENV] || 'development';


class RenderBlog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: this.props.initEditorState,
            isLoaded: false,
            category: null,
            topics: null,
            termsAccept: false,
            dialogInComplete: true,
            filledForm: false,
            continueEdit: false,
            isPublished: false,
            open: false,
            previewOpen: false,
            confirmOpen: false,
            showMedURLInput: false,
            url: '',
            urlType: '',
            title: '',
            wordCount: 0,
            firstBlock:{}

        };
        this.handleKeyCommand = this._handleKeyCommand.bind(this);
        this.onTab = this._onTab.bind(this);
        this.toggleBlockType = this._toggleBlockType.bind(this);
        this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
        this.saveContent = this.saveContent.bind(this);
        this.handleEditorStateEdit = this.handleEditorStateEdit.bind(this);
        this.handleEditorStateCreate = this.handleEditorStateCreate.bind(this);
        this.publish = this.publish.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleTopicChange = this.handleTopicChange.bind(this);
        this.handleUTAChange = this.handleUTAChange.bind(this);
        this.onFinishClick = this.onFinishClick.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.reinInitEditorState = this.reinInitEditorState.bind(this);
        this.promptForLink = this._promptForLink.bind(this);
        this.onURLChange = (e) => this.setState({urlValue: e.target.value});
        this.confirmLink = this._confirmLink.bind(this);
        this.onLinkInputKeyDown = this._onLinkInputKeyDown.bind(this);
        this.removeLink = this._removeLink.bind(this);
        this._addAudio = this._addAudio.bind(this);
        this._addImage = this._addImage.bind(this);
        this._addVideo = this._addVideo.bind(this);
        this.__promptForMedia = this.__promptForMedia.bind(this);
        this._confirmMedia = this._confirmMedia.bind(this)
        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleWordChange = this.handleWordChange.bind(this)
    }

    handleTitleChange = (e) => {
        this.setState({title: e.target.value})
        this.props.mode==='create'?localStorage.setItem('creatTitle',e.target.value):null
    }

    handleWordChange = (e) => {
        this.setState({wordCount:Number(e.target.value)})
    }

    __promptForMedia(type) {
        this.setState({
            showMedURLInput: true,
            urlValue: '',
            urlType: type
        }, () => {
            setTimeout(() => this.refs.url.focus(), 0)
        })
    }

    _addAudio() {
        this.setState({
            showMedURLInput: true,
            urlValue: '',
            urlType: 'audio'
        }, () => {
            setTimeout(() => this.refs.url.focus(), 0)
        })
    }

    _addImage() {
        this.setState({
            showMedURLInput: true,
            urlValue: '',
            urlType: 'image'
        }, () => {
            setTimeout(() => this.refs.url.focus(), 0)
        })
    }

    _addVideo() {
        this.setState({
            showMedURLInput: true,
            urlValue: '',
            urlType: 'video'
        }, () => {
            setTimeout(() => this.refs.url.focus(), 0)
        })
    }

    _confirmMedia(e) {
        e.preventDefault();
        const {editorState, urlValue, urlType} = this.state;
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            urlType,
            'IMMUTABLE',
            {src: urlValue}
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(
            editorState,
            {currentContent: contentStateWithEntity}
        );
        this.setState({
            editorState: AtomicBlockUtils.insertAtomicBlock(
                newEditorState,
                entityKey,
                ' '
            ),
            showMedURLInput: false,
            urlValue: ''
        }, () => {
            setTimeout(() => this.focus(), 0)
        })
    }

    onURLInputKeyDown(e) {
        if (e.which === 13) {
            this._confirmMedia(e)
        }
    }

    _promptForLink(e) {
        e.preventDefault();
        const {editorState} = this.state;
        const selection = editorState.getSelection();
        if (!selection.isCollapsed()) {
            const contentState = editorState.getCurrentContent();
            const startKey = editorState.getSelection().getStartKey();
            const startOffset = editorState.getSelection().getStartOffset();
            const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
            const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
            let url = '';
            if (linkKey) {
                const linkInstance = contentState.getEntity(linkKey);
                url = linkInstance.getData().url
            }
            this.setState({
                showURLInput: true,
                urlValue: url
            }, () => {
                setTimeout(() => this.refs.url.focus(), 0)
            })
        }
    }

    _confirmLink(e) {
        e.preventDefault();
        const {editorState, urlValue} = this.state;
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            'LINK',
            'MUTABLE',
            {url: urlValue}
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(editorState, {currentContent: contentStateWithEntity});
        this.setState({
            editorState: RichUtils.toggleLink(
                newEditorState,
                newEditorState.getSelection(),
                entityKey
            ),
            showURLInput: false,
            urlValue: ''
        }, () => {
            setTimeout(() => this.refs.editor.focus(), 0)
        })
    }

    _onLinkInputKeyDown(e) {
        if (e.which === 13) {
            this._confirmLink(e)
        }
    }

    _removeLink(e) {
        e.preventDefault();
        const {editorState} = this.state;
        const selection = editorState.getSelection();
        if (!selection.isCollapsed()) {
            this.setState({
                editorState: RichUtils.toggleLink(editorState, selection, null)
            })
        }
    }

    isLoading(value) {
        this.setState({isLoaded: value})
    };

    onChange = (editorState) => {
        const contentState = editorState.getCurrentContent();
        this.setState({editorState});
        this.saveContent(contentState);
        this.setState({hasSavedContent: false})
    };
    focus = () => {
        this.refs.editor.focus();
    };

    _handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true
        }
        return false
    }

    _onTab(e) {
        const maxDepth = 4;
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth))
    }

    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        )
    }

    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        )
    }

    publish = () => {
        this.setState({open: true})
        const title = localStorage.getItem('creatTitle')
        const content = localStorage.getItem('draftContent')
        const blogData = JSON.parse(localStorage.getItem('blogData'))
        if (content && blogData && title && this.state.wordCount>2) {
            let obj = JSON.parse(content)
            axios.post(env.httpURL, {
                queryMethod: 'publish',
                'queryData': {
                    type: blogData.type,
                    title: title,
                    query: 'publish',
                    topics: blogData.topics,
                    about: blogData.about,
                    wordCount:this.state.wordCount,
                    images: ['blogs_pic.jpg'],
                    authorID: this.props.user.id,
                    author: this.props.user.firstName + ' ' + this.props.user.lastName,
                    userName: this.props.user.userName,
                    body: JSON.stringify(obj)
                }

            })
                .then(function (response) {
                    if (response.data.state === true) {
                        window.localStorage.removeItem('blogData')
                        window.localStorage.removeItem('draftContent')
                        localStorage.removeItem('blogTitle')
                        this.setState({isPublished: true, filledForm: true})
                        this.props.varsActions.updateVars({editingMode: false, createNew: false})
                    } else {
                        this.props.varsActions.updateVars({editingMode: false, createNew: false})
                    }
                }.bind(this))

                .catch(function (err) {
                    this.setState({filledForm: true})
                    this.setState({isPublished: false})
                }.bind(this))
        } else {

        }
    };
    saveContent = debounce((state) => {
        let content = convertToRaw(state);
        this.props.mode === 'edit' ?
            window.localStorage.setItem('editBlog', JSON.stringify(content)) :
            window.localStorage.setItem('draftContent', JSON.stringify(content))
        !this.state.firstBlock.text?this.setState({firstBlock:content.blocks[0]}):null
    }, 1000);

    componentDidMount() {
        this.props.mode === 'edit' ? this.handleEditorStateEdit() : this.handleEditorStateCreate()
    };

    componentWillUpdate() {
    }

    handleEditorStateEdit() {
        this.setState({wordCount:this.props.blog.wordCount})
        let editorState = JSON.parse(this.props.editorState);
        this.setState({editorState: EditorState.createWithContent(convertFromRaw(editorState), decorator)})
        !this.state.firstBlock.text?this.setState({firstBlock:editorState.blocks[0]}):null
    };

    handleEditorStateCreate() {
        const title = localStorage.getItem('creatTitle')
        const state = window.localStorage.getItem('draftContent')
        const blogDataState = window.localStorage.getItem('blogData')
        if (state && blogDataState) {
            let editorState = JSON.parse(state);
            this.setState({
                title: title ? title : '',
                hasSavedContent: false,
                filledForm: true,
                continueEdit: true,
                firstBlock:editorState.blocks[0],
                editorState: EditorState.createWithContent(convertFromRaw(editorState), decorator)
            })
            !this.state.firstBlock.text?this.setState({firstBlock:editorState.blocks[0]}):null
        } else {
            this.setState({filledForm: true, editorState: EditorState.createEmpty(decorator)})
        }
    };

    handleCategoryChange(e, data) {
        this.setState({
            category: data.value,
            dialogInComplete: (this.state.topics && this.state.category && this.state.termsAccept)
        })
    }

    handleTopicChange(e, data) {
        this.setState({
            topics: data.value,
            dialogInComplete: (this.state.topics && this.state.category && this.state.termsAccept)
        })
    };

    handleUTAChange(e, data) {
        this.setState({
            termsAccept: data.value,
            dialogInComplete: (this.state.topics && this.state.category && this.state.termsAccept)
        })
    };

    onFinishClick() {
        let blogDta = {
            type: this.state.category,
            topics: this.state.topics
        };
        window.localStorage.setItem('blogData', JSON.stringify(blogDta));
        this.setState({filledForm: false})
    };

    startPublish = () => {
        if(this.state.title.length<5){
            alert('title error')
            return false
        }
        if(this.state.words<1){
            alert('title error')
            return false
        }
        this.showPreview()
    };
    showConfirm = () => {
        this.setState({confirmOpen: true})
    };
    showPreview = () => {
        this.setState({previewOpen: true})
    };
    closePreview = () => {
        this.setState({previewOpen: false})
    };
    handleConfirm = () => {
        this.closePreview();
        this.setState({startPublish: true, confirmOpen: false});
        this.publish()
    };
    handleCancel = () => {
        this.reinInitEditorState(this.state.editorState);
        this.closePreview();
        this.setState({confirmOpen: false})
    };

    reinInitEditorState(state) {
        this.setState({editorState: state})
    }

    render() {
        let mediaInput;
        if (this.state.showMedURLInput) {
            mediaInput =
                <div style={styles.urlInputContainer}>
                    <input
                        onChange={this.onURLChange}
                        ref='url'
                        style={styles.urlInput}
                        type='text'
                        value={this.state.urlValue}
                        onKeyDown={this.onURLInputKeyDown}
                    />
                    <button onMouseDown={this._confirmMedia}>
                        Confirm
                    </button>
                </div>
        }
        let urlInput;
        if (this.state.showURLInput) {
            urlInput =
                <div style={styles.urlInputContainer}>
                    <input
                        onChange={this.onURLChange}
                        ref='url'
                        style={styles.urlInput}
                        type='text'
                        value={this.state.urlValue}
                        onKeyDown={this.onLinkInputKeyDown}
                    />
                    <button onMouseDown={this.confirmLink}>
                        Confirm
                    </button>
                </div>
        }
        const {editorState} = this.state;
        // If the user changes block type before entering any text, we can
        // either style the placeholder or hide it. Let's just hide it now.
        let className = 'RichEditor-editor ' + editorStyles.editor;
        let contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder'
            }
        }
        return (
            <div className='RichEditor-root'>
                {
                    this.props.blog.editMode || this.props.mode === 'create'
                        ? <div>
                            <div>
                                {
                                    this.props.mode === 'create' ?
                                        <div>
                                            <Button
                                                disabled={this.state.hasSavedContent}
                                                style={{float: 'right'}} type='button'
                                                onClick={this.startPublish}
                                                color='green' size='mini'>Publish
                                            </Button>
                                            <Button
                                                disabled={this.state.hasSavedContent}
                                                style={{float: 'left'}} type='button'
                                                onClick={this.handleGoBackToProfile}
                                                color='green' size='mini'>Exit
                                            </Button>
                                            <br/>
                                            <br/>
                                            <span>Title: </span>
                                            <Input error={this.state.title.length<5} onChange={this.handleTitleChange} value={this.state.title}/>
                                            {' '}
                                            <span>Words </span>
                                            <Input error={this.state.wordCount<200} onChange={this.handleWordChange} value={this.state.wordCount}/>
                                        </div> : null
                                }
                                <div>
                                    <BlockStyleControls
                                        editorState={editorState}
                                        onToggle={this.toggleBlockType}
                                    />
                                    <br/>
                                    <InlineStyleControls
                                        editorState={editorState}
                                        onToggle={this.toggleInlineStyle}
                                    />
                                    Add External Links
                                    Select some text, then use the buttons to add or remove links
                                    on the selected text.
                                    <div style={styles.buttons}>
                                        <Button color='green' size='mini' onMouseDown={this.promptForLink}
                                                style={{marginRight: 10}}>
                                            <Icon name='external share'/>
                                            Add Link
                                        </Button>
                                        <Button color='red' size='mini' onMouseDown={this.removeLink}>
                                            <Icon name='external share'/>
                                            Remove Link
                                        </Button>
                                    </div>
                                    {urlInput}
                                    Use the buttons to add audio, image, or video.
                                    <div style={styles.buttons}>
                                        <Button color='green' size='mini' onMouseDown={this._addAudio}
                                                style={{marginRight: 10}}>
                                            Add Audio
                                        </Button>
                                        <Button color='green' size='mini' onMouseDown={this._addImage}
                                                style={{marginRight: 10}}>
                                            Add Image
                                        </Button>
                                        <Button color='green' size='mini' onMouseDown={this._addVideo}
                                                style={{marginRight: 10}}>
                                            Add Video
                                        </Button>
                                    </div>
                                    {
                                        (this.props.blog.editMode || this.props.mode==='create') && this.state.firstBlock.text?
                                            <div>
                                                <div><CharCounter limit={10}/> characters</div>
                                                <div><WordCounter limit={500}/> words</div>
                                                <div><LineCounter limit={100}/> lines</div>
                                            </div> : null
                                    }
                                    {mediaInput}
                                </div>
                            </div>
                            <Modal open={this.state.previewOpen}>
                                <Modal.Header><Header
                                    style={{margin: '1em 0em 0em 0em', textAlign: 'left', alignment: 'center'}}
                                    color='green' as='h1'>
                                    You are about to publish this article.
                                </Header></Modal.Header>
                                <Modal.Content>
                                    <div>
                                        <p>
                                            This is how will appear. Review and publish. Click back if you need to make
                                            changes
                                        </p>
                                    </div>
                                    <hr/>
                                    <Modal.Description>
                                        <div>
                                            <ShowPreview title={this.state.title}  editorState={this.state.editorState}/>
                                        </div>
                                    </Modal.Description>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button.Group>
                                        <Button color='blue' onClick={this.closePreview}>Back</Button>
                                        <Button.Or/>
                                        <Button color='green' onClick={this.handleConfirm}>Publish</Button>
                                    </Button.Group>
                                </Modal.Actions>
                            </Modal>
                        </div> : null
                }
                <div style={this.props.blog.editMode || this.props.mode==='create'? {
                    height: window.innerHeight * 0.7,
                    minHeight: '300px',
                    width: 'inherit',
                    lineHeight: '3em',
                    overflowY: 'scroll',
                    padding: '5px',
                    border: '1px solid green',
                } : null}>

                    <Modal open={this.state.previewOpen}>
                        <Modal.Header><Header
                            style={{margin: '1em 0em 0em 0em', textAlign: 'left', alignment: 'center'}}
                            color='green' as='h1'>
                            You are about to publish this article.
                        </Header></Modal.Header>
                        <Modal.Content>
                            <div>
                                <p>
                                    This is how will appear. Review and publish. Click back if you need to make changes
                                </p>
                            </div>
                            <hr/>
                            <Modal.Description>
                                <div>
                                    <ShowPreview title={this.state.title} reinInitEditorState={this.reinInitEditorState} editorState={this.state.editorState}/>
                                </div>
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button.Group>
                                <Button color='blue' onClick={this.closePreview}>Back</Button>
                                <Button.Or/>
                                <Button color='green' onClick={this.handleConfirm}>Publish</Button>
                            </Button.Group>
                        </Modal.Actions>
                    </Modal>

                    <div className={className}>
                        <Editor
                            onClick={this.focus}
                            readOnly={!this.props.blog.editMode && this.props.mode !== 'create'}
                            blockRendererFn={mediaBlockRenderer}
                            blockStyleFn={getBlockStyle}
                            customStyleMap={styleMap}
                            editorState={editorState}
                            handleKeyCommand={this.handleKeyCommand}
                            onChange={this.onChange}
                            onTab={this.onTab}
                            placeholder='Start putting it down...'
                            ref={'editor'}
                            spellCheck
                            plugins={plugins}
                        />
                        <div className={'toobar'}>
                            <SideToolbar/>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        blog: state.blog,
        user: state.user,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        varsActions: bindActionCreators(VarsActions, dispatch),
        blogActions: bindActionCreators(BlogActions, dispatch)
    }
};

RenderBlog.propTypes = {
    editorState: PropTypes.string.isRequired,
    user: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.oneOf([null])
    ]),
    blog: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired,
    varsActions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(RenderBlog)
