import React from 'react'
import {Button, Loader, Form, Message, Segment} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import SignUpForm from './signUpForm'

class LoginForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  };

  render () {
    return (
      <div className='login-content'>
        <h1 className='alignCenter'>Login</h1>
        <Form size='large'>
          <Segment stacked>
            <Form.Input
              name={'userName'}
              fluid
              icon='user'
              iconPosition='left'
              placeholder='E-mail address'
              onChange={this.props.handleFormField}
                   />
            <Form.Input
                name={'password'}
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              onChange={this.props.handleFormField}
                   />
            {
                      !this.props.logingin
                        ? <Button
                          type='button'
                          onClick={this.props.onLoginClick}
                          color={this.props.color}
                          fluid size='large'>
                             Login
                        </Button>
                        : <Loader active inline='centered' />
                   }
          </Segment>
        </Form>
        <Message
          hidden={this.props.hideMessage}
          error={this.props.error}
          success={this.props.success}
             >
          <Message.Header>
            {this.props.errorDetails ? this.props.errorDetails.message : 'Something happened. Please check your Internet'}
          </Message.Header>
        </Message>
        <Message>
                Want to Join Us? <Link to='/signup' onClick={() => this.props.handSwichReg(true)}> Sign Up</Link>
        </Message>
      </div>
    )
  }
}

LoginForm.propTypes = {
  errorDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.oneOf([null])
  ]),
  hideMessage: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  handSwichReg: PropTypes.func.isRequired,
  success: PropTypes.bool.isRequired,
  handleUnameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  onLoginClick: PropTypes.func.isRequired,
  logingin: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired
}

export default LoginForm
