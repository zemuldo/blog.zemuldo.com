import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import {  Menu, Button,Icon,Header,Modal,List,Grid,Container,Segment} from 'semantic-ui-react'
import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'
class Footer extends Component {
    constructor(props){
        super(props);
        this.state = {
            cookieModalOpen:false,
            ulerModalaOpen:false
        };
    };
    handleCookieOpen = () => this.setState({ cookieModalOpen: true })
    handleCookieClose = () => this.setState({ cookieModalOpen: false })
    handleUlerOpen = () => this.setState({ ulerModalaOpen: true })
    handleUlerClose = () => this.setState({ ulerModalaOpen: false })
    render() {
        let urlDetails = 'all';
        return (
            <div>
                <Segment
                    vertical
                    style={{margin: '0em 0em 0em 0em', padding: '0em 0em 0em 0em' }}
                >
                    <Container textAlign='left'>
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
                                                <span style={{color:'black'}} color={this.props.color}>GitHub</span>
                                            </a>
                                        </List.Item>
                                        <List.Item >
                                            <a href="https://twitter.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                <Icon color='blue' name='twitter' />
                                                <span style={{color:'blue'}} color={this.props.color} >Twitter</span>
                                            </a>
                                        </List.Item>
                                        <List.Item>
                                            <a href="https://facebook.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                                <Icon color='blue' name='facebook' />
                                                <span style={{color:'blue'}} color={this.props.color}>FaceBook</span>
                                            </a>
                                        </List.Item>
                                    </List>
                                </Grid.Column>
                                <Grid.Column  width={3}>
                                    <Header color='green' as='h4' content='Quote of the day' />
                                    <p>Every complex System no matter how Complex is a combination of many smaller and simpler Systems and Units that operate together.</p>
                                </Grid.Column>
                                <Grid.Column width={3}>
                                    <Header color='green' inverted as='h4' content='Navigation' />
                                    <List link >
                                        <List.Item>
                                            <Link  to="/" onClick={()=>this.props.handleHomeClick()}>
                                                <Icon color='blue' name='home' />
                                                <span style={{color:this.props.colors[1]}} color={this.props.color}>Home Page</span>
                                            </Link>
                                        </List.Item>
                                        <List.Item>
                                            <Link to={"/tutorials/"+urlDetails} onClick={()=>this.props.handleMenuItemClickFooter('tuts')}>
                                                <Icon color='blue' name='code' />
                                                <span style={{color:this.props.colors[2]}} color={this.props.color}>Tutorials</span>
                                            </Link>
                                        </List.Item>
                                        <List.Item>
                                            <Link to={"/dev/"+urlDetails} onClick={()=>this.props.handleMenuItemClickFooter('dev')}>
                                                <Icon color='blue' name='code' />
                                                <span style={{color:this.props.colors[3]}} color={this.props.color}>Development</span>
                                            </Link>
                                        </List.Item>
                                        <List.Item>
                                            <Link to={"/tech/"+urlDetails} onClick={()=>this.props.handleMenuItemClickFooter('tech')}>
                                                <Icon color='blue' name='server' />
                                                <span style={{color:this.props.colors[0]}} color={this.props.color}>Tech Articles</span>
                                            </Link>
                                        </List.Item>
                                        <List.Item>
                                            <Link to={"/business/"+urlDetails}onClick={()=>this.props.handleMenuItemClickFooter('business')}>
                                                <Icon color='blue' name='book' />
                                                <span style={{color:this.props.colors[4]}} color={this.props.color}>Business Articles</span>
                                            </Link>
                                        </List.Item>
                                        <List.Item>
                                            <Link to={"/reviews/"+urlDetails} onClick={()=>this.props.handleMenuItemClickFooter('reviews')}>
                                                <Icon color='blue' name='star' />
                                                <span style={{color:this.props.colors[3]}} color={this.props.color}>Reviews</span>
                                            </Link>
                                        </List.Item>
                                        <List.Item>
                                            <Link to={"/about/"+urlDetails} onClick={()=>this.props.handleMenuItemClickFooter('about')}>
                                                <Icon color='blue' name='info' />
                                                <span style={{color:this.props.colors[0]}} color={this.props.color}>About</span>
                                            </Link>
                                        </List.Item>
                                        <List.Item>
                                            <a href="https://danstan.zemuldo.com" rel="noreferrer noopener" target="_blank">
                                                <Icon color='blue' name='user' />
                                                <span style={{color:this.props.colors[4]}} color={this.props.color}>The Creator</span>
                                            </a>
                                        </List.Item>
                                    </List>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <br/>
                        <hr color="green"/>
                        <br/>
                    </Container>
                    <div style={{textAlign:'center'}}>
                        <List horizontal  divided link>
                            <List.Item>
                                <a href={env.serverURL+'/sitemap.xml'} rel="noreferrer noopener" target="_blank">
                                    <Icon color={this.props.color} name='map' />
                                    <span style={{color:this.props.colors[3]}} color={this.props.color}>Site Map</span>
                                </a>
                            </List.Item>
                            <List.Item>
                                <a >
                                    <Icon color={this.props.color} name='phone' />
                                    <span style={{color:this.props.colors[0]}} color={this.props.color}>Contact</span>
                                </a>
                            </List.Item>
                            <List.Item>
                                <Modal
                                    trigger={
                                        <Menu.Item name='Cookie Policy' onClick={this.handleCookieOpen} >
                                            <Icon color={this.props.color} name='privacy' />
                                            <span style={{color:this.props.colors[5]}} color={this.props.color}>Cookie Policy</span>
                                        </Menu.Item>
                                    }
                                    open={this.state.cookieModalOpen}
                                    onClose={this.handleCookieClose}
                                    basic
                                    size='small'
                                >
                                    <Header icon='privacy' content='Cookies policy' />
                                    <Modal.Content>
                                        <h3>This website uses cookies to ensure the best user experience.</h3>
                                        <p>Cookies help you have better experience. The full Policy is here
                                            <a href="https://policy.zemuldo.com/cookie" rel="noreferrer noopener" target="_blank">
                                                <Icon color={this.props.color} name='privacy' />
                                                <span style={{color:this.props.colors[2]}} color={this.props.color}>Zemuldo.com Cookie Policy</span>
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
                                <Modal
                                    trigger={
                                        <Menu.Item name='Terms and Conditions' onClick={this.handleUlerOpen} >
                                            <Icon color={this.props.color} name='law' />
                                            <span style={{color:this.props.colors[3]}} color={this.props.color}>Terms and Conditions</span>
                                        </Menu.Item>
                                    }
                                    open={this.state.ulerModalaOpen}
                                    onClose={this.handleUlerClose}
                                    basic
                                    size='small'
                                >
                                    <Header icon='law' content='Terms and Conditions' />
                                    <Modal.Content>
                                        <h3>This application uses cookies to ensure the best user experience.</h3>
                                        <p>Cookies help you have better experience. The full Policy is here.
                                            <a href="https://policy.zemuldo.com/terms" rel="noreferrer noopener" target="_blank">
                                                <Icon color={this.props.color} name='law' />
                                                <span color={this.props.color}> Zemuldo.COM Terms and Conditions</span>
                                            </a>
                                        </p>
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button color={this.props.color} onClick={this.handleUlerClose} inverted>
                                            <Icon name='checkmark' /> OK
                                        </Button>
                                    </Modal.Actions>
                                </Modal>
                            </List.Item>
                            <List.Item>
                                <a href="https://danstan.zemuldo.com" rel="noreferrer noopener" target="_blank">
                                    <Icon color={this.props.color} name='copyright' />
                                    <span style={{color:this.props.colors[2]}} color={this.props.color}>CopyRight {" Zemuldo "+new Date().getFullYear()}</span>
                                </a>
                            </List.Item>
                        </List>
                    </div>
                    <br/>
                </Segment>
            </div>
        )
    }
}
export default Footer;
