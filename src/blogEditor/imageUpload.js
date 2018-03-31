import React from 'react'
import Dropzone from 'react-dropzone'
import { Image } from 'semantic-ui-react'
import axios from 'axios'
import {connect} from 'react-redux'

class ImageUploader extends React.Component {
    constructor() {
        super()
        this.state = { files: [] }
    }

    onDrop = (files) => {
        this.setState({
            files
        });
        let formData = new FormData()
        formData.append('image',files[0])
        axios.post(`${this.props.vars.env.httpURL}/uploads/images/blog_header`, formData, {
            headers:{
                'Content-TYpe':'multipart/form-data'
            }
        })
        .then(o=>{
            console.log(o.data)
        })
        .catch(e=>{
            console.log(e)
        })
    }

    componentWillUpdate() {
        if (this.state.files[0]) {
            console.log(this.state.files[0].preview.toB)
        }
    }

    render() {
        return (
            <section>
                <div className="dropzone">
                    <div>
                        {
                            this.state.files[0] ?
                                <Image fluid style={{ maxHeight: '400px' }} src={this.state.files[0].preview} />
                                : null

                        }
                    </div>
                    <div>
                        <Dropzone onDrop={this.onDrop}>
                            <p>Try dropping some files here, or click to select files to upload.</p>
                        </Dropzone>
                    </div>

                </div>
                <aside>
                    <h2>Dropped files</h2>
                    <ul>
                        {
                            this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                        }
                    </ul>
                </aside>
            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return {
      vars: state.vars
    }
  }

export default connect(mapStateToProps) (ImageUploader)