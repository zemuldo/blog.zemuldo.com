import React from 'react'
import { Button, Header, Segment, Portal,Form,TextArea,Comment,Image} from 'semantic-ui-react'
import _ from 'lodash'
import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development';

class LiveChat extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            log: [],
            portalOpen: false,
            rating:0,
            message:'',
            checked:false,
            sessionId:null,
            chat:[{by:'bot',text:'Hi i am zemuldo profile bot, just here to help'}]
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handlePortalClose = this.handlePortalClose.bind(this);
        this.handlePortalOpen = this.handlePortalOpen.bind(this);
        this.ws = new WebSocket(env.wsURL);
        this.chat = this.chat.bind(this)
    }
    componentDidMount(){
       this.chat();
    }
    chat(){
        this.ws.onopen = function() {
            this.ws.send(JSON.stringify({message: 'Hello There'}));
        }.bind(this);
        this.ws.onmessage = function(message) {
            let mess = JSON.parse(message.data)
            if(mess.type==='sessionId'){
                this.setState({sessionId:mess.msg})
            }
            else {
                let x = this.state.chat
                x.push({by:'bot',text:mess.msg});
                this.setState({chat:x})
            }
        }.bind(this);
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
        let x = this.state.chat
        x.push({by:'user',text:this.state.message})
        this.setState({chat:x})
        let mess = {type: "user", sessionId: this.state.sessionId, msg: this.state.message, tz: "Africa/Nairobi"}
        this.ws.send(JSON.stringify(mess));
        this.setState({message:''})

    }
    handleTextChange(event) {
        this.setState({message: event.target.value});
    }
    _handleKeyPress= (e)=> {
        if (e.key === 'Enter') {
            this.handleSubmit(e)
        }
    }
    render() {
        return (
            <div>
                {
                    window.innerWidth>800 ?
                        <div style={{
                            position: 'fixed',
                            bottom: '3%',
                            left: '3%'
                        }}>
                            <Portal
                                open={this.state.portalOpen}
                                closeOnTriggerClick
                                openOnTriggerClick
                                trigger={(
                                    <Button
                                        content={this.state.portalOpen ? 'Live Chat' : 'Chat Now?'}
                                        negative={this.state.portalOpen}
                                        positive={!this.state.portalOpen}
                                    />
                                )}
                                onOpen={this.handlePortalOpen}
                                onClose={this.handlePortalClose}
                            >
                                <Segment style={{borderRadius:'1%', backgroundColor:'blue', right: '60%',left:'3%', position: 'fixed', bottom: '10%', zIndex: 1000 }}>
                                    <div>
                                        <Header className='alignCenter'>Zemuldo Profile Bot</Header>
                                        <Image size='medium' src='https://photos.zemuldo.com/chatbot.png'/>
                                        <hr color='green'/>
                                        <div className='chatContainer' style={{overflowX: 'scroll', height:'400px'}}>
                                            {
                                                _.times(this.state.chat.length,(i)=>
                                                    <div key ={i}>
                                                        <Comment className={this.state.chat[i].by==='bot'?'botMessContainer':'userMessContainer'} style={this.state.chat[i].by==='bot'?{textAlign:'left',color:'green'}:{textAlign:'right',color:'blue'}}>
                                                            <Comment.Avatar as='avatar' src='https://photos.zemuldo.com/cht.jpg' />
                                                            <Comment.Content>
                                                                <Comment.Author as='a'>{this.state.chat[i].by==='bot'?this.state.chat[i].by:'You'}</Comment.Author>
                                                                <Comment.Metadata>
                                                                    <div>{new Date().toUTCString()}</div>
                                                                </Comment.Metadata>
                                                                <Comment.Text> {this.state.chat[i].text}</Comment.Text>
                                                                <Comment.Actions>
                                                                    <Comment.Action>Reply</Comment.Action>
                                                                </Comment.Actions>
                                                            </Comment.Content>
                                                        </Comment>
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <Form>
                                            <Form.Field>
                                                <TextArea value={this.state.message} onKeyPress={this._handleKeyPress}  onChange={this.handleTextChange} placeholder='Leave a message' style={{ minHeight: 30 }} />
                                            </Form.Field>
                                            <Button  disabled={!(this.state.message.length>1)} onClick={this.handleSubmit} type='submit'>Send</Button>
                                        </Form>
                                    </div>
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

export default  LiveChat;