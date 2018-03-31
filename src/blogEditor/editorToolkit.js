import React from 'react'
import PropTypes from "prop-types";
import {Icon} from 'semantic-ui-react'
import Prism from "prismjs";
import {List} from 'immutable'
import PrismDecorator from 'draft-js-prism'
import MultiDecorator from 'draft-js-multidecorators'
import SimpleDecorator from 'draft-js-simpledecorator'
import {Entity} from 'draft-js'

class PrismDraftDecorator {
    constructor(grammar) {
        this.grammar = grammar;
        this.highlighted = {};
    }
    getDecorations(block) {
        let blockType = block.getType();
        let blockKey = block.getKey();
        let blockText = block.getText();
        let decorations = Array(blockText.length).fill(null);
        this.highlighted[blockKey] = {};
        if (blockType !== 'code-block') {
            return List(decorations);
        }
        let tokens = Prism.tokenize(blockText, this.grammar);
        let offset = 0;
        let that = this;
        tokens.forEach(function(tok) {
            if (typeof tok === 'string') {
                offset += tok.length;
            } else {
                let tokId = 'tok'+offset;
                let completeId = blockKey + '-' + tokId;
                that.highlighted[blockKey][tokId] = tok;
                occupySlice(decorations, offset, offset + tok.content.length, completeId);
                offset += tok.content.length;
            }
        });
        return List(decorations);
    }
    getComponentForKey(key) {
        return function(props) {
            return <span  className={'token ' + props.tokType}>{props.children}</span>;
        }
    }
    getPropsForKey(key) {
        let parts = key.split('-');
        let blockKey = parts[0];
        let tokId = parts[1];
        let token = this.highlighted[blockKey][tokId];
        return {
            tokType: token.type
        };
    }
}

function occupySlice(targetArr, start, end, componentKey) {
    for (let ii = start; ii < end; ii++) {
        targetArr[ii] = componentKey;
    }
}

export function findLinkEntities(contentBlock, callback) {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity();
            return (
                entityKey !== null &&
                Entity.get(entityKey).getType() === 'LINK'
            );
        },
        callback
    );
}

export const Link = (props) => {
    const {url} = props.contentState.getEntity(props.entityKey).getData()
    return (
        <a href={url} target='_blank' style={styles.link}>
            {props.children}
        </a>
    )
};
Link.propTypes = {
    contentState: PropTypes.object.isRequired,
    children: PropTypes.array.isRequired,
    entityKey: PropTypes.string.isRequired
};

//export const decorator = new PrismDraftDecorator(Prism.languages.javascript);
export const decorator = new MultiDecorator([
    new PrismDraftDecorator(Prism.languages.javascript),
    new SimpleDecorator(

        function strategy(contentBlock, callback, contentState) {
            const text = contentBlock.getText()

            // Match text like #ac00ff and #EEE
            let HEX_COLOR = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g

            // For all Hex color matches
            let match
            while ((match = HEX_COLOR.exec(text)) !== null) {
                // Decorate the color code
                let colorText = match[0]
                let start = match.index
                let end = start + colorText.length
                let props = {
                    color: colorText
                }
                callback(start, end, props)
            }
        },

        /**
         * @prop {String} color
         */
        function component(props) {
            // Colorize the text with the given color
            return <span style={{ color: props.color }}>{ props.children }</span>
        }
    ),
    new SimpleDecorator(
        findLinkEntities,
        Link
    ),

]);
export const styles = {
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
        maxHeight:'350px',
        width: '100%',
        // Fix an issue with Firefox rendering video controls
        // with 'pre-wrap' white-space
        whiteSpace: 'initial'
    }
};

export const Audio = (props) => {
    return <audio controls src={props.src} style={styles.media}/>
};
Audio.propTypes = {
    src: PropTypes.string.isRequired
};
export const Image = (props) => {
    return <img src={props.src} style={styles.media} alt={'zemldo blogpost image'}/>
};
Image.propTypes = {
    src: PropTypes.string.isRequired
};
export const Video = (props) => {
    return <video controls src={props.src} style={styles.media}/>
};
Video.propTypes = {
    src: PropTypes.string.isRequired
};

export function mediaBlockRenderer(block) {
    if (block.getType() === 'atomic') {
        return {
            component: Media,
            editable: false,
        }
    }
    return null
}
export const Media = (props) => {
    const entity = props.contentState.getEntity(
        props.block.getEntityAt(0)
    );
    const {src} = entity.getData();
    const type = entity.getType();
    let media;
    if (type === 'audio') {
        media = <Audio src={src}/>
    } else if (type === 'image') {
        media = <Image src={src}/>
    } else if (type === 'video') {
        media = <Video src={src}/>
    }
    return media
};


/*Custom overrides for "code" style.*/
export const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
};

export function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote':
            return 'RichEditor-blockquote';
        case 'code-block':
            return 'RichEditor-Code';
        case 'code-block-section':
            return 'RichEditor-Code-Wrap'
        default:
            return null
    }
}

export class StyleButton extends React.Component {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style)
        }
    }

    render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' RichEditor-activeButton'
        }
        return (
            <span className={className} onMouseDown={this.onToggle}>
        <Icon color='black' name={this.props.icon}/>
                {this.props.label}
      </span>
        )
    }
}

StyleButton.propTypes = {
    onToggle: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    style: PropTypes.string.isRequired
};

export const BLOCK_TYPES = [
    {label: 'H1', style: 'header-one', icon: 'header'},
    {label: 'H2', style: 'header-two', icon: 'header'},
    {label: 'H3', style: 'header-three', icon: 'header'},
    {label: 'H4', style: 'header-four', icon: 'header'},
    {label: 'H5', style: 'header-five', icon: 'header'},
    {label: 'H6', style: 'header-six', icon: 'header'},
    {label: 'Blockquote', style: 'blockquote', icon: 'header'},
    {label: 'UL', style: 'unordered-list-item', icon: 'unordered list'},
    {label: 'OL', style: 'ordered-list-item', icon: 'ordered list'},
    {label: 'Code Block', style: 'code-block', icon: 'code'},
    {label: 'Code Section', style: 'code-block-section', icon: 'code'}
];
export const BlockStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
    return (
        <div className='RichEditor-controls'>
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
    )
};
BlockStyleControls.propTypes = {
    editorState: PropTypes.object.isRequired,
    onToggle: PropTypes.func.isRequired
};
let INLINE_STYLES = [
    {label: 'Bold', style: 'BOLD', icon: 'bold'},
    {label: 'Italic', style: 'ITALIC', icon: 'italic'},
    {label: 'Underline', style: 'UNDERLINE', icon: 'underline'},
    {label: 'Monospace', style: 'CODE', icon: 'font'}
];
export const InlineStyleControls = (props) => {
    let currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <div className='RichEditor-controls'>
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
    )
};

InlineStyleControls.propTypes = {
    editorState: PropTypes.object.isRequired,
    onToggle: PropTypes.func.isRequired
};


