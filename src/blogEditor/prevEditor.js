import React from 'react'
import {connect} from 'react-redux'
import {CompositeDecorator, convertFromRaw, Editor, EditorState} from 'draft-js'
import {bindActionCreators} from 'redux'
import * as VarsActions from '../store/actions/vars'
import PropTypes from 'prop-types'

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'red',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2
  }
}

function getBlockStyle (block) {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote'
    default:
      return null
  }
}

function mediaBlockRenderer (block) {
  if (block.getType() === 'atomic') {
    return {
      component: Media,
      editable: false
    }
  }
  return null
}

const Audio = (props) => {
  return <audio controls src={props.src} style={styles.media} />
}
Audio.propTypes = {
  src: PropTypes.string.isRequired
}
const Image = (props) => {
  return <img src={props.src} style={styles.media} alt={'zemldo blogpost image'} />
}
Image.propTypes = {
  src: PropTypes.string.isRequired
}
const Video = (props) => {
  return <video controls src={props.src} style={styles.media} />
}
Video.propTypes = {
  src: PropTypes.string.isRequired
}
const Media = (props) => {
  const entity = props.contentState.getEntity(
        props.block.getEntityAt(0)
    )
  const {src} = entity.getData()
  const type = entity.getType()
  let media
  if (type === 'audio') {
    media = <Audio src={src} />
  } else if (type === 'image') {
    media = <Image src={src} />
  } else if (type === 'video') {
    media = <Video src={src} />
  }
  return media
}

function findLinkEntities (contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
        (character) => {
          const entityKey = character.getEntity()
          return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === 'LINK'
          )
        },
        callback
    )
}

const Link = (props) => {
  const {url} = props.contentState.getEntity(props.entityKey).getData()
  return (
    <a href={url} style={styles.link}>
      {props.children}
    </a>
  )
}
Link.propTypes = {
  contentState: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  entityKey: PropTypes.object.isRequired
}
const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link
  }
])
const styles = {
  root: {
    fontFamily: '\'Georgia\', serif',
    padding: 20,
    width: 600
  },
  buttons: {
    marginBottom: 10
  },
  urlInputContainer: {
    marginBottom: 10
  },
  urlInput: {
    fontFamily: '\'Georgia\', serif',
    marginRight: 10,
    padding: 3
  },
  editor: {
    border: '1px solid #ccc',
    cursor: 'text',
    minHeight: 80,
    padding: 10
  },
  button: {
    marginTop: 10,
    textAlign: 'center'
  },
  link: {
    color: '#3b5998',
    textDecoration: 'underline'
  },
  media: {
    width: '100%',
        // Fix an issue with Firefox rendering video controls
        // with 'pre-wrap' white-space
    whiteSpace: 'initial'
  }
}

class RichEditorExample extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      editorState: this.props.editorState,
      isLoaded: false,
      filledForm: false,
      continueEdit: false,
      isPublished: false,
      open: false,
      url: '',
      urlType: ''
    }
    this.handleKeyCommand = this.handleKeyCommand.bind(this)
    this.onTab = this.onTab.bind(this)
    this.handleEditorState = this.handleEditorState.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.reinInitEditorState = this.reinInitEditorState.bind(this)
  }

  isLoading (value) {
    this.setState({isLoaded: value})
  };

  onChange = (editorState) => {
  };
  focus = () => this.refs.editor.focus();

  handleKeyCommand (command, editorState) {
  }

  onTab (e) {
  }

  componentDidMount () {
    this.handleEditorState()
  }

  handleEditorState () {
    const editorState = window.localStorage.getItem('draftContent');
    const blogDataState = window.localStorage.getItem('blogData');
    if (editorState && blogDataState) {
      this.setState({
        hasSavedContent: false,
        filledForm: true,
        continueEdit: true,
        editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(editorState)), decorator)
      })
    } else {
      this.setState({filledForm: true, editorState: EditorState.createEmpty(decorator)})
    }
  };

  reinInitEditorState (state) {
    this.setState({editorState: state})
  }

  render () {
    const {editorState} = this.props
    let className = 'RichEditor-editor'
    let contentState = editorState.getCurrentContent()
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder'
      }
    }
    return (
      <div className={className} onClick={this.focus}>
        <Editor
          readOnly
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
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    varsActions: bindActionCreators(VarsActions, dispatch)
  }
}

RichEditorExample.propTypes = {
  editorState:PropTypes.object.isRequired,
  title:PropTypes.string.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(RichEditorExample)
