import React from 'react'
import {Button, Loader, Form, Header, Message} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'

class SignUpForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    };

    render() {
        return (
            <div className='signup-content'>
                <Header as='h2' color='teal' textAlign='center'/>
                <Form size='large'>
                    <Form.Field>
                        {
                            this.props.imagePreviewUrl === ''
                                ? <Button color='green' onClick={() => this.props.showCreateAvatar(true)}> Create
                                    Avatar</Button>
                                : <div>
                                    {!!this.props.imagePreviewUrl &&
                                    <img
                                        alt={'zemuldo blogs create account'}
                                        src={this.props.imagePreviewUrl.img}
                                        style={{
                                            borderRadius: `${(Math.min(
                                                this.props.imagePreviewUrl.height,
                                                this.props.imagePreviewUrl.width
                                                ) +
                                                10) *
                                            (this.props.imagePreviewUrl.borderRadius / 2 / 100)}px`
                                        }}
                                    />}
                                    <br/>
                                    <Button color='green' onClick={() => this.props.showCreateAvatar(false)}> Change
                                        Avatar</Button>
                                </div>
                        }
                    </Form.Field>

                    <Form.Group widths='equal'>
                        <Form.Input
                            name={'firstName'}
                            size='small'
                            label='First Name'
                            fluid
                            type='text'
                            placeholder='First Name'
                            onChange={this.props.handleFormField}
                        />
                        <Form.Input
                            name={'lastName'}
                            label='Last Name'
                            fluid
                            type='text'
                            placeholder='Last Name'
                            onChange={this.props.handleFormField}
                        />
                    </Form.Group>
                    <Form.Input
                        name={'email'}
                        label='Email Address'
                        fluid
                        type='email'
                        placeholder='E-mail address'
                        onChange={this.props.handleFormField}
                    />
                    <Form.Group widths='equal'>
                        <Form.Input
                            name={'userName'}
                            label='Username'
                            fluid
                            type='text'
                            placeholder='Username'
                            onChange={this.props.handleFormField}
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Input
                            name={'password'}
                            label='Password'
                            fluid
                            type='password'
                            placeholder='Password'
                            onChange={this.props.handleFormField}
                        />
                        <Form.Input
                            name={'confirmPass'}
                            label='Confirm Password'
                            fluid
                            type='password'
                            placeholder='Confirm Password'
                            onChange={this.props.handleFormField}
                        />
                    </Form.Group>
                    {
                        !this.props.registering
                            ? <Button
                                onClick={() => this.props.handleSignUp()}
                                color='green' type='submit'>
                                Submit
                            </Button>
                            : <Loader active inline='centered'/>
                    }
                </Form>
                <Message
                    hidden={this.props.hideMessage}
                    error={this.props.error}
                    success={this.props.success}
                >
                    <Message.Header>
                        {this.props.errorDetails ? this.props.errorDetails.message : 'There are errors in your Input'}
                    </Message.Header>
                </Message>
                <Message>
                    Have an Account? <Link to='/login' onClick={() => this.props.handSwichReg(false)}> Login</Link>
                </Message>
            </div>
        )
    }
}

SignUpForm.propTypes = {
    errorDetails: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.oneOf([null])
    ]),
    hideMessage: PropTypes.bool.isRequired,
    registering: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    handSwichReg: PropTypes.func.isRequired,
    handleSignUp: PropTypes.func.isRequired,
    success: PropTypes.bool.isRequired,
    handleFormField: PropTypes.func.isRequired,
    imagePreviewUrl: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.oneOf([''])
    ]),
    showCreateAvatar: PropTypes.func.isRequired
}

export default SignUpForm
