import React, { Component } from 'react';
import { Button,Form,Input,Icon } from 'semantic-ui-react'
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/delayWhen';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/dom/webSocket';
import * as moment from 'moment';
import 'moment-timezone';
import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'

class ProfileBot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wsUrl: env.wsURL,
            timezone: moment.tz.guess(),
            wsSessionId: null,
            ws$: Subject,
            Unsubscribe$: new Subject(),
            user:'visitor',
            users: [],
            error: null,
            userMsg:'',
            msgs: [],
            botIsTyping: false,
            message:''
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleMessageType = this.handleMessageType.bind(this);
        this.scrollChatToBottom = this.scrollChatToBottom.bind(this);
        this.handleMessageType = this.handleMessageType.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        console.log(process.env.NODE_ENV)
        this.ws$ = Observable.webSocket(this.wsUrl);
        this.ws = new WebSocket(this.state.wsUrl);
        this.ws.onmessage = e =>{
            console.log(e)
            this.setState({wsSessionId:JSON.parse(e.data).msg});
        }
        this.ws$.filter(r => r.type === 'sessionId')
            .takeUntil(this.state.Unsubscribe$).take(1)
            .subscribe(r => this.setState({wsSessionId:r.msg}));
        this.ws.onerror = e => this.setState({
            error: 'WebSocket error'
        })
        this.ws.onclose = e => !e.wasClean && this.setState({
            error: `WebSocket error: ${e.code} ${e.reason}`
        })
    }

    componentWillUnmount() {
        this.ws.close()
    }
    scrollChatToBottom() {
        setTimeout(() => {
            try {
                window.scrollTo(0,0);
            } catch(err) { }
        }, 0);
    }
    pushMsg(msg, clearUserMsg) {
        this.state.msgs.push(msg);
        this.setState({
            botIsTyping: false,
            userMsg: clearUserMsg ? '' : this.userMsg
        })
        this.scrollChatToBottom();
    }
    onSubmit(event) {
        this.setState({message:''})
        event.preventDefault();
        this.state.msgs.push(this.state.userMsg)
        const input = {
            type: this.state.user,
            sessionId: this.state.wsSessionId,
            msg: this.state.userMsg,
            tz: this.state.timezone
        };
        this.ws.send(JSON.stringify(input));
        this.ws.onmessage = e =>{
            console.log(e)
            this.setState({wsSessionId:JSON.parse(e.data).msg});
        }
        this.botIsTyping = true;
    }
    handleMessageType(e) {
       this.setState({userMsg:e.target.value,message:e.target.value})
    }

    render() {
        return (
            <div className="container">
                <div style={{borderBottomColor:'red'}}>
                    {
                        this.state.msgs.map((x, i) =>
                            <p>
                                {
                                    this.state.msgs[i]
                                }
                                <br/>
                            </p>
                        )}
                </div>
                <Form>
                    <Form.Field>
                        <hr/>
                        <Input
                            placeholder={this.state.message}
                            onChange={this.handleMessageType}
                        />
                    </Form.Field>
                    <Button  onClick={this.onSubmit} type='submit'>Submit</Button>
                </Form>
            </div>
        )
    }
}

export default ProfileBot