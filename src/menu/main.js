import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Menu,Icon, Dropdown,Input} from 'semantic-ui-react'
import {Link} from 'react-router-dom'

class MainMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
        };
    };
    render() {
        let urlDetails = 'all';
        return (

                <div>
                    <Menu
                        stackable={true}
                        className=''
                        size='tiny'
                        secondary={true}
                        color={this.props.colors[0]}
                        borderless
                    >
                        <Menu.Item
                            className=''
                            name='home'
                            active={this.props.currentLocation === 'home'}
                            onClick={this.props.handleHomeClick}>
                            <Icon color={this.props.colors[0]} name='home' />
                            <span color={this.props.colors[0]}><Link to="/">Home</Link></span>
                        </Menu.Item>
                        <Menu.Item
                            name='dev'
                            active={this.props.currentLocation === 'dev'}
                            onClick={this.props.handleMenuItemClick}>
                            <Icon color={this.props.colors[0]} name='code' />
                            <span color={this.props.colors[0]}><Link to={"/dev/"+urlDetails}>Dev</Link></span>
                        </Menu.Item>
                        <Menu.Item
                            name='business'
                            active={this.props.currentLocation === 'business'}
                            onClick={this.props.handleMenuItemClick}>
                            <Icon color={this.props.colors[0]} name='creative commons' />
                            <span color={this.props.colors[0]}><Link to={"/business/"+urlDetails}>Business</Link></span>
                        </Menu.Item>
                        <Menu.Item
                            name='tech'
                            active={this.props.currentLocation === 'tech'}
                            onClick={this.props.handleMenuItemClick}>
                            <Icon color={this.props.colors[0]} name='server' />
                            <span color={this.props.colors[0]}><Link to={"/tech/"+urlDetails}>Tech</Link></span>
                        </Menu.Item>
                        <Menu.Item
                            name='reviews'
                            active={this.props.currentLocation === 'reviews'}
                            onClick={this.props.handleMenuItemClick}>
                            <Icon color={this.props.colors[0]} name='circle notched' />
                            <span color={this.props.colors[0]}><Link to={"/reviews/"+urlDetails}>Reviews</Link></span>
                        </Menu.Item>
                        <Menu.Menu position='right'>
                            <Menu.Item
                                name='search'
                                onClick={this.props.handleMenuItemClick}>
                                <Input
                                    icon={<Icon name='search' inverted circular link />}
                                    placeholder='Search...'
                                    onChange={this.props.handleFilterChange}
                                />
                            </Menu.Item>
                            {
                                (!this.props.loggedin) ?
                                    <Menu.Item
                                        position='right'
                                        name='login'
                                        color={this.props.colors[0]}
                                        onClick={() => { this.props.handleLoginButton() }}>
                                        <Icon color={this.props.colors[0]} name='unlock' />
                                        <span style={{color:'black'}}><Link to="/login">Login</Link></span>
                                    </Menu.Item>:
                                    <Menu.Item>
                                        <Dropdown
                                            trigger={<span>{this.props.user.firstName+' '+this.props.user.lastName}</span>}
                                            style={{color:this.props.colors[0]}}
                                            pointing='top right'
                                            item
                                            icon={null}
                                        >
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={this.props._handleSwitchToProfile}>
                                                    <Icon color={this.props.colors[0]} name='user circle' />
                                                    <span color={this.props.colors[1]} >Your Profile</span>
                                                </Dropdown.Item>
                                                <Dropdown.Item>
                                                    <Icon color={this.props.colors[0]} name='users' />
                                                    <span color={this.props.colors[2]} >Followers</span>
                                                </Dropdown.Item>
                                                <Dropdown.Item>
                                                    <Icon color={this.props.colors[0]} name='help' />
                                                    <span color={this.props.colors[0]} >Help</span>
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={this.props._handleCreateNew}>
                                                    <Icon color={this.props.colors[0]} name='plus'  />
                                                    <span color={this.props.colors[0]} >New Article</span>
                                                </Dropdown.Item>
                                                <Dropdown.Item>
                                                    <Icon color={this.props.colors[0]} name='setting' />
                                                    <span color={this.props.colors[1]} >Settings</span>
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={this.props.handleLogoutinButton}>
                                                    <Icon color={this.props.colors[0]} name='sign out' />
                                                    <span color={this.props.colors[0]} ><Link to="/">Sign Out</Link></span>
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Menu.Item>
                            }
                        </Menu.Menu>
                    </Menu>
                </div>

        )
    }
}
export default  MainMenu
