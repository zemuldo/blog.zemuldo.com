import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Menu,Icon, Dropdown,Image} from 'semantic-ui-react'
import {connect} from 'react-redux';
import { bindActionCreators } from "redux";
import {Link} from 'react-router-dom'
import * as BlogsActions from "../state/actions/blogs";
import * as UserActions from "../state/actions/user";

class FixedMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
        };
    };
    render() {
        let urlDetails = 'all';
        return (
            <div >
                <Menu
                    style={{backgroundColor:'black'}}
                    fixed='top'
                    size='tiny'
                    secondary={true}
                    color={this.props.colors[0]}
                    borderless
                >
                    <Dropdown
                        className='dropDown'
                        trigger={'MENU'}
                        style={{color:this.props.colors[0]}}
                        pointing='top left'
                        item
                    >
                        <Dropdown.Menu>
                            <Dropdown.Item
                                as='span'
                                className=''
                                name='home'
                                active={this.props.currentLocation === 'home'}
                                onClick={this.props.handleHomeClick}>
                                <Icon color={this.props.colors[0]} name='home' />
                                <Link to="/">Home</Link>
                            </Dropdown.Item>
                            <Dropdown.Item
                                as='span'
                                name='business'
                                active={this.props.currentLocation === 'business'}
                                onClick={this.props.handleMenuItemClick}>
                                <Icon color={this.props.colors[0]} name='creative commons' />
                                <Link to={"/business/"+urlDetails}>Business</Link>
                            </Dropdown.Item>
                            <Dropdown.Item
                                as='span'
                                name='dev'
                                active={this.props.currentLocation === 'dev'}
                                onClick={this.props.handleMenuItemClick}>
                                <Icon color={this.props.colors[0]} name='code' />
                                <Link to={"/dev/"+urlDetails}>Dev</Link>
                            </Dropdown.Item>
                            <Dropdown.Item
                                as='span'
                                name='tech'
                                active={this.props.currentLocation === 'tech'}
                                onClick={this.props.handleMenuItemClick}>
                                <Icon color={this.props.colors[0]} name='server' />
                                <Link to={"/tech/"+urlDetails}>Tech</Link>
                            </Dropdown.Item>
                            <Dropdown.Item
                                as='span'
                                name='reviews'
                                active={this.props.currentLocation === 'reviews'}
                                onClick={this.props.handleMenuItemClick}>
                                <Icon color={this.props.colors[0]} name='star' />
                                <Link to={"/reviews/"+urlDetails}>Reviews</Link>
                            </Dropdown.Item>
                            <Dropdown.Item
                                as='span'
                                name='tutorials'
                                active={this.props.currentLocation === 'tutorials'}
                                onClick={this.props.handleMenuItemClick}>
                                <Icon color={this.props.colors[0]} name='code' />
                                <Link to={"/tutorials/"+urlDetails}>Tutorials</Link>
                            </Dropdown.Item>
                            <Dropdown.Item
                                as='span'
                                name='about'
                                active={this.props.currentLocation === 'about'}
                                onClick={this.props.handleMenuItemClick}>
                                <Icon color={this.props.colors[0]} name='info' />
                                <Link to={"/about"}>About</Link>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Menu.Menu position='right'>
                        {
                            (!this.props.user) ?
                                <Menu.Item
                                    as='span'
                                    position='right'
                                    name='login'
                                    color={this.props.colors[0]}
                                    onClick={() => { this.props.handleLoginButton() }}>
                                    <Icon color={this.props.colors[0]} name='unlock' />
                                    <span style={{color:'black'}}><Link to="/login">Login</Link></span>
                                </Menu.Item>:
                                <Menu.Item>
                                    <Dropdown
                                        className='dropDown'
                                        trigger={<Image
                                            avatar={true}
                                            wrapped={true}
                                            id="photo"
                                            size='tiny'
                                            src={this.props.profilePic}
                                            style={{
                                                marginLeft:'50%',
                                                borderRadius: `${(Math.min(
                                                    JSON.parse(this.props.user.avatar).height,
                                                    JSON.parse(this.props.user.avatar).width
                                                    ) +
                                                    10) *
                                                (JSON.parse(this.props.user.avatar).borderRadius / 2 / 100)}px`
                                            }}
                                        />}
                                        style={{color:this.props.colors[0]}}
                                        pointing='top right'
                                        item
                                    >
                                        <Dropdown.Menu>
                                            <Dropdown.Item as='span' onClick={this.props._handleSwitchToProfile}>
                                                <Icon color={this.props.colors[0]} name='user circle' />
                                                <Link to={'/'+this.props.user.userName+'/profile-'+this.props.time.split(' ').join('-')} color={this.props.colors[1]} >Your Profile</Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item as='span'>
                                                <Icon color={this.props.colors[0]} name='users' />
                                                <Link to={'/'+this.props.user.userName+'/followers'} color={this.props.colors[2]} >Followers</Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item as='span'>
                                                <Icon color={this.props.colors[0]} name='help' />
                                                <Link to={'/'+this.props.user.userName+'/help'} color={this.props.colors[0]} >Help</Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item  as='span' onClick={this.props._handleCreateNew}>
                                                <Icon color={this.props.colors[0]} name='plus'  />
                                                <Link to={'/'+this.props.user.userName+'/editor'} color={this.props.colors[0]} >New Article</Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item as='span'>
                                                <Icon color={this.props.colors[0]} name='setting' />
                                                <Link to={'/'+this.props.user.userName+'/settings'} color={this.props.colors[1]} >Settings</Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item as='span' onClick={this.props.handleLogoutinButton}>
                                                <Icon color={this.props.colors[0]} name='sign out' />
                                                <Link to={'/'} color={this.props.colors[0]}>Sign Out</Link>
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
const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};
const mapDispatchToProps = (dispatch, props) => {
    return {
        userActions:bindActionCreators(UserActions,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)  (FixedMenu);
