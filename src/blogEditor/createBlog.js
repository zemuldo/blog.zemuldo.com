import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import ShowPreview from './showPreview'
import debounce from 'lodash/debounce'
import {
    CompositeDecorator,
    AtomicBlockUtils,
    convertFromRaw,
    convertToRaw,
    Editor,
    EditorState,
    RichUtils
} from 'draft-js'
import {Button, Header, Icon, Modal, Input} from 'semantic-ui-react'
import config from '../environments/conf'
import {bindActionCreators} from 'redux'
import * as VarsActions from '../store/actions/vars'
import PropTypes from 'prop-types';
import {
    styles,
    Video,
    Image,
    Audio,
    mediaBlockRenderer,
    decorator, BLOCK_TYPES,
    BlockStyleControls,
    findLinkEntities,
    getBlockStyle,
    InlineStyleControls,
    Link,
    Media,
    StyleButton,
    styleMap
} from './editorToolkit'

const env = config[process.env.NODE_ENV] || 'development'

class CreateBlog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty(),
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
       title:''

    }
    this.handleKeyCommand = this._handleKeyCommand.bind(this)
    this.onTab = this._onTab.bind(this)
    this.toggleBlockType = this._toggleBlockType.bind(this)
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this)
    this.saveContent = this.saveContent.bind(this)
    this.handleEditorState = this.handleEditorState.bind(this)
    this.publish = this.publish.bind(this)
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
    this.handleTopicChange = this.handleTopicChange.bind(this)
    this.handleUTAChange = this.handleUTAChange.bind(this)
    this.onFinishClick = this.onFinishClick.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.reinInitEditorState = this.reinInitEditorState.bind(this)
    this.promptForLink = this._promptForLink.bind(this)
    this.onURLChange = (e) => this.setState({urlValue: e.target.value})
    this.confirmLink = this._confirmLink.bind(this)
    this.onLinkInputKeyDown = this._onLinkInputKeyDown.bind(this)
    this.removeLink = this._removeLink.bind(this)
    this._addAudio = this._addAudio.bind(this)
    this._addImage = this._addImage.bind(this)
    this._addVideo = this._addVideo.bind(this)
    this.__promptForMedia = this.__promptForMedia.bind(this)
    this._confirmMedia = this._confirmMedia.bind(this)
  }

  __promptForMedia (type) {
    this.setState({
      showMedURLInput: true,
      urlValue: '',
      urlType: type
    }, () => {
      setTimeout(() => this.refs.url.focus(), 0)
    })
  }

  _addAudio () {
    this.setState({
      showMedURLInput: true,
      urlValue: '',
      urlType: 'audio'
    }, () => {
      setTimeout(() => this.refs.url.focus(), 0)
    })
  }

  _addImage () {
    this.setState({
      showMedURLInput: true,
      urlValue: '',
      urlType: 'image'
    }, () => {
      setTimeout(() => this.refs.url.focus(), 0)
    })
  }

  _addVideo () {
    this.setState({
      showMedURLInput: true,
      urlValue: '',
      urlType: 'video'
    }, () => {
      setTimeout(() => this.refs.url.focus(), 0)
    })
  }

  _confirmMedia (e) {
    e.preventDefault()
    const {editorState, urlValue, urlType} = this.state
    const contentState = editorState.getCurrentContent()
    const contentStateWithEntity = contentState.createEntity(
            urlType,
            'IMMUTABLE',
            {src: urlValue}
        )
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    const newEditorState = EditorState.set(
            editorState,
            {currentContent: contentStateWithEntity}
        )
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

  onURLInputKeyDown (e) {
    if (e.which === 13) {
      this._confirmMedia(e)
    }
  }

  _promptForLink (e) {
    e.preventDefault()
    const {editorState} = this.state
    const selection = editorState.getSelection()
    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent()
      const startKey = editorState.getSelection().getStartKey()
      const startOffset = editorState.getSelection().getStartOffset()
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey)
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset)
      let url = ''
      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey)
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

  _confirmLink (e) {
    e.preventDefault()
    const {editorState, urlValue} = this.state
    const contentState = editorState.getCurrentContent()
    const contentStateWithEntity = contentState.createEntity(
            'LINK',
            'MUTABLE',
            {url: urlValue}
        )
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    const newEditorState = EditorState.set(editorState, {currentContent: contentStateWithEntity})
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

  _onLinkInputKeyDown (e) {
    if (e.which === 13) {
      this._confirmLink(e)
    }
  }

  _removeLink (e) {
    e.preventDefault()
    const {editorState} = this.state
    const selection = editorState.getSelection()
    if (!selection.isCollapsed()) {
      this.setState({
        editorState: RichUtils.toggleLink(editorState, selection, null)
      })
    }
  }

  isLoading (value) {
    this.setState({isLoaded: value})
  };

  onChange = (editorState) => {
    const contentState = editorState.getCurrentContent()
    this.setState({editorState})
    this.saveContent(contentState)
    this.setState({hasSavedContent: false})
  }
  focus = () => this.refs.editor.focus();

  _handleKeyCommand (command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      this.onChange(newState)
      return true
    }
    return false
  }

  _onTab (e) {
    const maxDepth = 4
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth))
  }

  _toggleBlockType (blockType) {
    this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        )
  }

  _toggleInlineStyle (inlineStyle) {
    this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        )
  }

  publish = () => {
    this.setState({open: true})
     const title = localStorage.getItem('title')
    const content = localStorage.getItem('draftContent')
    const blogData = JSON.parse(localStorage.getItem('blogData'))
    if (content && blogData && title) {
      let obj = JSON.parse(content)
      axios.post(env.httpURL, {
        queryMethod: 'publish',
        'queryData': {
          type: blogData.type,
          title: title,
          query: 'publish',
          topics: blogData.topics,
          about: blogData.about,
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
  saveContent = debounce((content) => {
    window.localStorage.setItem('draftContent', JSON.stringify(convertToRaw(content)))
  }, 1000);

  componentDidMount () {
    this.handleEditorState()
  }

  handleEditorState () {
    const title = localStorage.getItem('title')
    const editorState = window.localStorage.getItem('draftContent')
    const blogDataState = window.localStorage.getItem('blogData')
    if (editorState && blogDataState) {
      this.setState({
         title:title?title:'',
        hasSavedContent: false,
        filledForm: true,
        continueEdit: true,
        editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(editorState)), decorator)
      })
    } else {
      this.setState({filledForm: true, editorState: EditorState.createEmpty(decorator)})
    }
  };

  handleCategoryChange (e, data) {
    this.setState({
      category: data.value,
      dialogInComplete: (this.state.topics && this.state.category && this.state.termsAccept)
    })
  }

  handleTopicChange (e, data) {
    this.setState({
      topics: data.value,
      dialogInComplete: (this.state.topics && this.state.category && this.state.termsAccept)
    })
  }

  handleUTAChange (e, data) {
    this.setState({
      termsAccept: data.value,
      dialogInComplete: (this.state.topics && this.state.category && this.state.termsAccept)
    })
  }

  onFinishClick () {
    let blogDta = {
      type: this.state.category,
      topics: this.state.topics
    }
    window.localStorage.setItem('blogData', JSON.stringify(blogDta))
    this.setState({filledForm: false})
  }

  startPublish = () => {
    this.showPreview()
  }
  showConfirm = () => {
    this.setState({confirmOpen: true})
  }
  showPreview = () => {
    this.setState({previewOpen: true})
  }
  closePreview = () => {
    this.setState({previewOpen: false})
  }
  handleConfirm = () => {
    this.closePreview()
    this.setState({startPublish: true, confirmOpen: false})
    this.publish()
  }
  handleCancel = () => {
    this.reinInitEditorState(this.state.editorState)
    this.closePreview()
    this.setState({confirmOpen: false})
  }

  reinInitEditorState (state) {
    this.setState({editorState: state})
  }

   handleTitleChange = (e) =>{
      this.setState({title:e.target.value})
      localStorage.setItem('title',e.target.value)
   }

  render () {
    let mediaInput
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
    let urlInput
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
    const {editorState} = this.state
        // If the user changes block type before entering any text, we can
        // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor'
    let contentState = editorState.getCurrentContent()
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder'
      }
    }
    return (
      <div className='RichEditor-root'>
        <div style={{margin: '0em 0em 0em 3em'}}>
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
          <Header style={{margin: '3em 0em 0em 0em', textAlign: 'left', alignment: 'center'}} color='green'
            as='h1'>
                        Draft an article on the fly.
                    </Header>
          <br />
          <span>Title: <Input onChange={this.handleTitleChange} value={this.state.title} /></span>
          <div>
            <BlockStyleControls
              editorState={editorState}
              onToggle={this.toggleBlockType}
                        />
            <br />
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
                            <Icon name='external share' />
                                Add Link
                            </Button>
                          <Button color='red' size='mini' onMouseDown={this.removeLink}>
                            <Icon name='external share' />
                                Remove Link
                            </Button>
                        </div>
            {urlInput}
                        Use the buttons to add audio, image, or video.
                        <div style={styles.buttons}>
                          <Button color='green' size='mini' onMouseDown={this._addAudio} style={{marginRight: 10}}>
                                Add Audio
                            </Button>
                          <Button color='green' size='mini' onMouseDown={this._addImage} style={{marginRight: 10}}>
                                Add Image
                            </Button>
                          <Button color='green' size='mini' onMouseDown={this._addVideo} style={{marginRight: 10}}>
                                Add Video
                            </Button>
                        </div>
            {mediaInput}
          </div>
        </div>
        <hr />
        <Modal open={this.state.previewOpen}>
          <Modal.Header><Header style={{margin: '1em 0em 0em 0em', textAlign: 'left', alignment: 'center'}}
            color='green' as='h1'>
                        You are about to publish this article.
                    </Header></Modal.Header>
          <Modal.Content>
            <div>
              <p>
                                This is how will appear. Review and publish. Click back if you need to make changes
                            </p>
            </div>
            <hr />
            <Modal.Description>
              <div>
                <ShowPreview title={this.state.title} reinInitEditorState={this.reinInitEditorState}
                  editorState={this.state.editorState} />
              </div>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button.Group>
              <Button color='blue' onClick={this.closePreview}>Back</Button>
              <Button.Or />
              <Button color='green' onClick={this.handleConfirm}>Publish</Button>
            </Button.Group>
          </Modal.Actions>
        </Modal>
        <div className={className}>
          <Editor
            blockRendererFn={mediaBlockRenderer}
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onTab={this.onTab}
            placeholder='Start putting it down...'
            ref='editor'
            spellCheck
                    />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    blog: state.blog,
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    varsActions: bindActionCreators(VarsActions, dispatch)
  }
}

CreateBlog.propTypes = {
  user: PropTypes.object.isRequired,
  varsActions: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateBlog)
