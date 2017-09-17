import React, { Component } from 'react';
import {  Menu, Button,Icon,Header,Modal} from 'semantic-ui-react'
import ReviewPortal from '../mixins/portal'

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
                {
                    (window.innerWidth>800) ?
                        <Menu compact={true} style={{position: 'fixed',bottom: '0%',right: '20%'}} fixed='bottom' pointing size='tiny' color="green" borderless>
                            <Menu.Item  name='ZemuldO-Home' active={this.props.current === 'ZemuldO-Home'} onClick={this.handleHomeClick}>
                                <a href="/" rel="noreferrer noopener">
                                    <Icon color='green' name='home' />
                                    <span color='green'>Home</span>
                                </a>
                            </Menu.Item>
                            <Menu.Item name='copyright' onClick={this.handleMenuItemClick}>
                                <a href="https://danstan.zemuldo.com" rel="noreferrer noopener" target="_blank">
                                    <Icon color='green' name='copyright' />
                                    <span color='green'>CopyRight {" "+new Date().getFullYear()}</span>
                                </a>

                            </Menu.Item>
                            <Modal
                                trigger={
                                    <Menu.Item name='Cookie Policy' onClick={this.handleCookieOpen} >
                                        <Icon color='green' name='privacy' />
                                        <span color='green'>Cookie Policy</span>
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
                                            <Icon color='green' name='privacy' />
                                            <span color='green'>Zemuldo.com Cookie Policy</span>
                                        </a>
                                    </p>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button color='green' onClick={this.handleCookieClose} inverted>
                                        <Icon name='checkmark' /> OK
                                    </Button>
                                </Modal.Actions>
                            </Modal>
                            <Menu.Item name='github' onClick={this.handleMenuItemClick}>
                                <a href="https://github.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                    <Icon color='green' name='github' />
                                    <span color='green'>GitHub</span>
                                </a>
                            </Menu.Item>
                            <Menu.Item name='twitter' onClick={this.handleMenuItemClick}>
                                <a href="https://twitter.com/zemuldo" rel="noreferrer noopener" target="_blank">
                                    <Icon color='green' name='twitter' />
                                    <span color='green' >Twitter</span>
                                </a>
                            </Menu.Item>
                            <ReviewPortal/>
                        </Menu>
                        :
                        <Menu style={{margin:'0em 30em 0em 30em'}} fixed='bottom' pointing size='tiny' color="green" borderless>
                            <Menu.Item  name='ZemuldO-Home' active={this.props.current === 'ZemuldO-Home'} onClick={this.handleHomeClick}>
                                <a href="/" rel="noreferrer noopener">
                                    <Icon color='green' name='home' />
                                    <span color='green'>Home</span>
                                </a>
                            </Menu.Item>
                            <Menu.Item name='copyright' onClick={this.handleMenuItemClick}>
                                <a href="https://danstan.zemuldo.com" rel="noreferrer noopener" target="_blank">
                                    <Icon color='green' name='copyright' />
                                    <span color='green'>CopyRight {" "+new Date().getFullYear()}</span>
                                </a>

                            </Menu.Item>
                        </Menu>

                }
            </div>
        )
    }
}
export default Footer;
