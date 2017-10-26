import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Menu, Button,Icon, Dropdown,Image} from 'semantic-ui-react'
import {Helmet} from "react-helmet";
import axios from 'axios'
import Login from './profile/loginForm'
import PagesComponent from './homePage/homePage'
import GeoLocator from './partials/geoLocator'
import Footer from './partials/footer'
import config from './environments/conf'
const env = config[process.env.NODE_ENV] || 'development'

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
function dataURItoBlob(dataURI, callback) {
    let byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    let bb = new Blob([ab]);
    return bb;
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
class App extends Component {
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
        this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
        this.handleLoginButton = this.handleLoginButton.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.handleHomeClick = this.handleHomeClick.bind(this);
        this.shuffle = this.shuffle.bind(this);
        this.successLogin = this.successLogin.bind(this);
        this._handleCreateNew = this._handleCreateNew.bind(this);
        this._handleSwitchToProfile = this._handleSwitchToProfile.bind(this);
        this._goToEditor = this._goToEditor.bind(this);
        this._exitEditMode = this._exitEditMode.bind(this);
        this.handleNavigation = this.handleNavigation.bind(this);
        this.setHomeBlogs = this.setHomeBlogs.bind(this);
        this.setPageBlogs = this.setPageBlogs.bind(this);
        this.getBlogDetails = this.getBlogDetails.bind(this)
        this.onReadMore = this.onReadMore.bind(this)
        this.setCurrentBlog = this.setCurrentBlog.bind(this)
        this.blogsAreLoading = this.blogsAreLoading.bind(this);
        this.homePageIsLoading = this.homePageIsLoading.bind(this);
        this.blogIsLoading = this.blogIsLoading.bind(this);
        this._handleChangeBodySize = this._handleChangeBodySize.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.setTopicPosts = this.setTopicPosts.bind(this);
        this.setBlogHere = this.setBlogHere.bind(this);
        this.setTopicNextPosts = this.setTopicNextPosts.bind(this);
        this.deletedBlog=this.deletedBlog.bind(this)
    };
    deletedBlog(){
        this.setState({blog:null})
    }
    homePageIsLoading(value){
        this.setState({homePageLoaded:!value})
    }
    blogsAreLoading(state){
        this.setState({blogsLoaded:!state})
    }
    blogIsLoading(state){
        this.setState({blogLoaded:!state})
    }
    _handleChangeBodySize(size){
        this.setState({bodySize:size})
    }
    setTopicPosts(topicBlogs,topic){
        if(topicBlogs[0]){
            this.setState({blogs:topicBlogs,topic:topic});
            this.blogsAreLoading(false)
        }
        else {
            this.setState({blogs:[],topic:topic});
            this.blogsAreLoading(false)
        }
    }
    setTopicNextPosts(topicBlogs){
        if(topicBlogs[0]){
            this.setState({blogs:topicBlogs});
            this.blogsAreLoading(false)
        }
        else {
            this.setState({blogs:[]});
            this.blogsAreLoading(false)
        }
    }
    setBlogHere(id){
        return axios.post(env.httpURL, {
            "queryMethod":"getPost",
            "queryData":{
                id:id
            }
        })
            .then(function (response) {
                if(!response.data){
                    this.setState({blog:null});
                    this.setState({blogLoaded:true})
                    return false
                }
                if(response.data.error){
                    this.setState({blog:null});
                    this.setState({blogLoaded:true})
                    window.scrollTo(0,0)
                    return false
                }
                if(response.data.body){
                    this.setState({blog:response.data,richViewerState:response.data.body});
                    this.getBlogDetails(id);
                    window.scrollTo(0,0)
                    return false

                }
                else {
                    this.setState({blog:null});
                    this.setState({blogLoaded:true})
                    window.scrollTo(0,0)
                    return false
                }
            }.bind(this))
            .catch(function (err) {
                this.setState({blog:null});
                this.setState({blogLoaded:true})
                return err
            }.bind(this));
    }
    setCurrentBlog(url){
        this.setState({blogLoaded:false})
        let id = null
        if(url.indexOf('-')>0){
            id = Number(url.split('_')[2]);
        }
        else if(url.indexOf('%20')>0){
            id = Number(url.split('_')[2]);
        }
        else if(url.indexOf('%2520')>0){
            id = Number(url.split('_')[2]);
        }
        if(id && id.toString()!=='NaN'){
            this.setBlogHere(id)
        }
        else{
            this.setState({blog:null});
            this.setState({blogLoaded:true})
        }
    }
    handleFilterChange(e) {
        this.setState({blogsAreLoading:true})
        e.preventDefault();
        if(e.target.value===''){
            return axios.post(env.httpURL, {
                "queryMethod":"getAllPosts",
                "queryData":{}
            })
                .then(response => {
                    this.setState({blogs:response.data});
                    this.setState({blogsAreLoading:false})
                })
                .catch(exception => {
                    this.setState({blogsAreLoading:false})
                });
        }
        else {
            return axios.post(env.httpURL, {
                "queryMethod":"getFiltered",
                "queryData":{
                    "filter":e.target.value,
                }
            })
                .then(response => {
                    this.setState({blogs:response.data});
                    this.setState({blogsAreLoading:false})
                })
                .catch(exception => {
                    this.setState({blogs:[]});
                    this.setState({blogsAreLoading:false})
                });
        }
    }
    onReadMore(thisBlog){
        window.scrollTo(0,0);
        this.setState({blogIsLoading:true,blogLoaded:false});
        return axios.post(env.httpURL, {
            "queryMethod":"getPost",
            "queryData":{
                "id":thisBlog.id
            }
        })
            .then(response => {
                this.setState({blog:response.data,blogDetails:thisBlog});
                this.setState({blogIsLoading:false,blog:response.data});
                this.setState({blogIsLoading:false,blogLoaded:true});
            })
            .catch(function (err) {
                this.setState({blog:null,blogDetails:thisBlog});
                this.setState({blogIsLoading:false,blogLoaded:true});
                return err;
            }.bind(this))

    }
    getBlogDetails(id){
        return axios.post(env.httpURL, {
            "queryMethod":"getPostDetails",
            "queryData":{
                "id":id
            }
        })
            .then(function (response) {
                if(response.data.error){
                }
                else {
                    this.setState({blogDetails:response.data,isHome:false});
                    this.setState({blogLoaded:true})
                    window.scrollTo(0,0);
                }

            }
                .bind(this))
            .catch(function (err) {
                console.log(err)
                this.setState({blogLoaded:true})
                return err
            }.bind(this));
    }
    setPageBlogs(name){
        return axios.post(env.httpURL, {
            "queryMethod":"getPosts",
            "queryData":{
                "type":name
            }
        })
            .then(function (response) {
                if(!response.data){
                    this.setState({blogs:[],blog:null,blogDetails:null});
                    this.setState({blogsLoaded:true,homePageLoaded:true})
                    this.setState({blogsAreLoading:false})
                    return false
                }
                if(!response.data[0]){
                    this.setState({blogs:[],blog:null,blogDetails:null});
                    this.setState({blogsLoaded:true,homePageLoaded:true})
                    this.setState({blogsAreLoading:false})
                    return false
                }
                if(response.data[0]){
                    this.setState({blogsLoaded:true,homePageLoaded:true})
                    this.setState({blogs:response.data});
                    this.setState({blogsAreLoading:false})
                    this.onReadMore(response.data[0])
                }
                else {
                    this.setState({blogs:[],blog:null,blogDetails:null});
                    this.setState({homePageLoaded:true})
                    this.setState({blogs:[]});
                    this.setState({blogsLoaded:true})
                    this.setState({blogsAreLoading:false})
                }
            }.bind(this))
            .catch(function (err) {
                this.setState({blogs:[],blog:null,blogDetails:null});
                this.setState({homePageLoaded:true})
                this.setState({blogs:[]});
                this.setState({blogsLoaded:true})
                this.setState({blogsAreLoading:false})
            }.bind(this))
    }
    setHomeBlogs(){
        return axios.post(env.httpURL, {
            "queryMethod":"getAllPosts",
            "queryData":{
            }
        })
            .then(function (response) {
                if(!response.data){
                    this.setState({blogsLoaded:true,homePageLoaded:true})
                    this.setState({blogsAreLoading:false})
                    return false
                }
                if(!response.data[0]){
                    this.setState({blogsLoaded:true,homePageLoaded:true})
                    this.setState({blogsAreLoading:false})
                    return false
                }
                if(response.data[0]){
                    this.setState({blogs:response.data});
                    this.setState({blogsLoaded:true,homePageLoaded:true})
                    this.setState({blogsAreLoading:false})
                }
                else {
                    this.setState({blogs:[]});
                    this.setState({blogsLoaded:true,homePageLoaded:true})
                    this.setState({blogsAreLoading:false})
                }
            }.bind(this))
            .catch(function (err) {
                this.setState({blogs:[]});
                this.setState({blogsLoaded:true,homePageLoaded:true})
                this.setState({blogsAreLoading:false})
            }.bind(this))
    }
    handleNavigation(location){
        window.scrollTo(0,0);
        this.setState({currentLocation:location})
    }
    shuffle() {
        let array = this.state.colors
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        this.setState({colors:array});
    }
    resize = () => this.forceUpdate()
    componentDidMount() {
        this.setState({blogsLoaded:false})
        this.blogIsLoading(true);
        let url = window.location.pathname.split('/').join('');
        this.setCurrentBlog(url);
        this.forceUpdate();
        if(window.innerWidth<503){
            this._handleChangeBodySize(16);
        }
        if(window.innerWidth>503){
            this._handleChangeBodySize(16);
        }

        window.addEventListener('resize', this.resize);
        this.setHomeBlogs()
        let known = localStorage.getItem('user');
        if(known){
            let user = JSON.parse(known)
            if(typeof user.avatar!=='string'){
                localStorage.removeItem('user');
                return false
            }
            if(user.firstName && user.lastName && user.userName){
                this.setState({user:user,loggedin:true})
                let urlCreator = window.URL || window.webkitURL;
                let imageUrl = urlCreator.createObjectURL( dataURItoBlob(JSON.parse(user.avatar).img));
                this.setState({profilePic:imageUrl})
                this.setState({blogLoaded:true,homePageLoaded:true})
            }
            else {
                localStorage.removeItem('user');
            }
        }
        let location = window.location.pathname.slice(1,window.location.pathname.length)
        if(pages[location] && location==='login'){
            window.location='/';
        }
        else if(pages[location] && location!=='login'){
            this.setState({currentLocation:location})
        }
        this.shuffle()
        this.forceUpdate()
        window.addEventListener('resize', this.resize)
        if(!this.state.iKnowYou){
            return axios.post(env.httpURL, {"queryMethod":"getIp"})
                .then(response => {
                    if(response.data.ip==='::1' || response.data.ip==='127.0.0.1'){
                        return{error:'user at localhost'}
                    }
                    else {
                        return axios.get('http://ip-api.com/json/'+response.data.ip, {})
                    }
                })
                .then(function (response) {
                    let knownUser = {userName:'hasNoAccount',id:0}
                    if(localStorage.getItem('user')){
                        let t = JSON.parse(localStorage.getItem('user'))
                        if(t.id){
                            knownUser = {
                                userName:t.userName,
                                id:t.id
                            }
                        }
                    }
                    let o = response.data;
                    if(!o.error){
                        let knownVisitor = localStorage.getItem('visitor')
                        if(knownVisitor){
                            let visitor = JSON.parse(localStorage.getItem('visitor'));
                            if(!visitor.sessionID){
                                localStorage.removeItem('visitor')
                                let visitorData = {};
                                visitorData.queryData = o;
                                visitorData.queryData.user = knownUser
                                visitorData.queryData.sessionID = o.countryCode+(o.lat+o.lon)+o.query+o.regionName;
                                visitorData.queryMethod = 'addVisitor';
                                console.log(visitorData);
                                return axios.post(env.httpURL, visitorData)
                            }
                            else {
                                let visitorData = {};
                                visitorData.queryData = o;
                                visitorData.queryData.user = knownUser
                                visitorData.queryData.sessionID = visitor.sessionID
                                visitorData.queryMethod = 'addVisitor';
                                visitorData.known = true;
                                console.log(visitorData);
                                return axios.post(env.httpURL, visitorData)
                            }

                        }
                        else {
                            let visitorData = {};
                            visitorData.queryData = o;
                            visitorData.queryData.user = knownUser
                            visitorData.queryData.sessionID = o.countryCode+(o.lat+o.lon)+o.query+o.regionName;
                            visitorData.queryMethod = 'addVisitor';
                            console.log(visitorData);
                            return axios.post(env.httpURL, visitorData)
                        }
                    }
                    else {
                        return{error:'user at localhost'}
                    }

                })
                .then(function (final) {
                    if(!final.error){
                        sessionStorage.setItem('visitor',JSON.stringify(final.data))
                        if(!localStorage.getItem('visitor')){
                            localStorage.setItem('visitor',JSON.stringify(final.data))
                        }
                    }
                })
                .catch(exception => {
                });
        }
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }
    handleHomeClick = () => {
        this.setState({blogsAreLoading:true})
        window.scrollTo(0,0);
        this.setHomeBlogs()
        this.setState({ currentLocation:'home',})
    }
    handleMenuItemClick = (e, { name }) => {
        this.setState({blogsAreLoading:true})
        if(name === 'home' || name ==='login'){
            this.setHomeBlogs()
            this.setState({ currentLocation:name,})
        }
        else {
            if(pages[name]){
                this.setPageBlogs(name)
            }
            this.setState({ currentLocation:name,})
        }
    }
    successLogin = (user)=>{
        this.setState({user:user})
        localStorage.setItem('user',JSON.stringify(user))
        this.setState({loggedin:true,currentLocation:'home'})
        let urlCreator = window.URL || window.webkitURL;
        let imageUrl = urlCreator.createObjectURL( dataURItoBlob(JSON.parse(user.avatar).img) );
        this.setState({profilePic:imageUrl})
    }
    handleLoginButton = (e)=>{
        this.setState({ currentLocation: 'login'})
    }
    handleLogoutinButton = ()=>{
        localStorage.removeItem('user')
        this.setState({ currentLocation: 'home' ,loggedin:false})
    }
    _handleCreateNew = () =>{
        let editorState = window.localStorage.getItem('draftContent')
        let blogData = window.localStorage.getItem('blogData')
        if(editorState && blogData){
            this.setState({editingMode:true})
        }
        this.setState({createNew:true,currentLocation:'profile'})
    }
    _handleSwitchToProfile = () =>{
        this.setState({currentLocation:'profile',createNew:false})
    }
    _goToEditor(){
        this.setState({editingMode:true})
    }
    _exitEditMode(){
        this.setState({editingMode:false,createNew:false})
    }
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
                                <span color={this.state.colors[0]}>HOME</span>
                            </Dropdown.Item>
                            <Dropdown.Item
                                name='dev'
                                active={this.state.currentLocation === 'dev'}
                                onClick={this.handleMenuItemClick}>
                                <Icon color={this.state.colors[0]} name='code' />
                                <span color={this.state.colors[0]}>Dev</span>
                            </Dropdown.Item>
                            <Dropdown.Item
                                name='business'
                                active={this.state.currentLocation === 'business'}
                                onClick={this.handleMenuItemClick}>
                                <Icon color={this.state.colors[0]} name='creative commons' />
                                <span color={this.state.colors[0]}>Business</span>
                            </Dropdown.Item>
                            <Dropdown.Item
                                name='tech'
                                active={this.state.currentLocation === 'tech'}
                                onClick={this.handleMenuItemClick}>
                                <Icon color={this.state.colors[0]} name='server' />
                                <span color={this.state.colors[0]}>Tech</span>
                            </Dropdown.Item>
                            <Dropdown.Item
                                name='reviews'
                                active={this.state.currentLocation === 'use'}
                                onClick={this.handleMenuItemClick}>
                                <Icon color={this.state.colors[0]} name='circle notched' />
                                <span color={this.state.colors[0]}>Reviews</span>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    {
                        (!this.state.loggedin) ?
                            <Menu.Menu position='right'>
                                <Button
                                    circular={true}
                                    onClick={() => { this.handleLoginButton() }}
                                    color={this.state.colors[0]}  size='mini'>Login
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
                                            <span color={this.state.colors[0]} >Sign Out</span>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Menu.Menu>

                    }
                </Menu>
                <div style={{marginTop:'3em'}}>
                    {
                        (this.state.currentLocation ==='login' || (this.state.currentLocation==='profile')) ?
                            <Login
                                handleLogoutinButton={this.handleLogoutinButton}
                                handleNavigation={this.handleNavigation}
                                user={this.state.user}
                                _exitEditMode={this._exitEditMode}
                                _goToEditor = {this._goToEditor}
                                editingMode={this.state.editingMode}
                                createNew = {this.state.createNew}
                                _handleCreateNew={this._handleCreateNew}
                                loggedin={this.state.loggedin}
                                successLogin={this.successLogin}
                                color={this.state.colors[0]}
                                colors={this.state.colors}
                            /> :
                            <PagesComponent
                                handleFilterChange={this.handleFilterChange}
                                color={this.state.colors[1]}
                                blogs={this.state.blogs}
                                blog={this.state.blog}
                                blogDetails={this.state.blogDetails}
                                blogsLoaded={this.state.blogsLoaded}
                                blogLoaded={this.state.blogLoaded}
                                homePageLoaded={this.state.homePageLoaded}
                                richViewerState={this.state.richViewerState}
                                blogsAreLoading={this.blogsAreLoading}
                                onReadMore={this.onReadMore}
                                colors={this.state.colors}
                                current={this.state.currentLocation}
                                setTopicPosts={this.setTopicPosts}
                                setTopicNextPosts={this.setTopicNextPosts}
                                deletedBlog={this.deletedBlog}
                            />

                    }
                </div>
                <Footer color={this.state.colors[0]} corrent={this.state.current}/>
            </div>
        )
    }
}
export default App;
