import React, { Component } from 'react';
import {  Menu, Button,Icon, Dropdown} from 'semantic-ui-react'
import {Helmet} from "react-helmet";
import Login from './login/loginForm'
import TechSummary from './tech/techSummary'
import BusinessSummary from './business/businessSummary'
import DevArticles from './developmentTuts/developmentTuts'
import HomePage from './homePage/homePage'
import GeoLocator from './partials/geoLocator'
import Footer from './partials/footer'
import 'semantic-ui-css/semantic.min.css';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios'
import config from './environments/conf'
const env = config[process.env.NODE_ENV] || 'development'

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
const pages = {
    dev:'Development',
    tech:'Technology',
    business:'Business',
    reviews:'Reviews',
    tuts:'Tutorials',
    home:'Zemuldo Home Pgae'
}
class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeItem: 'ZemuldO-Home',
            current:'ZemuldO-Home',
            logged:false,
            iKnowYou:false,
            visitorInfo:null,
            windowSize:window.innerWidth,
            geoAllowed:false,
            log: [],
            open: false,
            colors:['green','blue','orange','violet','pink'],
            currentLocation:(pages[window.location.pathname.slice(1,window.location.pathname.length)]) ? window.location.pathname.slice(1,window.location.pathname.length):'home'
        };
        this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
        this.handleLoginButton = this.handleLoginButton.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.handleHomeClick = this.handleHomeClick.bind(this);
        this._handleChangeBodySize = this._handleChangeBodySize.bind(this);
        this.shuffle = this.shuffle.bind(this);
    };
    _handleChangeBodySize(size){
        this.setState({windowSize:size})
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
            return axios.get(env.httpURL+'/getIp', {})
                .then(response => {
                    return axios.get('http://ip-api.com/json/'+response.data.ip, {})
                })
                .then(function (visitorData) {
                    let o= visitorData.data
                    if(localStorage.getItem('user')){
                        o.sessionID = o.countryCode+(o.lat+o.lon)+o.query+o.regionName
                        return axios.post(env.httpURL+'/analytics/visitors/new', visitorData.data)
                    }
                    else {
                        if(o.status==='success'){
                            visitorData.sessionID = o.countryCode+(o.lat+o.lon)+o.query+o.regionName
                            return axios.post(env.httpURL+'/analytics/visitors/new', visitorData.data)
                        }
                        else {
                            return axios.post(env.httpURL+'/analytics/visitors/new', visitorData.data)
                        }
                    }
                })
                .then(function (final) {
                    sessionStorage.setItem('user',JSON.stringify(final.data))
                    if(!localStorage.getItem('user')){
                        localStorage.setItem('user',JSON.stringify(final.data))
                    }
                })
                .catch(exception => {
                });
        }
    }

    componentWillUnmount() {
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
    handleLoginButton = ()=>{
        this.setState({ currentLocation: 'login' ,logged:true})
    }
    handleLogoutinButton = ()=>{
        this.setState({ currentLocation: 'home' ,logged:false})
    }

    render() {
        return (
            <div>
                <div>
                    <GeoLocator geoAllowed={this.state.geoAllowed}/>
                </div>
                <Helmet>
                    <title>{'ZemuldO-'+toTitleCase(this.state.current)}</title>
                    <meta name="owner" content="ZemuldO-Home" />
                </Helmet>
                <div>
                    {
                        (window.innerWidth<this.state.windowSize) ?
                            <Menu fixed='top' pointing size='small' color="green" borderless>
                                <Menu.Item  name='home' active={this.state.currentLocation === 'home'} onClick={this.handleHomeClick}>
                                    <Icon color={this.state.colors[0]} name='home' />
                                    <span color={this.state.colors[0]}>Home</span>
                                </Menu.Item>
                                <Dropdown item text='Categories'>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>
                                            <Menu.Item name='dev' active={this.state.currentLocation === 'dev'} onClick={this.handleMenuItemClick}>
                                                <Icon color={this.state.colors[0]} name='circle notched' />
                                                <span color={this.state.colors[0]}>Dev</span>
                                            </Menu.Item>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <Menu.Item name='business' active={this.state.currentLocation === 'business'} onClick={this.handleMenuItemClick}>
                                                <Icon color={this.state.colors[0]} name='circle notched' />
                                                <span color={this.state.colors[0]}>Business</span>
                                            </Menu.Item>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <Menu.Item name='tech' active={this.state.currentLocation === 'tech'} onClick={this.handleMenuItemClick}>
                                                <Icon color={this.state.colors[0]} name='circle notched' />
                                                <span color={this.state.colors[0]}>Cookie Policy</span>
                                            </Menu.Item>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <Menu.Item name='reviews' active={this.state.currentLocation === 'reviews'} onClick={this.handleMenuItemClick}>
                                                <Icon color={this.state.colors[0]} name='circle notched' />
                                                <span color={this.state.colors[0]}>Reviews</span>
                                            </Menu.Item>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <Menu.Item name='Tuts' active={this.state.currentLocation === 'tuts'} onClick={this.handleMenuItemClick}>
                                                <Icon color={this.state.colors[0]} name='circle notched' />
                                                <span color={this.state.colors[0]}>Tuts</span>
                                            </Menu.Item>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                {
                                    (window.innerWidth>this.state.windowSize) ?
                                        <Menu.Menu position='right'>
                                            <Menu.Item>
                                                <a href="https://twitter.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                    <Icon color={this.state.colors[0]} name='twitter' />
                                                    <span color={this.state.colors[0]} >Twitter</span>
                                                </a>
                                            </Menu.Item>

                                            <Menu.Item >
                                                <a href="https://facebook.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                    <Icon color={this.state.colors[0]} name='facebook' />
                                                    <span color={this.state.colors[0]}>FaceBook</span>
                                                </a>
                                            </Menu.Item>

                                            <Menu.Item>
                                                <a href="https://github.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                    <Icon color={this.state.colors[0]} name='github' />
                                                    <span color={this.state.colors[0]}>GitHub</span>
                                                </a>
                                            </Menu.Item>
                                        </Menu.Menu>:
                                        <Menu.Menu position='right'>
                                            <Dropdown item text='Social Sites'>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item> <a href="https://twitter.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                        <Icon color={this.state.colors[0]} name='twitter' />
                                                        <span color={this.state.colors[0]} >Twitter</span>
                                                    </a></Dropdown.Item>
                                                    <Dropdown.Item><a href="https://facebook.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                        <Icon color={this.state.colors[0]} name='facebook' />
                                                        <span color={this.state.colors[0]}>FaceBook</span>
                                                    </a></Dropdown.Item>
                                                    <Dropdown.Item> <a href="https://github.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                        <Icon color={this.state.colors[0]} name='github' />
                                                        <span color={this.state.colors[0]}>GitHub</span>
                                                    </a></Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Menu.Menu>


                                }
                                <Menu.Item>
                                    {
                                        (!this.state.logged) ?
                                        <Button onClick={() => { this.handleLoginButton() }} color={this.state.colors[0]} fluid size='large'>Login</Button>:
                                        <Button onClick={() => { this.handleLogoutinButton() }} color={this.state.colors[0]} fluid size='large'>Logout</Button>
                                    }
                                </Menu.Item>
                            </Menu> :
                                <Menu fixed='top' pointing size='small' color="green" borderless>
                                    <Menu.Item  name='home' active={this.state.currentLocation === 'home'} onClick={this.handleHomeClick}>
                                        <Icon color={this.state.colors[0]} name='home' />
                                        <span color={this.state.colors[0]}>Home</span>
                                    </Menu.Item>
                                    <Menu.Item name='tech' active={this.state.currentLocation === 'tech'} onClick={this.handleMenuItemClick}>
                                        <Icon color={this.state.colors[0]} name='circle notched' />
                                        <span color={this.state.colors[0]}>Tech</span>
                                    </Menu.Item>
                                    <Menu.Item name='business' active={this.state.currentLocation === 'business'} onClick={this.handleMenuItemClick}>
                                        <Icon color={this.state.colors[0]} name='circle notched' />
                                        <span color={this.state.colors[0]}>Business</span>
                                    </Menu.Item>
                                    <Menu.Item name='dev' active={this.state.currentLocation === 'dev'} onClick={this.handleMenuItemClick}>
                                        <Icon color={this.state.colors[0]} name='circle notched' />
                                        <span color={this.state.colors[0]}>Dev</span>
                                    </Menu.Item>
                                    <Menu.Item name='reviews' active={this.state.currentLocation === 'reviews'} onClick={this.handleMenuItemClick}>
                                        <Icon color={this.state.colors[0]} name='circle notched' />
                                        <span color={this.state.colors[0]}>Reviews</span>
                                    </Menu.Item>
                                    <Menu.Item name='tuts' active={this.state.currentLocation === 'tuts'} onClick={this.handleMenuItemClick}>
                                        <Icon color={this.state.colors[0]} name='circle notched' />
                                        <span color={this.state.colors[0]}>Tuts</span>
                                    </Menu.Item>
                                    {
                                        (window.innerWidth>this.state.windowSize) ?
                                            <Menu.Menu position='right'>
                                                <Menu.Item>
                                                    <a href="https://twitter.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                        <Icon color='blue' name='twitter' />
                                                        <span color={this.state.colors[0]} >Twitter</span>
                                                    </a>
                                                </Menu.Item>

                                                <Menu.Item >
                                                    <a href="https://facebook.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                        <Icon color='violet' name='facebook' />
                                                        <span color={this.state.colors[0]}>FaceBook</span>
                                                    </a>
                                                </Menu.Item>

                                                <Menu.Item>
                                                    <a href="https://github.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                        <Icon color='black' name='github' />
                                                        <span color={this.state.colors[0]}>GitHub</span>
                                                    </a>
                                                </Menu.Item>
                                            </Menu.Menu>:
                                            <Menu.Menu position='right'>
                                                <Dropdown item text='Social Sites'>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item> <a href="https://twitter.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                            <Icon color='blue' name='twitter' />
                                                            <span color={this.state.colors[0]} >Twitter</span>
                                                        </a></Dropdown.Item>
                                                        <Dropdown.Item><a href="https://facebook.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                            <Icon color='blue' name='facebook' />
                                                            <span color={this.state.colors[0]}>FaceBook</span>
                                                        </a></Dropdown.Item>
                                                        <Dropdown.Item> <a href="https://github.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                            <Icon color='black' name='github' />
                                                            <span color={this.state.colors[0]}>GitHub</span>
                                                        </a></Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </Menu.Menu>


                                    }
                                    <Menu.Item>
                                        {
                                            (!this.state.logged) ?
                                                <Button onClick={() => { this.handleLoginButton() }} color={this.state.colors[0]} fluid size='large'>Login</Button>:
                                                <Button onClick={() => { this.handleLogoutinButton() }} color={this.state.colors[0]} fluid size='large'>Logout</Button>
                                        }
                                    </Menu.Item>
                                </Menu>
                    }

                </div>
                <div style={{marginTop:'3em'}}>
                    {
                        (this.state.currentLocation ==='login') ? <Login color={this.state.colors[0]} current={this.state.current} colors={this.state.colors} /> :
                        (this.state.currentLocation === 'ZemuldO-Home') ? <HomePage color={this.state.colors[2]} colors={this.state.colors}  current={this.state.current} /> :
                        (this.state.currentLocation === 'tech') ? <TechSummary color={this.state.colors[1]} colors={this.state.colors} current={this.state.current} /> :
                        (this.state.currentLocation === 'business') ? <BusinessSummary color={this.state.colors[2]} colors={this.state.colors} current={this.state.current} /> :
                        (this.state.currentLocation === 'dev') ? <DevArticles color={this.state.colors[0]} colors={this.state.colors} current={this.state.current} /> :
                        <HomePage color={this.state.colors[1]} colors={this.state.colors} current={this.state.current} />
                    }
                </div>
                <Footer color={this.state.colors[0]} corrent={this.state.current}/>
            </div>
        )
    }
}
export default App;

//add tweet photo, "pic.twitter.com/Ew9ZJJDPAR"
