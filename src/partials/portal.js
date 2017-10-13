import React, { Component } from 'react'
import { Button, Header, Segment, Portal,Form ,Checkbox,TextArea} from 'semantic-ui-react'
import axios from 'axios'
import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'
export default class ReviewPortal extends Component {
    constructor(props){
        super(props)
        this.state = {
            log: [],
            portalOpen: false,
            rating:0,
            message:'',
            checked:false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handlePortalClose = this.handlePortalClose.bind(this);
        this.handlePortalOpen = this.handlePortalOpen.bind(this);
    }
    toggle = () => {
        this.setState({ checked: !this.state.checked });
    }

    handlePortalOpen = () => {
        this.setState({ portalOpen: true ,checked: false});
    }

    handlePortalClose = () => {
        this.setState({ portalOpen: false ,checked: false});
    }
    handleSubmit= (e)=>{
        this.setState({ checked: false});
        e.preventDefault();
        let review = null;
        let user = null;
        if(localStorage.getItem('user')){
            user = JSON.parse(localStorage.getItem('user'))
        }
        else {
            user = {
                id:0,
                userName:'unknown-not no account'
            }

        }
        let visitor = null;
        if(localStorage.getItem('visitor')){
            visitor = JSON.parse(sessionStorage.getItem('visitor'))
        }
        else {
            visitor = {
                sessionID:'unknownUser'
            }

        }
        if(visitor && visitor.sessionID){
            review = {
                queryData:{
                    message:this.state.message,
                    user:{
                        sessionID:visitor.sessionID,
                        userName:user.userName,
                        id:user.id
                    }
                },
                queryMethod:"newReview"
            }
            this.setState({ checked: true });
            setTimeout(function() { this.setState({portalOpen: false}); }.bind(this),1500);
            return axios.post(env.httpURL, review)
                .then(function (success) {
                })
                .catch(function (err) {

                })
        }
        else {
            setTimeout(function() { this.setState({portalOpen: false}); }.bind(this),1500);
        }
    }
    handleTextChange(event) {
        this.setState({message: event.target.value});
    }
    render() {
        return (
            <div>
                {
                    window.innerWidth>800 ?
                        <div style={{
                            position: 'fixed',
                            bottom: '3%',
                            right: '3%'
                        }}>
                            <Portal
                                open={this.state.portalOpen}
                                closeOnTriggerClick
                                openOnTriggerClick
                                trigger={(
                                    <Button
                                        content={this.state.portalOpen ? 'Help Us Improve' : 'Mind a Review?'}
                                        negative={this.state.portalOpen}
                                        positive={!this.state.portalOpen}
                                    />
                                )}
                                onOpen={this.handlePortalOpen}
                                onClose={this.handlePortalClose}
                            >
                                <Segment style={{ left: '70%', position: 'fixed', bottom: '10%', zIndex: 1000 }}>
                                    <Header>Thanks for Visiting</Header>
                                    <p>Leave a message</p>
                                    <Form>
                                        <Form.Field>
                                            <TextArea  onChange={this.handleTextChange} placeholder='Leave a message' style={{ minHeight: 30 }} />
                                        </Form.Field>
                                        <Form.Field>
                                            <Checkbox label='I agree to the Terms and Conditions' onChange={this.toggle} />
                                        </Form.Field>
                                        <Button  disabled={!(this.state.message.length>20 && this.state.checked)} onClick={this.handleSubmit} type='submit'>Submit</Button>
                                    </Form>
                                </Segment>
                            </Portal>
                        </div>:
                        <div>

                        </div>
                }
            </div>


        )
    }
}
