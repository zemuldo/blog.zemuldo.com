import React from 'react'
import {Button, Header, Segment, Portal, Form, TextArea, Comment, Image} from 'semantic-ui-react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as VarsActions from '../store/actions/vars'
import * as TopicsActions from '../store/actions/topics'
import PropTypes, { func } from 'prop-types'

let imets = []
for (let i = 0; i < 100; i++) {
  imets.push(i)
}

class LiveChat extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      log: [],
      portalOpen: false,
      rating: 0,
      message: '',
      checked: false,
      sessionId: null,
      chat: [],
      unsent:[]
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.toggle = this.toggle.bind(this)
    this.handlePortalClose = this.handlePortalClose.bind(this)
    this.handlePortalOpen = this.handlePortalOpen.bind(this)
    this.chat = this.chat.bind(this)
    this.scrollChat = this.scrollChat.bind(this)
    this.resendUnsent=this.resendUnsent.bind(this)
  }

  scrollChat = function (i) {
    this.refs[i].scrollIntoView({block: 'end', behavior: 'smooth'})
  };

  componentDidMount () {
    this.handleSocketClose()
    this.chat()
    setInterval(()=>{
      if(this.props.vars.ws.readyState!==1 && this.props.vars.ws.readyState!==0){
        this.connectHandler()
      }
    },5000)
  }

  componentWillUpdate(){}

  chat () {
    this.props.vars.ws.onmessage = function (message) {
      let mess = JSON.parse(message.data)
      if (mess.type === 'sessionId') {
        this.setState({sessionId: mess.msg})
        sessionStorage.setItem('sessionId', mess.msg)
        return true
      }
      if (mess.pups === 'bot' && mess.type !== 'sessionId') {
        let x = this.state.chat
        let ref = x.length
        x.push({by: 'bot', text: mess.msg})
        this.setState({chat: x})
        this.setState({portalOpen: true})
        if (this.refs[ref]) {
          this.scrollChat(ref)
        }
        return true
      }
      if (mess.type === 'exploreBlogs') {
        this.props.varsActions.updateVars({exploreBlogs: mess.msg})
        return true
      }
      if (mess.type === 'topicDetails') {
        this.props.topicsActions.updateTopics(mess.msg)
        return true
      }
    }.bind(this)
  }

  toggle = () => {
    this.setState({checked: !this.state.checked})
  };
  handlePortalOpen = () => {
    if (this.state.chat.length === 0) {
      this.setState({chat: [{by: 'bot', text: 'Hi i am zemuldo profile bot, just here to help'}]})
    }
    this.setState({portalOpen: true, checked: false})
  };
  handlePortalClose = () => {
    this.setState({portalOpen: false, checked: false})
  };
  connectHandler(){
    this.props.varsActions.updateVars({ws:new WebSocket(this.props.vars.env.wsURL)})
    this.chat()
    this.resendUnsent()
  }
  handleSubmit = (e) => {
    if (this.state.message.length > 1) {
      let x = this.state.chat
      x.push({by: 'user', text: this.state.message})
      this.setState({chat: x})
      let mess = {type: 'user', pups: 'chat', sessionId: this.state.sessionId, msg: this.state.message, tz: 'Africa/Nairobi'}
      if(this.props.vars.ws.readyState===1){
        this.props.vars.ws.send(JSON.stringify(mess))
      }
      else{
        this.connectHandler()
        let unsent = this.state.unsent
        unsent.push(mess)
        this.setState({unsent:unsent})
      }
      this.setState({message: ''})
      this.scrollChat('MessageEnd')
    }
  };

  handleSocketClose(){
    this.props.vars.ws.onclose = ()=>{
      this.props.varsActions.updateVars({offline:true})
    }
    this.props.vars.ws.onopen = ()=>{
      this.props.varsActions.updateVars({offline:null})
    }
    this.props.vars.ws.error = ()=>{
      this.props.varsActions.updateVars({offline:true})
    }
  }

  resendUnsent (){
    for(let i = 0; i<this.state.unsent.length;i++){
      setTimeout(()=>{
        if(this.props.vars.ws.readyState===1){
          this.props.vars.ws.send(JSON.stringify(this.state.unsent[i]))
          if(i===this.state.unsent.length-1){
            this.setState({unsent:[]})
          }
        }
      },1000)
    }
  }

  handleTextChange (event) {
    this.setState({message: event.target.value})
  }

  _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleSubmit(e)
    }
  };

  render () {
    return (
      <div>
        {
                    window.innerWidth > 800
                        ? <div style={{
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
                            <Segment
                              style={{
                                borderRadius: '1%',
                                backgroundColor: 'green',
                                maxHeight: '80%',
                                minWidth: '400px',
                                maxWidth: '300px',
                                right: '70%',
                                left: '3%',
                                position: 'fixed',
                                bottom: '10%',
                                zIndex: 1000
                              }}
                                >
                              <div>
                                <div className='alignCenter'>
                                  <Header>Zemuldo Profile Bot</Header>
                                  <Image avatar size={'small'} src={this.props.vars.env.static+'img/bot/bot.gif'} />
                                  <hr color='blue' />
                                </div>
                                <div className='chatContainer' style={{overflowX: 'hidden',overflowY: 'scroll', height: '300px'}}>
                                  {
                                                _.times(this.state.chat.length, (i) =>
                                                  <div ref={i} key={i}>
                                                    <Comment
                                                      className={this.state.chat[i].by === 'bot' ? 'botMessContainer' : 'userMessContainer'}>
                                                      <Comment.Content>
                                                        <Comment.Metadata>
                                                          <div><u>{new Date().toUTCString()}</u></div>
                                                        </Comment.Metadata>
                                                        <Comment.Text>{this.state.chat[i].text}</Comment.Text>
                                                      </Comment.Content>
                                                    </Comment>
                                                    <br />
                                                    <div>
                                                      {
                                                                this.state.chat[this.state.chat.length - 1].by === 'user' && this.state.chat.length === i + 1
                                                                    ? <Comment className={'botTyping'}>
                                                                      <Comment.Text>Bot typing...</Comment.Text>
                                                                    </Comment>
                                                                    : this.state.chat[this.state.chat.length - 1].by === 'bot' && this.state.chat.length === i + 1
                                                                        ? <Comment className={'userTyping'}>
                                                                          <Comment.Text>Press Enter...</Comment.Text>
                                                                        </Comment> : null
                                                            }
                                                    </div>
                                                  </div>
                                                )
                                            }
                                  <div ref='MessageEnd' />
                                </div>
                                <Form>
                                  <Form.Field>
                                    <TextArea
                                      value={this.state.message}
                                      onKeyPress={this._handleKeyPress}
                                      onChange={this.handleTextChange}
                                      placeholder='Start Typing'
                                      style={{minHeight: 30}} />
                                  </Form.Field>
                                  <Button disabled={!(this.state.message.length > 1)}
                                    onClick={this.handleSubmit} type='submit'>Send</Button>
                                </Form>
                              </div>
                            </Segment>
                          </Portal>
                        </div>
                        : <div />
                }
      </div>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    vars: state.vars
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    varsActions: bindActionCreators(VarsActions, dispatch),
    topicsActions: bindActionCreators(TopicsActions, dispatch)
  }
}

LiveChat.propTypes = {
  vars: PropTypes.object.isRequired,
  varsActions: PropTypes.object.isRequired,
  topicsActions: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveChat)
