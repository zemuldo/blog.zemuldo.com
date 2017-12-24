import React from 'react'
import { Button,Loader, Form, Message, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class LoginForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
    };

    render(){
        return(
            <div className='login-content' >
                <h1 className='alignCenter'>Login</h1>
                <Form  size='large'>
                    <Segment stacked>
                        <Form.Input
                            fluid
                            icon='user'
                            iconPosition='left'
                            placeholder='E-mail address'
                            onChange={this.props.handleUnameChange}
                        />
                        <Form.Input
                            fluid
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password'
                            type='password'
                            onChange={this.props.handlePasswordChange}
                        />
                        {
                            !this.props.logingin?
                                <Button
                                    type="button"
                                    onClick={this.props.onLoginClick}
                                    color={this.props.color}
                                    fluid size='large'>
                                    Login
                                </Button>:
                                <Loader active inline='centered' />
                        }
                    </Segment>
                </Form>
                <Message
                    hidden={this.props.hideMessage}
                    error={this.props.error}
                    success={this.props.success}
                >
                    <Message.Header>
                        {this.props.errorDetails?this.props.errorDetails.message:'Something happened. Please check your Internet'}
                    </Message.Header>
                </Message>
                <Message>
                    Want to Join Us?  <Link to='/signup' onClick={()=>this.props.handSwichReg(true)}> Sign Up</Link>
                </Message>
            </div>
        )
    }
}

export default LoginForm;