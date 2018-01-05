import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import {CompositeDecorator, convertFromRaw, Editor, EditorState} from 'draft-js';
import config from '../environments/conf'
import {bindActionCreators} from "redux";
import * as VarsActions from "../state/actions/vars";

const env = config[process.env.NODE_ENV] || 'development'
const cats = {
    Development: 'dev',
    Business: 'business',
    Technology: 'tech'
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
        case 'blockquote':
            return 'RichEditor-blockquote';
        default:
            return null;
    }
}

function mediaBlockRenderer(block) {
    if (block.getType() === 'atomic') {
        return {
            component: Media,
            editable: false,
        };
    }
    return null;
}

const Audio = (props) => {
    return <audio controls src={props.src} style={styles.media}/>;
};
const Image = (props) => {
    return <img alt="!This image might have been deleted" src={props.src} style={styles.media}/>;
};
const Video = (props) => {
    return <video controls src={props.src} style={styles.media}/>;
};
const Media = (props) => {
    const entity = props.contentState.getEntity(
        props.block.getEntityAt(0)
    );
    const {src} = entity.getData();
    const type = entity.getType();
    let media;
    if (type === 'audio') {
        media = <Audio src={src}/>;
    } else if (type === 'image') {
        media = <Image src={src}/>;
    } else if (type === 'video') {
        media = <Video src={src}/>;
    }
    return media;
};

function findLinkEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity();
            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === 'LINK'
            );
        },
        callback
    );
}

const Link = (props) => {
    const {url} = props.contentState.getEntity(props.entityKey).getData();
    return (
        <a href={url} rel="noreferrer noopener" target="_blank" style={styles.link}>
            {props.children}
        </a>
    );
};
const decorator = new CompositeDecorator([
    {
        strategy: findLinkEntities,
        component: Link,
    },
]);
const styles = {
    root: {
        fontFamily: '\'Georgia\', serif',
        padding: 20,
        width: 600,
    },
    buttons: {
        marginBottom: 10,
    },
    urlInputContainer: {
        marginBottom: 10,
    },
    urlInput: {
        fontFamily: '\'Georgia\', serif',
        marginRight: 10,
        padding: 3,
    },
    editor: {
        border: '1px solid #ccc',
        cursor: 'text',
        minHeight: 80,
        padding: 10,
    },
    button: {
        marginTop: 10,
        textAlign: 'center',
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
    },
};

class RichEditorExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            isLoaded: false,
            category: this.props.category,
            topics: this.props.topics,
            filledForm: false,
            continueEdit: false,
            isPublished: false,
            open: false,
            url: '',
            urlType: '',
        };
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.onTab = this.onTab.bind(this);
        this.handleEditorState = this.handleEditorState.bind(this);
        this.publish = this.publish.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.reinInitEditorState = this.reinInitEditorState.bind(this)
    }

    isLoading(value) {
        this.setState({isLoaded: value});
    };

    onChange = (editorState) => {
    };
    focus = () => this.refs.editor.focus();

    handleKeyCommand(command, editorState) {
    }

    onTab(e) {
    }

    publish = () => {
        this.setState({open: true})
        const content = localStorage.getItem('draftContent');
        const blogData = JSON.parse(localStorage.getItem('blogData'))
        if (content && blogData) {
            let obj = JSON.parse(content);
            let title = obj.blocks[0].text;
            obj.blocks.splice(0, 1);
            axios.post(env.httpURL, {
                queryMethod: "publish",
                "queryData": {
                    type: cats[blogData.type],
                    title: title,
                    query: "publish",
                    topics: blogData.topics,
                    images: ["blogs_pic.jpg"],
                    author: "Danstan Onyango",
                    userName: this.props.currentUser.name,
                    body: JSON.stringify(obj)
                }
            })
                .then(function (response) {
                    if (response.data.state === true) {
                        window.localStorage.removeItem('blogData');
                        window.localStorage.removeItem('draftContent');
                        this.setState({isPublished: true, filledForm: true});
                        this.props.varsActions.updateVars({editingMode: true, createNew: true});
                    }
                    else {
                        this.props.varsActions.updateVars({editingMode: true, createNew: true});
                    }
                }.bind(this))

                .catch(function (err) {
                    this.setState({filledForm: true});
                    this.setState({isPublished: false})
                }.bind(this))
        }
        else {

        }
    };

    componentDidMount() {
        this.handleEditorState()
    }

    handleEditorState() {
        const editorState = window.localStorage.getItem('draftContent')
        const blogDataState = window.localStorage.getItem('blogData')
        if (editorState && blogDataState) {
            this.setState({
                hasSavedContent: false,
                filledForm: true,
                continueEdit: true,
                editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(editorState)), decorator)
            });
        }
        else {
            this.setState({filledForm: true, editorState: EditorState.createEmpty(decorator)});
        }
    };

    reinInitEditorState(state) {
        this.setState({editorState: state})
    }


    render() {
        const {editorState} = this.state;
        let className = 'RichEditor-editor';
        let contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder';
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
                    placeholder="Start putting it down..."
                    ref="editor"
                    spellCheck={true}
                />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        varsActions: bindActionCreators(VarsActions, dispatch)
    }
};

export default connect(mapDispatchToProps)(RichEditorExample);