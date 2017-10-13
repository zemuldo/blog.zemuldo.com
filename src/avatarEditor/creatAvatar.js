import React from 'react'
import ReactAvatarEditor from './avatarEditor'
import { Button,Grid} from 'semantic-ui-react'

function dataURItoBlob(dataURI, callback) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    let byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    let bb = new Blob([ab]);
    console.log(bb)
    return bb;
}
class AvaratEditor extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            allowZoomOut: false,
            position: { x: 0.5, y: 0.5 },
            scale: 1,
            rotate: 0,
            borderRadius: 0,
            preview: null,
            width: 200,
            height: 200
        };
    }

    handleNewImage = e => {
        this.setState({ image: e.target.files[0] })
        const img = this.editor.getImageScaledToCanvas().toDataURL()
        const rect = this.editor.getCroppingRect()
        dataURItoBlob(img)
        this.props.setAvatar({
            img,
            rect,
            scale: this.state.scale,
            width: this.state.width,
            height: this.state.height,
            borderRadius: this.state.borderRadius
        })
    }

    handleSave = data => {
        const img = this.editor.getImageScaledToCanvas().toDataURL()
        const rect = this.editor.getCroppingRect()
        dataURItoBlob(img)

        this.setState({
            preview: {
                img,
                rect,
                scale: this.state.scale,
                width: this.state.width,
                height: this.state.height,
                borderRadius: this.state.borderRadius
            }
        })
        this.props.setAvatar({
            img,
            rect,
            scale: this.state.scale,
            width: this.state.width,
            height: this.state.height,
            borderRadius: this.state.borderRadius
        })
    }

    handleScale = e => {
        const scale = parseFloat(e.target.value)
        this.setState({ scale })
    }

    handleAllowZoomOut = ({ target: { checked: allowZoomOut } }) => {
        this.setState({ allowZoomOut })
    }

    rotateLeft = e => {
        e.preventDefault()

        this.setState({
            rotate: this.state.rotate - 90
        })
    }

    rotateRight = e => {
        e.preventDefault()
        this.setState({
            rotate: this.state.rotate + 90
        })
    }

    handleBorderRadius = e => {
        const borderRadius = parseInt(e.target.value)
        this.setState({ borderRadius })
    }

    handleXPosition = e => {
        const x = parseFloat(e.target.value)
        this.setState({ position: { ...this.state.position, x } })
    }

    handleYPosition = e => {
        const y = parseFloat(e.target.value)
        this.setState({ position: { ...this.state.position, y } })
    }

    handleWidth = e => {
        const width = parseInt(e.target.value)
        this.setState({ width })
    }

    handleHeight = e => {
        const height = parseInt(e.target.value)
        this.setState({ height })
    }

    logCallback (e) {
        console.log('callback', e)
    }

    setEditorRef = editor => {
        if (editor) this.editor = editor
    }

    handlePositionChange = position => {
        console.log('Position set to', position)
        this.setState({ position })
    }

    render () {
        return (
            <Grid>
                <Grid.Column width={8}>
                    <ReactAvatarEditor
                        ref={this.setEditorRef}
                        scale={parseFloat(this.state.scale)}
                        width={this.state.width}
                        height={this.state.height}
                        position={this.state.position}
                        onPositionChange={this.handlePositionChange}
                        rotate={parseFloat(this.state.rotate)}
                        borderRadius={this.state.borderRadius}
                        onSave={this.handleSave}
                        onLoadFailure={this.logCallback.bind(this, 'onLoadFailed')}
                        onLoadSuccess={this.logCallback.bind(this, 'onLoadSuccess')}
                        onImageReady={this.logCallback.bind(this, 'onImageReady')}
                        onImageLoad={this.logCallback.bind(this, 'onImageLoad')}
                        onDropFile={this.logCallback.bind(this, 'onDropFile')}
                        image={this.state.image || '/img/login/login.png'}
                    />
                        New File:
                        <input name='newImage' type='file' onChange={this.handleNewImage} />
                        Zoom:
                        <input
                            name='scale'
                            type='range'
                            onChange={this.handleScale}
                            min={this.state.allowZoomOut ? '0.1' : '1'}
                            max='2'
                            step='0.01'
                            defaultValue='1'
                        />
                        {'Allow Scale < 1'}
                        <input
                            name='allowZoomOut'
                            type='checkbox'
                            onChange={this.handleAllowZoomOut}
                            checked={this.state.allowZoomOut}
                        />
                        Border radius:
                        <input
                            name='scale'
                            type='range'
                            onChange={this.handleBorderRadius}
                            min='0'
                            max='100'
                            step='1'
                            defaultValue='0'
                        />
                        Avatar Width:
                        <input
                            name='width'
                            type='number'
                            onChange={this.handleWidth}
                            min='50'
                            max='400'
                            step='10'
                            value={this.state.width}
                        />
                        Avatar Height:
                        <input
                            name='height'
                            type='number'
                            onChange={this.handleHeight}
                            min='50'
                            max='400'
                            step='10'
                            value={this.state.height}
                        />
                        X Position:
                        <input
                            name='scale'
                            type='range'
                            onChange={this.handleXPosition}
                            min='0'
                            max='1'
                            step='0.01'
                            value={this.state.position.x}
                        />
                        Y Position:
                        <input
                            name='scale'
                            type='range'
                            onChange={this.handleYPosition}
                            min='0'
                            max='1'
                            step='0.01'
                            value={this.state.position.y}
                        />
                        <br />
                        Rotate:
                        <Button onClick={this.rotateLeft}>Left</Button>
                        <Button onClick={this.rotateRight}>Right</Button>
                        <Button onClick={this.handleSave}>Finish</Button>
                </Grid.Column>
                    <Grid.Column width={8}>
                        {!!this.state.preview &&
                        <img
                            src={this.state.preview.img}
                            style={{
                                borderRadius: `${(Math.min(
                                    this.state.preview.height,
                                    this.state.preview.width
                                    ) +
                                    10) *
                                (this.state.preview.borderRadius / 2 / 100)}px`
                            }}
                        />}
                    </Grid.Column>
            </Grid>
        )
    }
}

export default AvaratEditor