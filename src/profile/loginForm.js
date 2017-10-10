import React from 'react'
import { Button,Modal, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import AvatarEditor from '../avatarEditor/creatAvatar'
import Pofile from './profile'
/*import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'*/
class LoginForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
           user:this.props.user,
            currentUser:null,
            password:null,
            userName:null,
            avatar:null,
            creatAvatarOpen:false,
            imagePreviewUrl:'',
            file:'',
            signUp:false
        };
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleUnameChange = this.handleUnameChange.bind(this);
        this.onLoginClick = this.onLoginClick.bind(this);
        this.handSwichReg = this.handSwichReg.bind(this)
        this._handleFileChange = this._handleFileChange.bind(this);
        this.loadHandler = this.loadHandler.bind(this)
        this.closeCreateAvatar = this.closeCreateAvatar.bind(this)
        this.showCreateAvatar = this.showCreateAvatar.bind(this)
        this.setAvatar=this.setAvatar.bind(this)
    };
    setAvatar(img){
        console.log(img)
        this.setState({imagePreviewUrl:img})
    }
    showCreateAvatar=()=>{
        this.setState({ creatAvatarOpen: true })
    }
    closeCreateAvatar=()=>{
        this.setState({ creatAvatarOpen: false })
    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    onLoginClick= () => {
        if(this.state.userName==='zemuldo' && this.state.password==='omera'){
            let user = {
                id:"123456789",
                name:"zemuldo"
            }
            this.setState({currentUser:user})
            this.props.successLogin(user)
            this.setState({loggedin:true})
        }
        else {

        }

    }

    handlePasswordChange(e) {
        e.preventDefault();
        this.setState({password:e.target.value})

    }
    handleUnameChange(e) {
        e.preventDefault();
        this.setState({userName:e.target.value})

    }
    handSwichReg = function (state){
        this.setState({signUp:state})
    }
    _handleFileChange(e) {
        e.preventDefault();
        if (window.FileReader) {
            let reader = new FileReader();
            let file = e.target.files[0];

            reader.onloadend = () => {
                this.setState({
                    file: file,
                    imagePreviewUrl: reader.result
                });
            }
            reader.readAsDataURL(file)
        } else {
            alert('FileReader are not supported in this browser.');
        }
    }
    loadHandler(event) {
        this.setState({avatar:event.target.result})
    }
    errorHandler(evt) {
        return new Promise((resolve, reject) => {
            if (evt.target.error.name === "NotReadableError") {
                reject("Can't read file !");
            }
            else {
                reject("Can't read file !");
            }
        })
    }
    onClickSave = () => {
        if (this.editor) {
            // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
            // drawn on another canvas, or added to the DOM.
            const canvas = this.editor.getImage()

            // If you want the image resized to the canvas size (also a HTMLCanvasElement)
            const canvasScaled = this.editor.getImageScaledToCanvas()
        }
    }

    setEditorRef = (editor) => this.editor = editor

    render(){
      let $imagePreview = null;
      if (this.state.imagePreviewUrl!=='') {
          $imagePreview = (<img src={this.state.imagePreviewUrl} />);
      } else {
          $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
      }
    return(
        <div>
            <Modal open ={this.state.creatAvatarOpen}>
                <Modal.Header ><Header style={{ margin:'1em 0em 0em 0em', textAlign :'left',alignment:'center'}} color='green' as='h1'>
                    Create your Profile Picture.
                </Header></Modal.Header>
                <Modal.Content>
                    <div>
                        <p>
                           Click preview to see your picture as it will appear.
                        </p>
                    </div>
                    <hr/>
                    <Modal.Description>
                        <AvatarEditor setAvatar = {this.setAvatar}/>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button.Group>
                        <Button color="blue" onClick={this.closeCreateAvatar}>Cancel</Button>
                        <Button.Or />
                        <Button color="green" onClick={this.closeCreateAvatar}>Save</Button>
                    </Button.Group>
                </Modal.Actions>
            </Modal>
            {
                this.props.loggedin?
                    <div>
                        <Pofile
                            currentUser={this.state.currentUser}
                            _goToEditor = {this.props._goToEditor}
                            _exitEditMode={this.props._exitEditMode}
                            editingMode={this.props.editingMode}
                            createNew={this.props.createNew}
                            _handleCreateNew={this.props._handleCreateNew}
                            colors = {this.props.colors}/>
                    </div> :
                    <div>
                        {
                            this.state.signUp?
                                <div className='login-form'>
                                    <Header as='h2' color={this.props.color} textAlign='center'>
                                        Sign Up to Join Us
                                    </Header>
                                    <Grid
                                        textAlign='center'
                                        style={{ height: '100%',marginTop:25 }}
                                        verticalAlign='middle'
                                    >
                                        <Grid.Column style={{ maxWidth: 400 ,border: '2px solid green'}}>
                                            <Header as='h2' color='teal' textAlign='center'>
                                            </Header>
                                            <Form size='large'>
                                                <Form.Field>
                                                    {
                                                        this.state.imagePreviewUrl===''?
                                                            <Button color='green' onClick={()=>this.showCreateAvatar(false)}> Create Avatar</Button>:
                                                            <div>
                                                                {!!this.state.imagePreviewUrl &&
                                                                <img
                                                                    src={this.state.imagePreviewUrl.img}
                                                                    style={{
                                                                        borderRadius: `${(Math.min(
                                                                            this.state.imagePreviewUrl.height,
                                                                            this.state.imagePreviewUrl.width
                                                                            ) +
                                                                            10) *
                                                                        (this.state.imagePreviewUrl.borderRadius / 2 / 100)}px`
                                                                    }}
                                                                />}
                                                                <br/>
                                                                <Button color='green' onClick={()=>this.showCreateAvatar(false)}> Change Avatar</Button>
                                                            </div>
                                                    }
                                                </Form.Field>

                                                <Form.Group widths='equal'>
                                                    <Form.Input
                                                        size="small"
                                                        label='First Name'
                                                        fluid
                                                        type="text"
                                                        placeholder='First Name'
                                                        onChange={this.handleUnameChange}
                                                    />
                                                    <Form.Input
                                                        label='Last Name'
                                                        fluid
                                                        type="text"
                                                        placeholder='Last Name'
                                                        onChange={this.handleUnameChange}
                                                    />
                                                </Form.Group>
                                                <Form.Input
                                                    label='Email Address'
                                                    fluid
                                                    type="email"
                                                    placeholder='E-mail address'
                                                    onChange={this.handleUnameChange}
                                                />
                                                <Form.Group widths='equal'>
                                                    <Form.Input
                                                        label='Username'
                                                        fluid
                                                        type="text"
                                                        placeholder='Username'
                                                        onChange={this.handleUnameChange}
                                                    />
                                                </Form.Group>
                                                <Form.Group widths='equal'>
                                                    <Form.Input
                                                        label='Password'
                                                        fluid
                                                        type="password"
                                                        placeholder='Password'
                                                        onChange={this.handleUnameChange}
                                                    />
                                                    <Form.Input
                                                        label='Confirm Password'
                                                        fluid
                                                        type="password"
                                                        placeholder='Confirm Password'
                                                        onChange={this.handleUnameChange}
                                                    />
                                                </Form.Group>
                                                <Button color='green' type='submit'>Submit</Button>
                                            </Form>
                                            <Message>
                                                Have an Account?  <button onClick={()=>this.handSwichReg(false)}> Login</button>
                                            </Message>
                                        </Grid.Column>
                                    </Grid>
                                </div>:
                                <div className='login-form'>
                                    <Grid
                                        textAlign='center'
                                        style={{ height: '100%',marginTop:25 }}
                                        verticalAlign='middle'
                                    >
                                        <Grid.Column style={{ maxWidth: 300 }}>
                                            <Header as='h2' color='teal' textAlign='center'>
                                                <Image src='/img/login/login.png' />
                                            </Header>
                                            <Form size='large'>
                                                <Segment stacked>
                                                    <Form.Input
                                                        fluid
                                                        icon='user'
                                                        iconPosition='left'
                                                        placeholder='E-mail address'
                                                        onChange={this.handleUnameChange}
                                                    />
                                                    <Form.Input
                                                        fluid
                                                        icon='lock'
                                                        iconPosition='left'
                                                        placeholder='Password'
                                                        type='password'
                                                        onChange={this.handlePasswordChange}
                                                    />

                                                    <Button  type="button" onClick={this.onLoginClick}  color={this.props.color} fluid size='large'>Login</Button>
                                                </Segment>
                                            </Form>
                                            <Message>
                                                Want to Join Us?  <button onClick={()=>this.handSwichReg(true)}> Sign Up</button>
                                            </Message>
                                        </Grid.Column>
                                    </Grid>
                                </div>
                        }
                    </div>

            }
        </div>

    )
  }
}
export default LoginForm