import React from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import Pofile from '../partials/profile'
/*import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'*/
class LoginForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
           user:this.props.user,
            password:null,
            userName:null
        };
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleUnamedChange = this.handleUnamedChange.bind(this);
        this.onLoginClick = this.onLoginClick.bind(this);
    };
    onLoginClick= () => {
        if(this.state.userName==='zemuldo' && this.state.password==='omera'){
            let user = {
                id:"123456789",
                name:"Zemuldo"
            }
            this.props.successLogin(user)
        }
        else {
            let user = {
                id:"123456789",
                name:"Zemuldo"
            }
            this.props.successLogin(user)
            this.setState({loggedin:true})
        }

    }

    handlePasswordChange(e) {
        e.preventDefault();
        this.setState({password:e.target.value})

    }
    handleUnamedChange(e) {
        e.preventDefault();
        this.setState({userName:e.target.value})

    }
  render(){
    return(
        <div>
            {
                this.props.loggedin?
                    <div>
                        <Pofile editingMode={this.props.editingMode} createNew={this.props.createNew} _handleCreateNew={this.props._handleCreateNew} colors = {this.props.colors}/>
                    </div> :
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
                                            onChange={this.handleUnamedChange}
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
                                    New to us?  <a href="/"> Sign Up</a>
                                </Message>
                            </Grid.Column>
                        </Grid>
                    </div>
            }
        </div>

    )
  }
}


export default LoginForm