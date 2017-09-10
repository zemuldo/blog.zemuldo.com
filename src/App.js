import React, { Component } from 'react';
import {  Menu, Button,Icon, Grid, Segment, List, Header, Divider, Container, Image, Dropdown} from 'semantic-ui-react'
import Login from './login/loginForm'
import TechSummary from './tech/techSummary'
import BusinessSummary from './business/businessSummary'
import HomePage from './homePage/homePage'
import 'semantic-ui-css/semantic.min.css';

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
    };
    resize = () => this.forceUpdate()
    componentDidMount() {
        window.addEventListener('resize', this.resize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }
    handleItemClick = (e, { name }) => {
        this.setState({ activeItem: name , current:name,})
    }
    handleLoginButton = ()=>{
        this.setState({ current: 'login' ,logged:true})
    }
    handleLogoutinButton = ()=>{
        this.setState({ current: 'Zemuldo Tech Blog and Articles' ,logged:false})
    }
    render() {
        const { activeItem } = this.state
        return (
            <div>
                <div>
                    {
                        (window.innerWidth<600) ?
                            <Menu pointing size='small' color="green">
                                <Menu.Item  name='Zemuldo Tech Blog and Articles' active={activeItem === 'Zemuldo Tech Blog and Articles'} onClick={this.handleItemClick} />
                                <Menu.Item name='tech' active={activeItem === 'tech'} onClick={this.handleItemClick} />
                                <Menu.Item name='business' active={activeItem === 'business'} onClick={this.handleItemClick} />
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
                                        (!this.state.logged) ? <Button onClick={this.handleLoginButton} color='green' fluid size='large'>Login</Button>:
                                            <Button onClick={this.handleLogoutinButton} color='green' fluid size='large'>Logout</Button>
                                    }
                                </Menu.Item>
                            </Menu> :
                                <Menu pointing size='small' color="green">
                                    <Menu.Item  name='Zemuldo Tech Blog and Articles' active={activeItem === 'Zemuldo Tech Blog and Articles'} onClick={this.handleItemClick} />
                                    <Menu.Item name='tech' active={activeItem === 'tech'} onClick={this.handleItemClick} />
                                    <Menu.Item name='business' active={activeItem === 'business'} onClick={this.handleItemClick} />
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
                        <HomePage />
                    }
                </div>
                <div>
                    <Segment color='green' inverted vertical style={{ padding: '1em 0em' }}>
                        <Container>
                            <Grid divided inverted stackable>
                                <Grid.Row>
                                    <Grid.Column width={3}>
                                        <Header inverted as='h4' content='About' />
                                        <List link inverted>
                                            <List.Item as='a'>Sitemap</List.Item>
                                            <List.Item as='a'>Contact Us</List.Item>

                                        </List>
                                    </Grid.Column>
                                    <Grid.Column width={3}>
                                        <Header inverted as='h4' content='Services' />
                                        <List link inverted>
                                            <List.Item as='a'>Banana Pre-Order</List.Item>
                                            <List.Item as='a'>DNA FAQ</List.Item>

                                        </List>
                                    </Grid.Column>
                                    <Grid.Column width={7}>
                                        <Header as='h4' inverted>Footer Header</Header>
                                        <p>Extra space for a call to action inside the footer that could help re-engage users.</p>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Container>
                    </Segment>

                </div>
            </div>
        )
    }
}
export default App;
