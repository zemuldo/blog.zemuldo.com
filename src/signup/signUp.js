import React, {Component} from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

class SignUpForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            user:null,
            signUp:false
        };
    };
    handleSignup(){
        this.setState({signUp:true})
    }

    render(){
        return(
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
                                />
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Password'
                                    type='password'
                                />

                                <Button color='green' fluid size='large'>Login</Button>
                            </Segment>
                        </Form>
                        <Message>
                            Have an account?  <a href="../login/loginForm.js"> Login</a>
                        </Message>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}


export default SignUpForm