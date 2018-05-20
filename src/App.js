import React from 'react'
import Main from './routes'
import NavBar from './menu/compMenu'
import Footer from './partials/footer'
import ReviewPortal from './partials/portal'
import LiveChat from './chat/bot'
import {Segment} from 'semantic-ui-react'

export default class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {}
    };

    resize = () => this.forceUpdate();

    componentDidMount () {
        let x = localStorage.getItem(`scrollTo_${window.location.pathname}`)
        
        if(x){
            let position = JSON.parse(x)
            setTimeout(()=>{ window.scrollTo(position.x,position.y)},2000)
        }
        Notification.requestPermission().then(function(result) {
            console.log(result);
        })
        window.addEventListener('resize', this.resize)
    };

    componentWillUnmount () {
        window.removeEventListener('resize', this.resize)
    };

    handleMousePosition=(e)=>{
        localStorage.setItem(`moouse_${window.location.pathname}`,JSON.stringify({x:e.screenX,y:e.screenY}))
    }

    render () {
        return (
            <div onMouseMove={this.handleMousePosition}>
                <NavBar />
                <Segment basic text="true" style={{minHeight:`${window.innerHeight-200}px`}}>
                <Main />
                </Segment>
                <Footer />
                <ReviewPortal />
                <LiveChat />
            </div>
        )
    }
}