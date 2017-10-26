import React from 'react'
import {CompositeDecorator,convertFromRaw, Editor, EditorState} from 'draft-js';

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
    return <audio controls src={props.src} style={styles.media} />;
};
const Image = (props) => {
    return <img alt="!This image might have been deleted" src={props.src} style={styles.media} />;
};
const Video = (props) => {
    return <video controls src={props.src} style={styles.media} />;
};
const Media = (props) => {
    const entity = props.contentState.getEntity(
        props.block.getEntityAt(0)
    );
    const {src} = entity.getData();
    const type = entity.getType();
    let media;
    if (type === 'audio') {
        media = <Audio src={src} />;
    } else if (type === 'image') {
        media = <Image src={src} />;
    } else if (type === 'video') {
        media = <Video src={src} />;
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
            editorState:EditorState.createEmpty(),
            category:this.props.category,
            topics:this.props.topics,
            dialogInComplete:true,
            showMedURLInput: false,
            url: '',
            urlType: '',

        };
        this.handleKeyCommand = this._handleKeyCommand.bind(this);
        this.onTab = this.onTab.bind(this);
        this.handleEditorState = this.handleEditorState.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.reinInitEditorState=this.reinInitEditorState.bind(this)
        this.onURLChange = (e) => this.setState({urlValue: e.target.value});
    }
    onChange = (editorState) =>{
    }
    focus = () => this.refs.editor.focus();
    _handleKeyCommand(command, editorState) {
    }
    onTab(e) {
    }
    componentDidMount() {
        this.handleEditorState()
    }
    handleEditorState(){
        if(this.props.body){
            this.setState({editorState:EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.body)),decorator)});
        }
        else {
            this.setState({editorState : EditorState.createEmpty(decorator)});
        }
    };
    reinInitEditorState (state){
        this.setState({editorState:state})
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
                    readOnly={true}
                    blockRendererFn={mediaBlockRenderer}
                    blockStyleFn={getBlockStyle}
                    customStyleMap={styleMap}
                    editorState={editorState}
                    handleKeyCommand={this.handleKeyCommand}
                    onChange={this.onChange}
                    onTab={this.onTab}
                    placeholder="Error fetching content..."
                    ref="editor"
                    spellCheck={true}
                />
            </div>
        );
    }
}
export default RichEditorExample