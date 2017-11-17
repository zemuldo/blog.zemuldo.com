import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Menu, Button,Icon, Dropdown,Image} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {Helmet} from "react-helmet";
import axios from 'axios'
import GeoLocator from '../partials/geoLocator'
import config from '../environments/conf'

const env = config[process.env.NODE_ENV] || 'development'
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
const pages = {
    dev:{
        name:'Development',
        icon:'code',
        topTitle:"Dev articles"
    },
    tech:{
        name:'Technology',
        icon:'server',
        topTitle:" Featured in Technology"
    },
    business:{
        name:'Business',
        icon:'creative commons',
        topTitle:" Popular in Bsuness"
    },
    reviews:{
        name:'Reviews',
        icon:'circle notched'
    },
    tuts:{
        name:'Tutorials',
        icon:'code',
        topTitle:" Popular Tutorials"
    },
    home:{
        name:'Home',
        icon:'home'
    },
    profile:{
        name:'Profile',
        icon:'user circle'
    },
    login:{
        name:'Login',
        icon:'lock'
    }
}

class NavBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            current:'ZemuldO-Home',
            loggedin:false,
            user:null,
            iKnowYou:false,
            visitorInfo:null,
            geoAllowed:false,
            currentUserLocation:'name',
            createNew:false,
            editingMode:false,
            colors:['green','blue','orange','violet','blue'],
            currentLocation:'home',
            profilePic:null,
            blogs:[],
            blogsLoaded:false,
            blogIsLoading:true,
            blogsAreLoading:true,
            homePageIsLoading:true,
            blogDetails:null,
            richViewerState:null,
            pageText:'Most Popular',
            blogLoade:false,
            homePageLoaded:false
        };
    };
    render() {
        return (
            <div>
                <div>
                    <GeoLocator geoAllowed={this.state.geoAllowed}/>
                </div>
                <Helmet>
                    <title>{'ZemuldO-'+toTitleCase(this.state.currentLocation)}</title>
                    <meta name="Danstan Otieno Onyango" content="ZemuldO-Home" />
                </Helmet>
                <Menu
                    style={{backgroundColor:'white',opacity:'0.9',marginTop:'2px'}}
                    secondary={true}
                    fixed='top'
                    size='mini'
                    color={this.state.colors[0]}
                    borderless
                >
                    <Dropdown
                        style={{color:this.state.colors[0]}}
                        pointing='top'
                        item
                        text={(this.state.currentLocation==='home')?'Home':pages[this.state.currentLocation].name}
                    >
                        <Dropdown.Menu>
                            <Dropdown.Item
                                name='home'
                                active={this.state.currentLocation === 'home'}
                                onClick={this.handleHomeClick}>
                                <Icon color={this.state.colors[0]} name='home' />
                                <span color={this.state.colors[0]}><Link to="/">Home</Link></span>
                            </Dropdown.Item>
                            <Dropdown.Item
                                name='dev'
                                active={this.state.currentLocation === 'dev'}
                                onClick={this.handleMenuItemClick}>
                                <Icon color={this.state.colors[0]} name='code' />
                                <span color={this.state.colors[0]}><Link to="/dev">Dev</Link></span>
                            </Dropdown.Item>
                            <Dropdown.Item
                                name='business'
                                active={this.state.currentLocation === 'business'}
                                onClick={this.handleMenuItemClick}>
                                <Icon color={this.state.colors[0]} name='creative commons' />
                                <span color={this.state.colors[0]}><Link to="/business">Business</Link></span>
                            </Dropdown.Item>
                            <Dropdown.Item
                                name='tech'
                                active={this.state.currentLocation === 'tech'}
                                onClick={this.handleMenuItemClick}>
                                <Icon color={this.state.colors[0]} name='server' />
                                <span color={this.state.colors[0]}><Link to="/tech">Tech</Link></span>
                            </Dropdown.Item>
                            <Dropdown.Item
                                name='reviews'
                                active={this.state.currentLocation === 'use'}
                                onClick={this.handleMenuItemClick}>
                                <Icon color={this.state.colors[0]} name='circle notched' />
                                <span color={this.state.colors[0]}><Link to="/reviews">Reviews</Link></span>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    {
                        (!this.state.loggedin) ?
                            <Menu.Menu position='right'>
                                <Button
                                    circular={true}
                                    onClick={() => { this.handleLoginButton() }}
                                    color={this.state.colors[0]}  size='mini'><Link to="/login"><span style={{color:'black'}}>Login</span></Link>
                                </Button>
                            </Menu.Menu> :
                            <Menu.Menu position='right'>
                                <Dropdown
                                    trigger={<Image
                                        avatar={true}
                                        wrapped={true}
                                        id="photo"
                                        size='tiny'
                                        src={this.state.profilePic}
                                        style={{
                                            marginLeft:'50%',
                                            borderRadius: `${(Math.min(
                                                JSON.parse(this.state.user.avatar).height,
                                                JSON.parse(this.state.user.avatar).width
                                                ) +
                                                10) *
                                            (JSON.parse(this.state.user.avatar).borderRadius / 2 / 100)}px`
                                        }}
                                    />}
                                    style={{color:this.state.colors[0]}}
                                    pointing='top right'
                                    item
                                    icon={null}
                                >
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={this._handleSwitchToProfile}>
                                            <Icon color={this.state.colors[0]} name='user circle' />
                                            <span color={this.state.colors[1]} >Your Profile</span>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <Icon color={this.state.colors[0]} name='users' />
                                            <span color={this.state.colors[2]} >Followers</span>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <Icon color={this.state.colors[0]} name='help' />
                                            <span color={this.state.colors[0]} >Help</span>
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={this._handleCreateNew}>
                                            <Icon color={this.state.colors[0]} name='plus'  />
                                            <span color={this.state.colors[0]} >New Article</span>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <Icon color={this.state.colors[0]} name='setting' />
                                            <span color={this.state.colors[1]} >Settings</span>
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={this.handleLogoutinButton}>
                                            <Icon color={this.state.colors[0]} name='sign out' />
                                            <span color={this.state.colors[0]} ><Link to="/">Sign Out</Link></span>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Menu.Menu>

                    }
                </Menu>
            </div>
        )
    }
}
export default NavBar;