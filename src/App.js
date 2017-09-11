import React, { Component } from 'react';
import {  Menu, Button,Icon, Grid, Segment, List, Header, Divider, Container, Image, Dropdown} from 'semantic-ui-react'
import {Helmet} from "react-helmet";
import Login from './login/loginForm'
import TechSummary from './tech/techSummary'
import BusinessSummary from './business/businessSummary'
import DevArticles from './developmentTuts/developmentTuts'
import HomePage from './homePage/homePage'
import 'semantic-ui-css/semantic.min.css';

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeItem: 'Zemuldo Tech Blog and Articles',
            current:'Zemuldo Tech Blog and Articles',
            logged:false
        };
        this.handleItemClick = this.handleItemClick.bind(this);
        this.handleLoginButton = this.handleLoginButton.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.handleHomeClick = this.handleHomeClick.bind(this);

    };
    resize = () => this.forceUpdate()
    componentDidMount() {
        window.addEventListener('resize', this.resize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }
    handleHomeClick = () => {
        this.setState({blog:null})
        this.setState({ current:'Zemuldo Tech Blog and Articles',})
    }

    handleItemClick = (e, { name }) => {
        if(name === 'Zemuldo Tech Blog and Articles'){
            window.location = "/"

        }
        else {
            this.setState({ current:name,})
        }

    }
    handleLoginButton = ()=>{
        this.setState({ current: 'login' ,logged:true})
    }
    handleLogoutinButton = ()=>{
        this.setState({ current: 'Zemuldo Tech Blog and Articles' ,logged:false})
    }

    render() {
        const { current } = this.state
        return (
            <div>
                <Helmet>
                    <title>{'Zemuld0-'+toTitleCase(this.state.current)}</title>
                    <meta name="owner" content="Zemuldo BlogSite" />
                </Helmet>
                <div>
                    {
                        (window.innerWidth<600) ?
                            <Menu pointing size='small' color="green" borderless>
                                <Menu.Item  name='Zemuldo Tech Blog and Articles' active={this.state.current === 'Zemuldo Tech Blog and Articles'} onClick={this.handleHomeClick} />
                                <Menu.Item name='tech' active={current === 'tech'} onClick={this.handleItemClick} />
                                <Menu.Item name='business' active={current === 'business'} onClick={this.handleItemClick} />
                                <Menu.Item name='dev' active={current === 'dev'} onClick={this.handleItemClick} />
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
                                <Menu.Item>
                                    {
                                        (!this.state.logged) ?
                                        <Button onClick={() => { this.handleLoginButton() }} color='green' fluid size='large'>Login</Button>:
                                        <Button onClick={() => { this.handleLogoutinButton() }} color='green' fluid size='large'>Logout</Button>
                                    }
                                </Menu.Item>
                            </Menu> :
                                <Menu pointing size='small' color="green" borderless>
                                    <Menu.Item  name='Zemuldo Tech Blog and Articles' active={current === 'Zemuldo Tech Blog and Articles'} onClick={this.handleItemClick} />
                                    <Menu.Item name='tech' active={current === 'tech'} onClick={this.handleItemClick} />
                                    <Menu.Item name='business' active={current === 'business'} onClick={this.handleItemClick} />
                                    <Menu.Item name='dev' active={current === 'dev'} onClick={this.handleItemClick} />
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
                                        <Menu.Item>
                                            {
                                                (!this.state.logged) ? <Button onClick={this.handleLoginButton} color='green' fluid size='large'>Login</Button>:
                                                    <Button onClick={this.handleLogoutinButton} color='green' fluid size='large'>Logout</Button>
                                            }
                                        </Menu.Item>
                                    </Menu.Menu>
                                </Menu>
                    }

                </div>
                <div>
                    {
                        (this.state.current ==='login') ? <Login current={this.state.current} /> :
                        (this.state.current === 'Zemuldo Tech Blog and Articles') ? <HomePage current={this.state.current} /> :
                        (this.state.current === 'tech') ? <TechSummary /> :
                        (this.state.current === 'business') ? <BusinessSummary current={this.state.current} /> :
                        (this.state.current === 'dev') ? <DevArticles current={this.state.current} /> :
                        <HomePage />
                    }
                </div>
            </div>
        )
    }
}
export default App;
