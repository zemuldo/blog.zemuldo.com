import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Menu,Icon, Dropdown,Image,Input} from 'semantic-ui-react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom';
import * as VarsActions from "../state/actions/vars";
import * as UserActions from "../state/actions/user";
import * as BlogsActions from "../state/actions/blogs";
import {bindActionCreators} from "redux";
import {pages} from "../environments/conf";
import axios from "axios/index";
import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development';

class MobileMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        };
        this.handleFilterChange=this.handleFilterChange.bind(this)
    };
    updateVars(vars){
        let newVars = this.props.vars;
        for(let i=0;i<vars.length;i++){
            newVars[vars[i].key]=vars[i].value
        }
        this.props.varsActions.updateVars(newVars);
    };
    handleHomeClick = () => {
        let newVars = this.props.vars;
        newVars.blogsAreLoading=true;
        newVars.currentLocation='home';
        newVars.blog=null;
        this.props.varsActions.updateVars(newVars);
    };
    handleMenuItemClick = (e, { name }) => {
        if (name === 'search') {
            return false
        }
        let newVars = this.props.vars;
        newVars.blogsAreLoading=true;
        if (name === 'home' || name === 'login') {
            newVars.currentLocation=name;
        }
        else {
            if (pages[name]) {
            }
            newVars.currentLocation=name;
            this.props.varsActions.updateVars(newVars);
        }
    };
    handleLogoutinButton = () => {
        localStorage.removeItem('user');
        this.props.userActions.updateUser(null);
        this.updateVars([{key:'currentLocation',value:'home'}])
    };
    handleCreateNew = () => {
        let editorState = window.localStorage.getItem('draftContent')
        let blogData = window.localStorage.getItem('blogData')
        if (editorState && blogData) {
            this.updateVars([
                {key:'editingMode',value:true},
                {key:'createNew',value:true},
                {key:'currentLocation',value:'profile'}
            ])
        }
        else {
            this.updateVars([
                {key:'editingMode',value:false},
                {key:'createNew',value:true},
                {key:'currentLocation',value:'profile'}
            ])
        }
        console.log(this.props.vars.createNew)

    };
    handleProfile=()=>{
        this.updateVars([
            {key:'currentLocation',value:'profile'},
            {key:'createNew',value:false},
            {key:'editingMode',value:false}
        ])
        console.log(this.props.vars.createNew)
    };
    handleFilterChange(e) {
        let query={}
        let queryMthod = 'getAllPosts';
        if(this.props.vars.currentLocation!=='home'){
            query.type=this.state.currentLocation
        }
        if(e.target.value !== ''){
            query.filter = e.target.value;
            queryMthod='getFiltered'
        }
        this.updateVars([{key:'blogsAreLoading',value:true}])
        e.preventDefault();
        axios.post(env.httpURL, {
            "queryMethod": queryMthod,
            "queryData": query
        })
            .then(response => {
                this.props.blogsActions.updateBlogs(response.data);
                this.updateVars([{key:'blogsAreLoading',value:false}])
            })
            .catch(err => {
                this.props.blogsActions.updateBlogs([]);
                this.updateVars([{key:'blogsAreLoading',value:false}])
            });
    }
    render() {
        let urlDetails = 'all';
        return (
            <div >
                <Menu
                    style={{backgroundColor:'black'}}
                    fixed='top'
                    size='tiny'
                    secondary={true}
                    color={this.props.vars.colors[0]}
                    borderless
                >
                    <Dropdown
                        className='dropDown'
                        trigger={'MENU'}
                        style={{color:this.props.vars.colors[0]}}
                        pointing='top left'
                        item
                    >
                        <Dropdown.Menu>
                            <Dropdown.Item
                                as='span'
                                className=''
                                name='home'
                                active={this.props.vars.currentLocation === 'home'}
                                onClick={this.handleHomeClick}>
                                <Icon color={this.props.vars.colors[0]} name='home' />
                                <span color={this.props.vars.colors[0]}><Link to="/">Home</Link></span>
                            </Dropdown.Item>
                            <Dropdown.Item
                                as='span'
                                name='dev'
                                active={this.props.vars.currentLocation === 'dev'}
                                onClick={this.handleMenuItemClick}>
                                <Icon color={this.props.vars.colors[0]} name='code' />
                                <span color={this.props.vars.colors[0]}><Link to={"/dev/"+urlDetails}>Dev</Link></span>
                            </Dropdown.Item>
                            <Dropdown.Item
                                as='span'
                                name='business'
                                active={this.props.vars.currentLocation === 'business'}
                                onClick={this.handleMenuItemClick}>
                                <Icon color={this.props.vars.colors[0]} name='creative commons' />
                                <span color={this.props.vars.colors[0]}><Link to={"/business/"+urlDetails}>Business</Link></span>
                            </Dropdown.Item>
                            <Dropdown.Item
                                as='span'
                                name='tech'
                                active={this.props.vars.currentLocation === 'tech'}
                                onClick={this.handleMenuItemClick}>
                                <Icon color={this.props.vars.colors[0]} name='server' />
                                <span color={this.props.vars.colors[0]}><Link to={"/tech/"+urlDetails}>Tech</Link></span>
                            </Dropdown.Item>
                            <Dropdown.Item
                                as='span'
                                name='reviews'
                                active={this.props.vars.currentLocation === 'reviews'}
                                onClick={this.handleMenuItemClick}>
                                <Icon color={this.props.vars.colors[0]} name='circle notched' />
                                <span color={this.props.vars.colors[0]}><Link to={"/reviews/"+urlDetails}>Reviews</Link></span>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Menu.Menu position='right'>
                        <Menu.Item
                            name='search'
                            onClick={this.handleMenuItemClick}>
                            <Input
                                icon={<Icon name='search' inverted circular link />}
                                placeholder='Search...'
                                onChange={this.handleFilterChange}
                            />
                        </Menu.Item>
                        {
                            (!this.props.user) ?
                                <Menu.Item
                                    as='span'
                                    position='right'
                                    name='login'
                                    color={this.props.vars.colors[0]}
                                    onClick={() => { this.updateVars([{key:'currentLocation',value:'login'}]) }}>
                                    <Icon color={this.props.vars.colors[0]} name='unlock' />
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
                                            src={this.props.vars.profilePic}
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
                                        style={{color:this.props.vars.colors[0]}}
                                        pointing='top right'
                                        item
                                    >
                                        <Dropdown.Menu>
                                            <Dropdown.Item as='span' onClick={this.handleProfile}>
                                                <Icon color={this.props.vars.colors[0]} name='user circle' />
                                                <Link to={'/user/'+this.props.user.userName} color={this.props.vars.colors[1]} >Your Profile</Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item as='span'>
                                                <Icon color={this.props.vars.colors[0]} name='users' />
                                                <Link to={'/user/'+this.props.user.userName+'/followers'} color={this.props.vars.colors[2]} >Followers</Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item as='span'>
                                                <Icon color={this.props.vars.colors[0]} name='help' />
                                                <Link to={'/user/'+this.props.user.userName+'/help'} color={this.props.vars.colors[0]} >Help</Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item  as='span' onClick={this.handleCreateNew}>
                                                <Icon color={this.props.vars.colors[0]} name='plus'  />
                                                <Link to={'/user/'+this.props.user.userName+'/editor'} color={this.props.vars.colors[0]} >New Article</Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item as='span'>
                                                <Icon color={this.props.vars.colors[0]} name='setting' />
                                                <Link to={'/user/'+this.props.user.userName+'/settings'} color={this.props.vars.colors[1]} >Settings</Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item as='span' onClick={this.handleLogoutinButton}>
                                                <Icon color={this.props.vars.colors[0]} name='sign out' />
                                                <Link to={'/'} color={this.props.vars.colors[0]}>Sign Out</Link>
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
        user: state.user,
        vars:state.vars
    }
};
const mapDispatchToProps = (dispatch, props) => {
    return {
        userActions:bindActionCreators(UserActions,dispatch),
        varsActions:bindActionCreators(VarsActions,dispatch),
        blogsActions:bindActionCreators(BlogsActions,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)  (MobileMenu);