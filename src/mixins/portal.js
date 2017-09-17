import React, { Component } from 'react'
import { Button, Header, Segment, Portal,Form ,Checkbox,TextArea} from 'semantic-ui-react'
import axios from 'axios'
export default class ReviewPortal extends Component {
    constructor(props){
        super(props)
        this.state = {
            log: [],
            open: false,
            rating:0,
            message:'',
            checked:true,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handlePortalClose = this.handlePortalClose.bind(this);
        this.handlePortalOpen = this.handlePortalOpen.bind(this);
    }
    toggle = () => {
        this.setState({ checked: !this.state.checked })
    }

    handlePortalOpen = () => {
        this.setState({ open: true })
    }

    handlePortalClose = () => {
        this.setState({ open: false })
        this.writeLog('Portal closed')
    }
    handleSubmit= (e)=>{
        this.handlePortalClose()
        e.preventDefault();
        let review = {
            body:this.state.message,
            user:JSON.parse(sessionStorage.getItem('user')).sessionID
        }
        this.setState({ open: false })
        console.log(JSON.parse(sessionStorage.getItem('user')).sessionID)
        return axios.post('http://api.zemuldo.com:8090/analytics/visitors/review',review, {
        })
            .then(function (success) {
            })
            .catch(function (err) {

            })
    }
    handleTextChange(event) {
        this.setState({message: event.target.value});
    }
    writeLog = message => this.setState({ log: [message, ...this.state.log] })

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
                                closeOnTriggerClick
                                openOnTriggerClick
                                trigger={(
                                    <Button
                                        content={this.state.open ? 'Help Us Improve' : 'Mind a Review?'}
                                        negative={this.state.open}
                                        positive={!this.state.open}
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
                                        <Button  disabled={(this.state.message.length<20) || this.state.checked} onClick={this.handleSubmit} type='submit'>Submit</Button>
                                    </Form>
                                </Segment>
                            </Portal>
                        </div>:
                        <div></div>
                }
            </div>


        )
    }
}
