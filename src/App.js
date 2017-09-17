import React, { Component } from 'react';
import {  Menu, Button,Icon, Dropdown} from 'semantic-ui-react'
import {Helmet} from "react-helmet";
import Login from './login/loginForm'
import TechSummary from './tech/techSummary'
import BusinessSummary from './business/businessSummary'
import DevArticles from './developmentTuts/developmentTuts'
import HomePage from './homePage/homePage'
import GeoLocator from './mixins/geoLocator'
import Footer from './mixins/footer'
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios'

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
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
        };
        this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
        this.handleLoginButton = this.handleLoginButton.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.handleHomeClick = this.handleHomeClick.bind(this);
        this._handleChangeBodySize = this._handleChangeBodySize.bind(this);

    };
    _handleChangeBodySize(size){
        this.setState({windowSize:size})
    }
    resize = () => this.forceUpdate()
    componentDidMount() {
        this.forceUpdate()
        if(window.innerWidth<503){
            this._handleChangeBodySize(503)
        }
        if(window.innerWidth>503){
            this._handleChangeBodySize(503)
        }
        window.addEventListener('resize', this.resize)
        if(!this.state.iKnowYou){
            return axios.get('http://api.zemuldo.com:8090/getIp', {})
                .then(response => {
                    console.log(response.data)
                    return axios.get('http://ip-api.com/json/'+response.data.ip, {})
                })
                .then(function (visitorData) {
                    let o= visitorData.data
                    if(localStorage.getItem('user')){
                        console.log(localStorage.getItem('user').data)
                        o.sessionID = o.countryCode+(o.lat+o.lon)+o.query+o.regionName
                        return axios.post('http://api.zemuldo.com:8090/analytics/visitors/new', visitorData.data)
                    }
                    else {
                        if(o.status==='success'){
                            visitorData.sessionID = o.countryCode+(o.lat+o.lon)+o.query+o.regionName
                            return axios.post('http://api.zemuldo.com:8090/analytics/visitors/new', visitorData.data)
                        }
                        else {
                            return axios.post('http://api.zemuldo.com:8090/analytics/visitors/new', visitorData.data)
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
        this.setState({blog:null})
        this.setState({ current:'ZemuldO-Home',})
    }

    handleMenuItemClick = (e, { name }) => {
        if(name === 'ZemuldO-Home'){
            window.location = "/"
        }
        else {
            this.setState({ current:name,})
        }

    }
    handleLoginButton = ()=>{
        console.log(this.state.geoAllowed)
        this.setState({ current: 'login' ,logged:true})
    }
    handleLogoutinButton = ()=>{
        this.setState({ current: 'ZemuldO-Home' ,logged:false})
    }

    render() {
        const { current } = this.state
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
                                <Menu.Item  name='ZemuldO-Home' active={this.state.current === 'ZemuldO-Home'} onClick={this.handleHomeClick}>
                                    <Icon color='green' name='home' />
                                    <span color='green'>Home</span>
                                </Menu.Item>
                                <Dropdown item text='Categories'>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>
                                            <Menu.Item name='dev' active={current === 'dev'} onClick={this.handleMenuItemClick}>
                                                <Icon color='green' name='square' />
                                                <span color='green'>Dev</span>
                                            </Menu.Item>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <Menu.Item name='business' active={current === 'business'} onClick={this.handleMenuItemClick}>
                                                <Icon color='green' name='square' />
                                                <span color='green'>Business</span>
                                            </Menu.Item>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <Menu.Item name='tech' active={current === 'tech'} onClick={this.handleMenuItemClick}>
                                                <Icon color='green' name='square' />
                                                <span color='green'>Cookie Policy</span>
                                            </Menu.Item>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <Menu.Item name='reviews' active={current === 'reviews'} onClick={this.handleMenuItemClick}>
                                                <Icon color='green' name='square' />
                                                <span color='green'>Reviews</span>
                                            </Menu.Item>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <Menu.Item name='Tuts' active={current === 'tuts'} onClick={this.handleMenuItemClick}>
                                                <Icon color='green' name='square' />
                                                <span color='green'>Tuts</span>
                                            </Menu.Item>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                {
                                    (window.innerWidth>this.state.windowSize) ?
                                        <Menu.Menu position='right'>
                                            <Menu.Item>
                                                <a href="https://twitter.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                    <Icon color='green' name='twitter' />
                                                    <span color='green' >Twitter</span>
                                                </a>
                                            </Menu.Item>

                                            <Menu.Item >
                                                <a href="https://facebook.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                    <Icon color='green' name='facebook' />
                                                    <span color='green'>FaceBook</span>
                                                </a>
                                            </Menu.Item>

                                            <Menu.Item>
                                                <a href="https://github.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                    <Icon color='green' name='github' />
                                                    <span color='green'>GitHub</span>
                                                </a>
                                            </Menu.Item>
                                        </Menu.Menu>:
                                        <Menu.Menu position='right'>
                                            <Dropdown item text='Social Sites'>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item> <a href="https://twitter.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                        <Icon color='green' name='twitter' />
                                                        <span color='green' >Twitter</span>
                                                    </a></Dropdown.Item>
                                                    <Dropdown.Item><a href="https://facebook.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                        <Icon color='green' name='facebook' />
                                                        <span color='green'>FaceBook</span>
                                                    </a></Dropdown.Item>
                                                    <Dropdown.Item> <a href="https://github.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                        <Icon color='green' name='github' />
                                                        <span color='green'>GitHub</span>
                                                    </a></Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Menu.Menu>


                                }
                                <Menu.Item>
                                    {
                                        (!this.state.logged) ?
                                        <Button onClick={() => { this.handleLoginButton() }} color='green' fluid size='large'>Login</Button>:
                                        <Button onClick={() => { this.handleLogoutinButton() }} color='green' fluid size='large'>Logout</Button>
                                    }
                                </Menu.Item>
                            </Menu> :
                                <Menu fixed='top' pointing size='small' color="green" borderless>
                                    <Menu.Item  name='ZemuldO-Home' active={this.state.current === 'ZemuldO-Home'} onClick={this.handleHomeClick}>
                                        <Icon color='green' name='home' />
                                        <span color='green'>Home</span>
                                    </Menu.Item>
                                    <Menu.Item name='tech' active={current === 'tech'} onClick={this.handleMenuItemClick}>
                                        <Icon color='green' name='square' />
                                        <span color='green'>Tech</span>
                                    </Menu.Item>
                                    <Menu.Item name='business' active={current === 'business'} onClick={this.handleMenuItemClick}>
                                        <Icon color='green' name='square' />
                                        <span color='green'>Business</span>
                                    </Menu.Item>
                                    <Menu.Item name='dev' active={current === 'dev'} onClick={this.handleMenuItemClick}>
                                        <Icon color='green' name='square' />
                                        <span color='green'>Dev</span>
                                    </Menu.Item>
                                    <Menu.Item name='reviews' active={current === 'reviews'} onClick={this.handleMenuItemClick}>
                                        <Icon color='green' name='square' />
                                        <span color='green'>Reviews</span>
                                    </Menu.Item>
                                    <Menu.Item name='Tuts' active={current === 'tuts'} onClick={this.handleMenuItemClick}>
                                        <Icon color='green' name='square' />
                                        <span color='green'>Tuts</span>
                                    </Menu.Item>
                                    {
                                        (window.innerWidth>this.state.windowSize) ?
                                            <Menu.Menu position='right'>
                                                <Menu.Item>
                                                    <a href="https://twitter.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                        <Icon color='green' name='twitter' />
                                                        <span color='green' >Twitter</span>
                                                    </a>
                                                </Menu.Item>

                                                <Menu.Item >
                                                    <a href="https://facebook.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                        <Icon color='green' name='facebook' />
                                                        <span color='green'>FaceBook</span>
                                                    </a>
                                                </Menu.Item>

                                                <Menu.Item>
                                                    <a href="https://github.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                        <Icon color='green' name='github' />
                                                        <span color='green'>GitHub</span>
                                                    </a>
                                                </Menu.Item>
                                            </Menu.Menu>:
                                            <Menu.Menu position='right'>
                                                <Dropdown item text='Social Sites'>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item> <a href="https://twitter.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                            <Icon color='green' name='twitter' />
                                                            <span color='green' >Twitter</span>
                                                        </a></Dropdown.Item>
                                                        <Dropdown.Item><a href="https://facebook.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                            <Icon color='green' name='facebook' />
                                                            <span color='green'>FaceBook</span>
                                                        </a></Dropdown.Item>
                                                        <Dropdown.Item> <a href="https://github.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                            <Icon color='green' name='github' />
                                                            <span color='green'>GitHub</span>
                                                        </a></Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </Menu.Menu>


                                    }
                                    <Menu.Item>
                                        {
                                            (!this.state.logged) ?
                                                <Button onClick={() => { this.handleLoginButton() }} color='green' fluid size='large'>Login</Button>:
                                                <Button onClick={() => { this.handleLogoutinButton() }} color='green' fluid size='large'>Logout</Button>
                                        }
                                    </Menu.Item>
                                </Menu>
                    }

                </div>
                <div style={{marginTop:'3em'}}>
                    {
                        (this.state.current ==='login') ? <Login current={this.state.current} /> :
                        (this.state.current === 'ZemuldO-Home') ? <HomePage current={this.state.current} /> :
                        (this.state.current === 'tech') ? <TechSummary /> :
                        (this.state.current === 'business') ? <BusinessSummary current={this.state.current} /> :
                        (this.state.current === 'dev') ? <DevArticles current={this.state.current} /> :
                        <HomePage />
                    }
                </div>
                <Footer corrent={this.state.current}/>
            </div>
        )
    }
}
export default App;
