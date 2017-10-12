import React, { Component } from 'react';
import {Menu, Button,Icon, Dropdown,Image} from 'semantic-ui-react'
import {Helmet} from "react-helmet";
import Login from './profile/loginForm'
import TechSummary from './tech/techSummary'
import BusinessSummary from './business/businessSummary'
import DevArticles from './developmentTuts/developmentTuts'
import HomePage from './homePage/homePage'
import GeoLocator from './partials/geoLocator'
import Footer from './partials/footer'
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios'
import config from './environments/conf'
const env = config[process.env.NODE_ENV] || 'development'

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
const pages = {
    dev:{
        name:'Development',
        icon:'code'
    },
    tech:{
        name:'Technology',
        icon:'server'
    },
    business:{
        name:'Business',
        icon:'creative commons'
    },
    reviews:{
        name:'Reviews',
        icon:'circle notched'
    },
    tuts:{
        name:'Tutorials',
        icon:'code'
    },
    home:{
        name:'Home',
        icon:'home'
    },
    profile:{
        name:'Profile',
        icon:'user circle'
    },
    login:{
        name:'Login',
        icon:'lock'
    }
}
class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeItem: 'ZemuldO-Home',
            current:'ZemuldO-Home',
            loggedin:false,
            user:null,
            iKnowYou:false,
            visitorInfo:null,
            windowSize:window.innerWidth,
            geoAllowed:false,
            log: [],
            currentUserLocation:'name',
            open: false,
            createNew:false,
            editingMode:false,
            secondMenu:true,
            colors:['green','blue','orange','violet','blue'],
            currentLocation:(pages[window.location.pathname.slice(1,window.location.pathname.length)]) ?
                window.location.pathname.slice(1,window.location.pathname.length):'home'
        };
        this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
        this.handleLoginButton = this.handleLoginButton.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.handleHomeClick = this.handleHomeClick.bind(this);
        this._handleChangeBodySize = this._handleChangeBodySize.bind(this);
        this.shuffle = this.shuffle.bind(this);
        this.successLogin = this.successLogin.bind(this);
        this.handleUserLogged = this.handleUserLogged.bind(this);
        this._handleCreateNew = this._handleCreateNew.bind(this)
        this._handleSwitchToProfile = this._handleSwitchToProfile.bind(this)
        this._goToEditor = this._goToEditor.bind(this)
        this._exitEditMode = this._exitEditMode.bind(this)
        this.handleScroll = this.handleScroll.bind(this)


    };
    _handleChangeBodySize(size){
        this.setState({windowSize:size})
    }
    handleUserLogged(user){
        this.setState({user:user})
    }
    shuffle() {
        let array = this.state.colors
        let currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        this.setState({colors:array});
    }
    resize = () => this.forceUpdate()
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        this.shuffle()
        this.forceUpdate()
        if(window.innerWidth<503){
            this._handleChangeBodySize(503)
        }
        if(window.innerWidth>503){
            this._handleChangeBodySize(503)
        }
        window.addEventListener('resize', this.resize)
        if(!this.state.iKnowYou){
            return axios.post(env.httpURL, {"query":"getIp"})
                .then(response => {
                    if(response.data.ip==='::1' || response.data.ip==='127.0.0.1'){
                        return{error:'user at localhost'}
                    }
                    else {
                        return axios.get('http://ip-api.com/json/'+response.data.ip, {})

                    }

                })
                .then(function (visitorData) {
                   if(!visitorData.error){
                       if(localStorage.getItem('user')){
                           let user = JSON.parse(localStorage.getItem('user'))
                           let o = visitorData.data;
                           o.sessionID = user.sessionID
                           o.query = 'addNewVisitor'
                           o.known = true
                           visitorData.data.query = 'addNewVisitor'
                           return axios.post(env.httpURL, o)
                       }
                       else {
                           let o = visitorData.data;
                           o.sessionID = o.countryCode+(o.lat+o.lon)+o.query+o.regionName
                           o.query = 'addNewVisitor'
                           visitorData.data.query = 'addNewVisitor'
                           return axios.post(env.httpURL, o)
                       }
                   }
                   else {
                       return{error:'user at localhost'}
                   }
                })
                .then(function (final) {
                   if(!final.error){
                       sessionStorage.setItem('user',JSON.stringify(final.data))
                       if(!localStorage.getItem('user')){
                           localStorage.setItem('user',JSON.stringify(final.data))
                       }
                   }
                })
                .catch(exception => {
                });
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.resize)
    }
    handleHomeClick = () => {
        this.setState({ currentLocation:'home',})
        this.setState({blog:null})
    }

    handleMenuItemClick = (e, { name }) => {
        if(name === 'home'){
            this.setState({ currentLocation:name,})
        }
        else {
            this.setState({ currentLocation:name,})
        }
    }
    successLogin = (user)=>{
        this.setState({user:user})
        localStorage.setItem('user',JSON.stringify(user))
        this.setState({loggedin:true,currentLocation:'profile'})
    }
    handleLoginButton = (e)=>{
        this.setState({ currentLocation: 'login'})
    }
    handleLogoutinButton = ()=>{
        localStorage.removeItem('user')
        this.setState({ currentLocation: 'home' ,loggedin:false})
    }
    _handleCreateNew = () =>{
        console.log("you can now create a new artivle")
        console.log(window.localStorage.getItem('draftContent'))
        let editorState = window.localStorage.getItem('draftContent')
        let blogData = window.localStorage.getItem('blogData')
        if(editorState && blogData){
            console.log("directt to edit mode")
            this.setState({editingMode:true})
        }
        this.setState({createNew:true})
    }
    _handleSwitchToProfile = () =>{
        this.setState({currentLocation:'profile',createNew:false})
    }
    _goToEditor(){
        this.setState({editingMode:true})
    }
    _exitEditMode(){
        this.setState({editingMode:false,createNew:false})
    }
    handleScroll = function(event) {
        //console.log(window.pageYOffset)
        this.setState({secondMenu:false})
    }

    render() {

        return (
            <div onScroll={this.handleScroll}>
                <div>
                    <GeoLocator geoAllowed={this.state.geoAllowed}/>
                </div>
                <Helmet>
                    <title>{'ZemuldO-'+toTitleCase(this.state.current)}</title>
                    <meta name="Danstan Otieno Onyango" content="ZemuldO-Home" />
                </Helmet>
                <Menu
                    secondary
                    style={{backgroundColor:'white',opacity:'0.9'}}
                    fixed='top'
                    size='mini'
                    color={this.state.colors[0]}
                    borderless
                >
                    <Menu.Item
                    >
                        <Icon size="large" color={this.state.colors[0]} name={(this.state.currentLocation==='home')?'home':pages[this.state.currentLocation].icon} />
                        <Dropdown
                            style={{color:this.state.colors[0]}}
                            pointing='top'
                            item
                            text={(this.state.currentLocation==='home')?'Home':pages[this.state.currentLocation].name}
                        >
                            <Dropdown.Menu style = {{margin:'1em'}}>
                                <Dropdown.Item
                                    name='home'
                                    active={this.state.currentLocation === 'home'}
                                    onClick={this.handleHomeClick}>
                                    <Icon color={this.state.colors[0]} name='home' />
                                    <span color={this.state.colors[0]}>HOME</span>
                                </Dropdown.Item>
                                <Dropdown.Item
                                    name='dev'
                                    active={this.state.currentLocation === 'dev'}
                                    onClick={this.handleMenuItemClick}>
                                    <Icon color={this.state.colors[0]} name='code' />
                                    <span color={this.state.colors[0]}>Dev</span>
                                </Dropdown.Item>
                                <Dropdown.Item
                                    name='business'
                                    active={this.state.currentLocation === 'business'}
                                    onClick={this.handleMenuItemClick}>
                                    <Icon color={this.state.colors[0]} name='creative commons' />
                                    <span color={this.state.colors[0]}>Business</span>
                                </Dropdown.Item>
                                <Dropdown.Item
                                    name='tech'
                                    active={this.state.currentLocation === 'tech'}
                                    onClick={this.handleMenuItemClick}>
                                    <Icon color={this.state.colors[0]} name='server' />
                                    <span color={this.state.colors[0]}>Tech</span>
                                </Dropdown.Item>
                                <Dropdown.Item
                                    name='reviews'
                                    active={this.state.currentLocation === 'use'}
                                    onClick={this.handleMenuItemClick}>
                                    <Icon color={this.state.colors[0]} name='circle notched' />
                                    <span color={this.state.colors[0]}>Reviews</span>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                   <Menu.Item
                       position="right"
                   >
                       {
                           (!this.state.loggedin) ?
                               <Button
                                   circular={true}
                                   onClick={() => { this.handleLoginButton() }}
                                   color={this.state.colors[0]}  size='mini'>Login</Button>:
                               <Dropdown
                                   style={{color:this.state.colors[0]}}
                                   pointing='top right'
                                   item
                                   text={toTitleCase(this.state.user.firstName)}>
                                   <Dropdown.Menu>
                                       <Dropdown.Item onClick={this._handleSwitchToProfile}>
                                           <Icon color={this.state.colors[0]} name='user circle' />
                                           <span color={this.state.colors[1]} >Your Profile</span>
                                       </Dropdown.Item>
                                       <Dropdown.Item>
                                           <Icon color={this.state.colors[0]} name='users' />
                                           <span color={this.state.colors[2]} >Followers</span>
                                       </Dropdown.Item>
                                       <Dropdown.Item>
                                           <Icon color={this.state.colors[0]} name='help' />
                                           <span color={this.state.colors[0]} >Help</span>
                                       </Dropdown.Item>
                                       <Dropdown.Item onClick={this._handleCreateNew}>
                                           <Icon color={this.state.colors[0]} name='plus'  />
                                           <span color={this.state.colors[0]} >New Article</span>
                                       </Dropdown.Item>
                                       <Dropdown.Item>
                                           <Icon color={this.state.colors[0]} name='setting' />
                                           <span color={this.state.colors[1]} >Settings</span>
                                       </Dropdown.Item>
                                       <Dropdown.Item onClick={this.handleLogoutinButton}>
                                           <Icon color={this.state.colors[0]} name='sign out' />
                                           <span color={this.state.colors[0]} >Sign Out</span>
                                       </Dropdown.Item>
                                   </Dropdown.Menu>
                               </Dropdown>
                       }
                       {
                           this.state.loggedin ?

                               <Image
                                   size='mini'
                                   floated="right"
                                   src={this.state.user.avatar.img}
                                   style={{
                                       borderRadius: `${(Math.min(
                                           this.state.user.avatar.height,
                                           this.state.user.avatar.width
                                           ) +
                                           10) *
                                       (this.state.user.avatar.borderRadius / 2 / 100)}px`
                                   }}
                               /> :
                               <div>

                               </div>
                       }


                   </Menu.Item>
                </Menu>
                <div style={{marginTop:'3em'}}>
                    {
                        (this.state.currentLocation ==='login' || (this.state.currentLocation==='profile')) ?
                            <Login
                                user={this.state.user}
                                _exitEditMode={this._exitEditMode}
                                _goToEditor = {this._goToEditor}
                                editingMode={this.state.editingMode}
                                createNew = {this.state.createNew}
                                _handleCreateNew={this._handleCreateNew}
                                handleUserLogged={this.handleUserLogged}
                                loggedin={this.state.loggedin}
                                successLogin={this.successLogin}
                                color={this.state.colors[0]}
                                current={this.state.currentLocation}
                                colors={this.state.colors} /> :
                        (this.state.currentLocation === 'ZemuldO-Home') ?
                            <HomePage
                                color={this.state.colors[2]}
                                colors={this.state.colors}
                                current={this.state.currentLocation} /> :
                        (this.state.currentLocation === 'tech') ?
                            <TechSummary
                                color={this.state.colors[1]}
                                colors={this.state.colors}
                                current={this.state.currentLocation} /> :
                        (this.state.currentLocation === 'business') ?
                            <BusinessSummary
                                color={this.state.colors[2]}
                                colors={this.state.colors}
                                current={this.state.currentLocation} /> :
                        (this.state.currentLocation === 'dev') ?
                            <DevArticles
                                color={this.state.colors[0]}
                                colors={this.state.colors}
                                current={this.state.currentLocation} /> :
                        <HomePage color={this.state.colors[1]}
                                  colors={this.state.colors}
                                  current={this.state.currentLocation} />
                    }
                </div>
                <Footer color={this.state.colors[0]} corrent={this.state.current}/>
            </div>
        )
    }
}
export default App;
