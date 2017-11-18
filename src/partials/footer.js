import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import {  Menu, Button,Icon,Header,Modal,List,Grid,Divider,Container,Segment,Image} from 'semantic-ui-react'
import ReviewPortal from './portal'
import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'
class Footer extends Component {
    constructor(props){
        super(props);
        this.state = {
            modalOpen:false
        };
    };
    handleCookieOpen = () => this.setState({ modalOpen: true })

    handleCookieClose = () => this.setState({ modalOpen: false })
    render() {
        return (
            <div>
                <Segment
                    vertical
                    style={{margin: '0em 0em 0em 0em', padding: '0em 0em 0em 0em' }}
                >
                    <Container textAlign='center'>
                        <Grid divided stackable>
                            <Grid.Row>
                                <Grid.Column width={3}>

                                </Grid.Column>
                                <Grid.Column width={3}>
                                    <Header color='green' as='h4' content='Socila Profiles' />
                                    <List link>
                                        <List.Item>
                                            <a href="https://github.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                <Icon color='black' name='github' />
                                                <span color={this.props.color}>GitHub</span>
                                            </a>
                                        </List.Item>
                                        <List.Item >
                                            <a href="https://twitter.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                <Icon color='blue' name='twitter' />
                                                <span color={this.props.color} >Twitter</span>
                                            </a>
                                        </List.Item>
                                        <List.Item>
                                            <a href="https://facebook.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                <Icon color='blue' name='facebook' />
                                                <span color={this.props.color}>FaceBook</span>
                                            </a>
                                        </List.Item>
                                    </List>
                                </Grid.Column>
                                <Grid.Column width={3}>
                                    <Header color='green' inverted as='h4' content='Navigation' />
                                    <List link>
                                        <List.Item>
                                            <Link to="/" onClick={()=>this.props.handleHomeClick()}>
                                                <Icon color='blue' name='home' />
                                                <span color={this.props.color}>Home Page</span>
                                            </Link>
                                        </List.Item>
                                        <List.Item>
                                            <Link to="/tutorials" onClick={()=>this.props.handleMenuItemClickFooter('tuts')}>
                                                <Icon color='blue' name='code' />
                                                <span color={this.props.color}>Tutorials</span>
                                            </Link>
                                        </List.Item>
                                        <List.Item>
                                            <Link to="tech" onClick={()=>this.props.handleMenuItemClickFooter('tech')}>
                                                <Icon color='blue' name='server' />
                                                <span color={this.props.color}>Tech Articles</span>
                                            </Link>
                                        </List.Item>
                                        <List.Item>
                                            <Link to="/business" onClick={()=>this.props.handleMenuItemClickFooter('business')}>
                                                <Icon color='blue' name='book' />
                                                <span color={this.props.color}>Business Articles</span>
                                            </Link>
                                        </List.Item>
                                        <List.Item>
                                            <Link to="/reviews" onClick={()=>this.props.handleMenuItemClickFooter('reviews')}>
                                                <Icon color='blue' name='star' />
                                                <span color={this.props.color}>Reviews</span>
                                            </Link>
                                        </List.Item>
                                        <List.Item>
                                            <Link to="/about" onClick={()=>this.props.handleMenuItemClickFooter('about')}>
                                                <Icon color='blue' name='info' />
                                                <span color={this.props.color}>About</span>
                                            </Link>
                                        </List.Item>
                                        <List.Item>
                                            <a href="https://danstan.zemuldo.com" rel="noreferrer noopener" target="_blank">
                                                <Icon color='blue' name='user' />
                                                <span color={this.props.color}>The Creator</span>
                                            </a>
                                        </List.Item>
                                    </List>
                                </Grid.Column>
                                <Grid.Column width={3}>
                                    <Header color='green' as='h4' content='Quote of the day' />
                                    <p>Every complex System no matter how Complex is a combination of many smaller and simpler Systems and Units that operate together Synchronously</p>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <br/>
                        <hr color="green"/>
                        <br/>
                        <Image
                            centered
                            size='mini'
                            src='/logo.png'
                        />
                        <List horizontal  divided link>
                            <List.Item>
                                <a href={env.serverURL+'/sitemap.xml'} rel="noreferrer noopener" target="_blank">
                                    <Icon color={this.props.color} name='map' />
                                    <span color={this.props.color}>Site Map</span>
                                </a>
                            </List.Item>
                            <List.Item>
                                <a >
                                    <Icon color={this.props.color} name='phone' />
                                    <span color={this.props.color}>Contact</span>
                                </a>
                            </List.Item>
                            <List.Item>
                                <a href={env.serverURL+'/sitemap.xml'} rel="noreferrer noopener" target="_blank">
                                    <Icon color={this.props.color} name='law' />
                                    <span color={this.props.color}>Terms and Conditions</span>
                                </a>
                            </List.Item>
                            <List.Item>
                                <Modal
                                    trigger={
                                        <Menu.Item name='Cookie Policy' onClick={this.handleCookieOpen} >
                                            <Icon color={this.props.color} name='privacy' />
                                            <span color={this.props.color}>Cookie Policy</span>
                                        </Menu.Item>
                                    }
                                    open={this.state.modalOpen}
                                    onClose={this.handleCookieClose}
                                    basic
                                    size='small'
                                >
                                    <Header icon='browser' content='Cookies policy' />
                                    <Modal.Content>
                                        <h3>This website uses cookies to ensure the best user experience.</h3>
                                        <p>Cookies help you have better experience. The full Policy is here
                                            <a href="https://policy.zemuldo.com/cookie" rel="noreferrer noopener" target="_blank">
                                                <Icon color={this.props.color} name='privacy' />
                                                <span color={this.props.color}>Zemuldo.com Cookie Policy</span>
                                            </a>
                                        </p>
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button color={this.props.color} onClick={this.handleCookieClose} inverted>
                                            <Icon name='checkmark' /> OK
                                        </Button>
                                    </Modal.Actions>
                                </Modal>
                            </List.Item>
                            <List.Item>
                                <a href="https://danstan.zemuldo.com" rel="noreferrer noopener" target="_blank">
                                    <Icon color={this.props.color} name='copyright' />
                                    <span color={this.props.color}>CopyRight {" Zemuldo "+new Date().getFullYear()}</span>
                                </a>
                            </List.Item>
                        </List>
                    </Container>
                    <br/>
                </Segment>
                <ReviewPortal/>
            </div>
        )
    }
}
export default Footer;
