import React, { Component } from 'react';
import { Input, Menu, Button,Icon, Grid, Segment, List, Header, Divider, Container, Image} from 'semantic-ui-react'
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
    };
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
                </div>
                <div>
                    {
                        (this.state.current ==='login') ? <Login /> :
                        (this.state.current === 'Zemuldo Tech Blog and Articles') ? <HomePage /> :
                        (this.state.current === 'tech') ? <TechSummary /> :
                        (this.state.current === 'business') ? <BusinessSummary /> :
                        <HomePage />
                    }
                </div>
                <Segment
                    inverted
                    style={{ margin: '5em 0em 0em', padding: '5em 0em' }}
                    vertical
                >
                    <Container textAlign='center'>
                        <Grid columns={4} divided stackable inverted>
                            <Grid.Row>
                                <Grid.Column>
                                    <Header inverted as='h4' content='Group 1' />
                                    <List link inverted>
                                        <List.Item as='a'>Link One</List.Item>
                                        <List.Item as='a'>Link Two</List.Item>
                                        <List.Item as='a'>Link Three</List.Item>
                                        <List.Item as='a'>Link Four</List.Item>
                                    </List>
                                </Grid.Column>
                                <Grid.Column>
                                    <Header inverted as='h4' content='Group 2' />
                                    <List link inverted>
                                        <List.Item as='a'>Link One</List.Item>
                                        <List.Item as='a'>Link Two</List.Item>
                                        <List.Item as='a'>Link Three</List.Item>
                                        <List.Item as='a'>Link Four</List.Item>
                                    </List>
                                </Grid.Column>
                                <Grid.Column>
                                    <Header inverted as='h4' content='Group 3' />
                                    <List link inverted>
                                        <List.Item as='a'>Link One</List.Item>
                                        <List.Item as='a'>Link Two</List.Item>
                                        <List.Item as='a'>Link Three</List.Item>
                                        <List.Item as='a'>Link Four</List.Item>
                                    </List>
                                </Grid.Column>
                                <Grid.Column>
                                    <Header inverted as='h4' content='Footer Header' />
                                    <p>Extra space for a call to action inside the footer that could help re-engage users.</p>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <Divider inverted section />
                        <Image src='/logo.png' centered size='mini' />
                        <List horizontal inverted divided link>
                            <List.Item as='a' href='#'>Site Map</List.Item>
                            <List.Item as='a' href='#'>Contact Us</List.Item>
                            <List.Item as='a' href='#'>Terms and Conditions</List.Item>
                            <List.Item as='a' href='#'>Privacy Policy</List.Item>
                        </List>
                    </Container>
                </Segment>
            </div>
        )
    }
}
export default App;
