import React from 'react'
import Dropzone from 'react-dropzone'
import { Image } from 'semantic-ui-react'
import axios from 'axios'
import { connect } from 'react-redux'

class ImageUploader extends React.Component {
    constructor() {
        super()
        this.state = { files: [] }
    }

    onDrop = (files) => {
        if (this.state.deletePrev) this.deletePrev(this.state.deletePrev)
        this.setState({
            files
        });
        let formData = new FormData()
        formData.append('image', files[0])
        axios.post(`${this.props.vars.env.httpURL}/uploads/images/blog_header`, formData, {
            headers: {
                'Content-TYpe': 'multipart/form-data'
            }
        })
            .then(o => {
                this.props.handleGetImage(o.data)
                this.setState({ deletePrev: o.data })
            })
            .catch(e => {
                console.log(e)
            })
    }

    deletePrev = (prev) => {
        axios.post(`${this.props.vars.env.httpURL}/uploads/images/delete`, prev)
            .then(o => {
            })
            .catch(e => {
                console.log(e)
            })
    }

    render() {
        return (
            <section>
                <div className="dropzone">
                    <div>
                        {
                            this.state.files[0] ?
                                <Image fluid style={{ maxHeight: '500px' }} src={this.state.files[0].preview} />
                                : null

                        }
                    </div>
                    <div>
                        <Dropzone onDrop={this.onDrop}>
                            <p>Click this box and drop a file an image here</p>
                        </Dropzone>
                    </div>

                </div>
            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        vars: state.vars
    }
}

export default connect(mapStateToProps)(ImageUploader)