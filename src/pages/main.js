import React from 'react';
import { Helmet } from "react-helmet";
import {Link} from 'react-router-dom'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as BlogsActions from "../state/actions/blogs";
import * as UserActions from "../state/actions/user";
import * as VarsActions from "../state/actions/vars";
import axios from 'axios'
import util from '../util'
import PagesComponent from './page'
import config from '../environments/conf'
import { pages,topicsOBJ } from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            iKnowYou: false,
            visitorInfo: null,
            geoAllowed: false,
            createNew: false,
            editingMode: false,
            colors: ['green', 'blue', 'orange', 'violet', 'blue', 'orange'],
            currentLocation: 'home',
            profilePic: null,
            blogs: [],
            blogsLoaded: false,
            blogsAreLoading: true,
            homePageIsLoading: true,
            blogDetails: null,
            richViewerState: null,
            blogLoaded: false,
            homePageLoaded: false,
            loadFooter: false,
            topic: 'all',
            time: new Date().toDateString()
        };
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
        this.navigateBlogs = this.navigateBlogs.bind(this)
        this.getBlogDetails = this.getBlogDetails.bind(this)
        this.onReadMore = this.onReadMore.bind(this)
        this.setCurrentBlog = this.setCurrentBlog.bind(this)
        this.blogsAreLoading = this.blogsAreLoading.bind(this);
        this.homePageIsLoading = this.homePageIsLoading.bind(this);
        this.blogIsLoading = this.blogIsLoading.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.setTopicPosts = this.setTopicPosts.bind(this);
        this.setBlogHere = this.setBlogHere.bind(this);
        this.setTopicNextPosts = this.setTopicNextPosts.bind(this);
        this.deletedBlog = this.deletedBlog.bind(this)
        this.handleMenuItemClickFooter = this.handleMenuItemClickFooter.bind(this)
        this.setTopic = this.setTopic.bind(this)
        this.handleUpdateBlogs=this.handleUpdateBlogs.bind(this)
    };
    updateVars(vars){
        let newVars = this.props.vars;
        for(let i=0;i<vars.length;i++){
            newVars[vars[i].key]=vars[i].value
        }
        this.props.varsActions.updateVars(newVars);
    };
    handleUpdateBlogs(blogs){
        this.props.blogActions.updateBlogs(blogs)
    }
    setTopic(topic) {
        this.setState({ topic: topic })
    }
    deletedBlog() {
        this.setState({ blog: null });
        this.setHomeBlogs();
    }
    homePageIsLoading(value) {
        this.setState({ homePageLoaded: !value });
    }
    blogsAreLoading(state) {
        this.setState({ blogsLoaded: !state });
    }
    blogIsLoading(state) {
        this.setState({ blogLoaded: !state });
    }
    setTopicPosts(topicBlogs, topic) {
        if (topicBlogs[0]) {
            this.setState({ blogs: topicBlogs, topic: topic });
            this.blogsAreLoading(false);
        }
        else {
            this.setState({ blogs: [], topic: topic });
            this.blogsAreLoading(false);
        }
    }
    setTopicNextPosts(topicBlogs) {
        if (topicBlogs[0]) {
            this.setState({ blogs: topicBlogs });
            this.blogsAreLoading(false);
        }
        else {
            this.setState({ blogs: [] });
            this.blogsAreLoading(false)
        }
    }
    setBlogHere(id, page) {
        if (!pages[page]) {
            window.location = '/';
        }
        return axios.post(env.httpURL, {
            "queryMethod": "getPost",
            "queryData": {
                id: id
            }
        })
            .then(function (response) {
                if (!response.data) {
                    this.setState({ blog: null });
                    this.setState({ blogLoaded: true });
                    return false
                }
                if (response.data.error) {
                    this.setState({ blog: null });
                    this.setState({ blogLoaded: true });
                    return false
                }
                if (response.data.body) {
                    this.setState({ blog: response.data, richViewerState: response.data.body });
                    this.getBlogDetails(id);
                    return false

                }
                else {
                    this.setState({ blog: null });
                    this.setState({ blogLoaded: true });
                    return false
                }
            }.bind(this))
            .catch(function (err) {
                this.setState({ blog: null });
                this.setState({ blogLoaded: true });
                return err
            }.bind(this));
    }
    setCurrentBlog(url, page) {
        let id = null
        if (url.indexOf('-') > 0) {
            id = Number(url.split('_')[url.split('_').length - 1]);
        }
        else if (url.indexOf('%20') > 0) {
            id = Number(url.split('_')[url.split('_').length - 1]);
        }
        else if (url.indexOf('%2520') > 0) {
            id = Number(url.split('_')[url.split('_').length - 1]);
        }
        if (id && id.toString() !== 'NaN') {
            this.setBlogHere(id, page)
        }
        else {
            this.setState({ blog: null });
            this.setState({ blogLoaded: true })
        }
    }
    handleFilterChange(e) {
        let query={}
        let queryMthod = 'getAllPosts';
        if(this.state.currentLocation!=='home'){
            query.type=this.state.currentLocation
        }
        if(e.target.value !== ''){
            query.filter = e.target.value;
            queryMthod='getFiltered'
        }
        this.setState({ blogsAreLoading: true });
        e.preventDefault();
        axios.post(env.httpURL, {
            "queryMethod": queryMthod,
            "queryData": query
        })
            .then(response => {
                this.props.blogActions.updateBlogs(response.data);
                this.setState({ blogsAreLoading: false })
            })
            .catch(err => {
                this.setState({ blogs: [] });
                this.setState({ blogsAreLoading: false })
            });
    }
    onReadMore(thisBlog) {
        this.setState({ blogLoaded: false });
        axios.post(env.httpURL, {
            "queryMethod": "getPost",
            "queryData": {
                "id": thisBlog.id
            }
        })
            .then(response => {
                this.setState({ blog: response.data, blogDetails: thisBlog });
                this.setState({ blogLoaded: true, blog: response.data });
                window.scrollTo(0, 0);
            })
            .catch(function (err) {
                this.setState({ blog: null, blogDetails: thisBlog });
                this.setState({ blogLoaded: true });
                return err;
            }.bind(this))
    }
    getBlogDetails(id) {
        return axios.post(env.httpURL, {
            "queryMethod": "getPostDetails",
            "queryData": {
                "id": id
            }
        })
            .then(function (response) {
                if (response.data.error) {
                }
                else {
                    this.setState({ blogDetails: response.data });
                    this.setState({ blogLoaded: true })
                }
            }
                .bind(this))
            .catch(function (err) {
                this.setState({ blogLoaded: true });
                return err
            }.bind(this));
    }
    navigateBlogs(query) {
        this.setState({ blogsLoaded: false });
        return axios.post(env.httpURL, {
            "queryMethod": "getPosts",
            "queryData": query
        })
            .then(function (response) {
                if (!response.data) {
                    this.setState({ blogs: [], blog: null, blogsLoaded: true });
                    this.updateVars([{key:'homePageLoaded',value:true}])
                    return false
                }
                else {
                    this.handleUpdateBlogs(response.data)
                    this.setState({  blogsLoaded: true });
                }
                this.updateVars([{key:'homePageLoaded',value:true}])
            }.bind(this))
            .catch(function (err) {
                this.setState({ blogs: [], blog: null, blogsLoaded: true });
                this.updateVars([{key:'homePageLoaded',value:true}])
            }.bind(this))
    }
    setPageBlogs(name) {
        return axios.post(env.httpURL, {
            "queryMethod": "getPosts",
            "queryData": {
                "type": name
            }
        })
            .then(function (response) {
                if (!response.data) {
                    this.setState({ blogs: [], blog: null, blogDetails: null });
                    this.setState({ blogsLoaded: true});
                    this.setState({ blogsAreLoading: false })
                    return false
                }
                if (!response.data[0]) {
                    this.setState({ blogs: [], blog: null, blogDetails: null });
                    this.setState({ blogsLoaded: true });
                    this.setState({ blogsAreLoading: false })
                    return false
                }
                if (response.data[0]) {
                    this.handleUpdateBlogs(response.data)
                    this.setState({ blogsLoaded: true });
                    this.setState({ blogsAreLoading: false })
                }
                else {
                    this.setState({ blogs: [], blog: null, blogDetails: null });
                    this.setState({ homePageLoaded: true });
                    this.setState({ blogs: [] });
                    this.setState({ blogsLoaded: true });
                    this.setState({ blogsAreLoading: false })
                }
            }.bind(this))
            .catch(function (err) {
                this.setState({ blogs: [], blog: null, blogDetails: null });
                this.setState({ homePageLoaded: true });
                this.setState({ blogs: [] });
                this.setState({ blogsLoaded: true })
                this.setState({ blogsAreLoading: false })
            }.bind(this))
    }
    setHomeBlogs() {
        this.setState({ blogsAreLoading: true });
        return axios.post(env.httpURL, {
            "queryMethod": "getAllPosts",
            "queryData": {
            }
        })
            .then(function (response) {
                this.setState({ loadFooter: true });
                if (!response.data) {
                    this.setState({ blogsLoaded: true, homePageLoaded: true });
                    this.setState({ blogsAreLoading: false })
                    return false
                }
                if (!response.data[0]) {
                    this.setState({ blogsLoaded: true, homePageLoaded: true });
                    this.setState({ blogsAreLoading: false })
                    return false
                }
                if (response.data[0]) {
                    this.handleUpdateBlogs(response.data)
                    this.setState({ blogsLoaded: true, homePageLoaded: true });
                    this.setState({ blogsAreLoading: false })
                }
                else {
                    this.setState({ blogs: [] });
                    this.setState({ blogsLoaded: true, homePageLoaded: true });
                    this.setState({ blogsAreLoading: false })
                }
            }.bind(this))
            .catch(function (err) {
                this.setState({ loadFooter: true })
                this.setState({ blogs: [] });
                this.setState({ blogsLoaded: true, homePageLoaded: true });
                this.setState({ blogsAreLoading: false })
                this.setState({ loadFooter: true })
            }.bind(this))
    }
    handleNavigation(location) {
        window.scrollTo(0, 0);
        this.setState({ currentLocation: location });
        if (location === 'home') {
            this.props.history.push('/')
        } else {
            this.props.history.push('/' + location)
        }
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
        this.setState({ colors: array });
    }
    resize = () => this.forceUpdate();
    componentWillReceiveProps() {
        /*
           This method is used to detect navigation/actions from the user then update the UI.
           ie. Page navigation, Page crops etc
        */
        /*
            Build variables from the window pathname
        */
        let url = window.location.pathname.split('/');
        let id = Number(window.location.pathname.split('_')[window.location.pathname.split('_').length - 1]);
        let query = {}
        let page = window.location.pathname.split('/')[1];
        let topic = window.location.pathname.split('/')[2];

        if(url.length<4){
            this.setState({blog:null})
        }
        if (topicsOBJ[topic]) {
            query.topics = topic
        }
        if (pages[page] && page!=='home') {
            query.type = page
        }
        /*
            Navigate to home from page.
            User navigated to home but state current location is not home.
            Set current location to home and update blogs
        */
        if(page===''&& this.state.currentLocation!=='home'){
            this.navigateBlogs(query);
            this.setState({ currentLocation: 'home' })
        }
        /*
            Navigate to page from home
            User navigated to page but state current location is home.
            Set current location to page and update blogs
        */
        if(pages[page] && this.state.currentLocation==='home' && this.state.currentLocation!==page){
            this.setState({ currentLocation: page })
            this.navigateBlogs(query)
        }
        /*
            Navigate to another page from page
            User navigated to another page but state current location is page.
            Set current location to another page and update blogs
        */
        if (page!=='' && pages[page] && this.state.currentLocation!=='home' && page!==this.state.currentLocation ) {
            query.type = page
            this.setState({ currentLocation: page })
            if(!this.state.blogs[0] || this.state.blogs[0].type!==page){
                if(page!==this.state.currentLocation && page!==''){
                    this.navigateBlogs(query)
                }
            }
        }
        if(page===this.state.currentLocation && topic && topic!==this.state.topic){
            this.setState({ topic: topic })
            this.navigateBlogs(query)
        }
        if(id.toString()!=='NaN' && !this.state.blog){
            this.setBlogHere(id,page)
        }
        if(id.toString()!=='NaN' && this.state.blog && this.state.blog.id!==id){
            this.setBlogHere(id,page)
        }
    }
    componentDidMount() {
        /*
            Initialize state variables for loading.
        */
        this.setState({ blogsLoaded: false });

        /*
            Take state variable from url. currrent location, topic and blog
            And update blogs
        */
        let url = window.location.pathname.split('/').join('');
        let page = window.location.pathname.split('/')[1];
        let topic = window.location.pathname.split('/')[2];
        /*
            Redirect to home when unknown page is on url
        */
        if (!pages[page]) {
            this.props.history.push('/')
        }
        let query = {}
        if (topicsOBJ[topic]) {
            query.topics = topic
        }
        if (pages[page] && pages[page].name !== 'Home') {
            query.type = page;
            this.setState({ currentLocation: page })
        }
        /*
             update blogs and blog
        */
        this.navigateBlogs(query);
        this.setCurrentBlog(url, page);
        this.forceUpdate();
        if (window.innerWidth < 503) {
        }
        if (window.innerWidth > 503) {
        }

        window.addEventListener('resize', this.resize);
        /*
            Attempt Auto login
        */
        let known = localStorage.getItem('user');
        if (known) {
            let user = JSON.parse(known)
            if (typeof user.avatar !== 'string') {
                localStorage.removeItem('user');
                return false
            }
            if (user.firstName && user.lastName && user.userName) {
                if (page === 'login') {
                    this.props.history.push('/')
                }
                this.props.userActions.updateUser(user)
                let urlCreator = window.URL || window.webkitURL;
                let imageUrl = urlCreator.createObjectURL(util.dataURItoBlob(JSON.parse(user.avatar).img));
                this.updateVars([{key:'profilePic',value:imageUrl}])
                this.setState({ homePageLoaded: true })
            }
            else {
                localStorage.removeItem('user');
            }
        }
        if (pages[page] && page !== 'login' && page !== 'signup') {
            this.setState({ currentLocation: page })
        }
        this.shuffle()
        this.forceUpdate()
        window.addEventListener('resize', this.resize)
        this.setState({ loadFooter: true })
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }
    handleHomeClick = () => {
        this.navigateBlogs({})
        this.setState({ blogsAreLoading: true })
        window.scrollTo(0, 0);
        this.setState({ currentLocation: 'home', blog: null })
    }
    handleMenuItemClickFooter = (name) => {
        this.setState({ blogsAreLoading: true })
        if (name === 'home' || name === 'login' || name === 'signup') {
            this.setState({ currentLocation: name, })
        }
        else {
            if (pages[name]) {
            }
            this.setState({ currentLocation: name, })
        }
        window.scrollTo(0, 0);
    }
    successLogin = (user) => {
        this.setState({ user: user })
        localStorage.setItem('user', JSON.stringify(user))
        this.setState({ currentLocation: 'home' })
        let urlCreator = window.URL || window.webkitURL;
        let imageUrl = urlCreator.createObjectURL(util.dataURItoBlob(JSON.parse(user.avatar).img));
        this.props.history.push('/');
        this.updateVars([{key:'profilePic',value:imageUrl}])
    }
    _handleCreateNew = () => {
        let editorState = window.localStorage.getItem('draftContent')
        let blogData = window.localStorage.getItem('blogData')
        if (editorState && blogData) {
            this.setState({ editingMode: true })
        }
        this.setState({ createNew: true, currentLocation: 'profile' })
    }
    _handleSwitchToProfile = () => {
        this.setState({ currentLocation: 'profile', createNew: false })
    }
    _goToEditor() {
        this.setState({ editingMode: true })
    }
    _exitEditMode() {
        this.setState({ editingMode: false, createNew: false })
    }
    render() {
        return (
            <div>
                <Helmet>
                    <meta name="theme-color" content="#4285f4" />
                    <meta name="msapplication-navbutton-color" content="#4285f4" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="#4285f4" />
                    <title>{'ZemuldO-' + util.toTitleCase(this.state.currentLocation)}</title>
                    <meta name="Danstan Otieno Onyango" content="ZemuldO-Home" />
                </Helmet>
                <div style={{ marginTop: '5em' }}>
                    <div className='alignCenter'>
                        <h1>
                            <Link to ='/'>Zemuldo Articles </Link>
                        </h1>
                    </div>
                    <PagesComponent
                        history={this.props.history}
                        handleFilterChange={this.handleFilterChange}
                        color={this.state.colors[1]}
                        blogs={this.props.blogs}
                        blog={this.state.blog}
                        blogDetails={this.state.blogDetails}
                        blogsLoaded={this.state.blogsLoaded}
                        blogLoaded={this.state.blogLoaded}
                        richViewerState={this.state.richViewerState}
                        blogsAreLoading={this.blogsAreLoading}
                        onReadMore={this.onReadMore}
                        colors={this.state.colors}
                        currentLocation={this.state.currentLocation}
                        current={this.state.currentLocation}
                        setTopicPosts={this.setTopicPosts}
                        setTopicNextPosts={this.setTopicNextPosts}
                        deletedBlog={this.deletedBlog}
                        setTopic={this.setTopic}
                        topic={this.state.topic}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        blogs: state.blogs,
        user:state.user,
        vars:state.vars
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        blogActions: bindActionCreators(BlogsActions, dispatch),
        userActions:bindActionCreators(UserActions,dispatch),
        varsActions:bindActionCreators(VarsActions,dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
