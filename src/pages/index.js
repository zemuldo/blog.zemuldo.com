import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Button, Visibility } from 'semantic-ui-react'
import { Helmet } from "react-helmet";
import axios from 'axios'
import util from '../util'
import Login from '../profile/loginForm'
import PagesComponent from '../pages/homePage'
import Footer from '../partials/footer'
import ReviewPortal from '../partials/portal'
import config from '../environments/conf'
import { pages } from '../environments/conf'
import { topicsOBJ } from '../environments/conf'
import MainMenu from "../menu/main";
import FixedMenu from "../menu/fixedMenu";
const env = config[process.env.NODE_ENV] || 'development';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 'ZemuldO-Home',
            loggedin: false,
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
            blogLoade: false,
            homePageLoaded: false,
            loadFooter: false,
            topic: 'all',
            visible: false,
            time: new Date().toDateString()
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
        this.navigateBlogs = this.navigateBlogs.bind(this)
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
        this.deletedBlog = this.deletedBlog.bind(this)
        this.handleMenuItemClickFooter = this.handleMenuItemClickFooter.bind(this)
        this.setTopic = this.setTopic.bind(this)
        this.hideFixedMenu = this.hideFixedMenu.bind(this)
        this.showFixedMenu = this.showFixedMenu.bind(this)
    };
    hideFixedMenu = () => this.setState({ visible: false })
    showFixedMenu = () => this.setState({ visible: true })
    setTopic(topic) {
        this.setState({ topic: topic })
    }
    deletedBlog() {
        this.setState({ blog: null })
        this.setHomeBlogs()
    }
    homePageIsLoading(value) {
        this.setState({ homePageLoaded: !value })
    }
    blogsAreLoading(state) {
        this.setState({ blogsLoaded: !state })
    }
    blogIsLoading(state) {
        this.setState({ blogLoaded: !state })
    }
    _handleChangeBodySize(size) {
        this.setState({ bodySize: size })
    }
    setTopicPosts(topicBlogs, topic) {
        if (topicBlogs[0]) {
            this.setState({ blogs: topicBlogs, topic: topic });
            this.blogsAreLoading(false)
        }
        else {
            this.setState({ blogs: [], topic: topic });
            this.blogsAreLoading(false)
        }
    }
    setTopicNextPosts(topicBlogs) {
        if (topicBlogs[0]) {
            this.setState({ blogs: topicBlogs });
            this.blogsAreLoading(false)
        }
        else {
            this.setState({ blogs: [] });
            this.blogsAreLoading(false)
        }
    }
    setBlogHere(id, page) {
        if (!pages[page]) {
            window.location = '/'
        }
        return axios.post(env.httpURL, {
            "queryMethod": "getPost",
            "queryData": {
                id: id
            }
        })
            .then(function (response) {
                if (!response.data) {
                    window.history.push('/' + page + '/all')
                    this.setState({ blog: null });
                    this.setState({ blogLoaded: true })
                    return false
                }
                if (response.data.error) {
                    window.history.push('/' + page + '/all')
                    this.setState({ blog: null });
                    this.setState({ blogLoaded: true })
                    window.scrollTo(0, 0)
                    return false
                }
                if (response.data.body) {
                    this.setState({ blog: response.data, richViewerState: response.data.body });
                    this.getBlogDetails(id);
                    window.scrollTo(0, 0)
                    return false

                }
                else {
                    window.history.push('/' + page + '/all')
                    this.setState({ blog: null });
                    this.setState({ blogLoaded: true })
                    window.scrollTo(0, 0)
                    return false
                }
            }.bind(this))
            .catch(function (err) {
                window.history.push('/' + page + '/all')
                this.setState({ blog: null });
                this.setState({ blogLoaded: true })
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
        this.setState({ blogsAreLoading: true })
        e.preventDefault();
        if (e.target.value === '') {
            return axios.post(env.httpURL, {
                "queryMethod": "getAllPosts",
                "queryData": {}
            })
                .then(response => {
                    this.setState({ blogs: response.data });
                    this.setState({ blogsAreLoading: false })
                })
                .catch(exception => {
                    this.setState({ blogsAreLoading: false })
                });
        }
        else {
            return axios.post(env.httpURL, {
                "queryMethod": "getFiltered",
                "queryData": {
                    "filter": e.target.value,
                }
            })
                .then(response => {
                    this.setState({ blogs: response.data });
                    this.setState({ blogsAreLoading: false })
                })
                .catch(exception => {
                    this.setState({ blogs: [] });
                    this.setState({ blogsAreLoading: false })
                });
        }
    }
    onReadMore(thisBlog) {
        window.scrollTo(0, 0);
        this.setState({ blogLoaded: false });
        return axios.post(env.httpURL, {
            "queryMethod": "getPost",
            "queryData": {
                "id": thisBlog.id
            }
        })
            .then(response => {
                let url = '/' + thisBlog.type + '/' + thisBlog.topics[0] + '/' + thisBlog.userName + '_' + thisBlog.title.split(' ').join('-') + '_' + thisBlog.date.split(' ').join('-') + '_' + thisBlog.id.toString()
                this.props.history.push(url)
                this.setState({ blog: response.data, blogDetails: thisBlog });
                this.setState({ blogLoaded: true, blog: response.data });
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
                    let o = response.data
                    this.props.history.push('/' + o.type + '/' + o.topics[0] + '/' + o.userName + '_' + o.title.split(' ').join('-') + '_' + o.date.split(' ').join('-') + '_' + o.id.toString())
                    this.setState({ blogDetails: response.data, isHome: false });
                    this.setState({ blogLoaded: true })
                    window.scrollTo(0, 0);
                }
            }
                .bind(this))
            .catch(function (err) {
                console.log(err)
                this.setState({ blogLoaded: true })
                return err
            }.bind(this));
    }
    navigateBlogs(query) {
        this.setState({ blogsLoaded: false })
        return axios.post(env.httpURL, {
            "queryMethod": "getPosts",
            "queryData": query
        })
            .then(function (response) {
                if (!response.data) {
                    this.setState({ blogs: [], blog: null, blogsLoaded: true, homePageLoaded: true });
                    return false
                }
                else {
                    this.setState({ blogs: response.data, blogsLoaded: true, homePageLoaded: true });
                }
            }.bind(this))
            .catch(function (err) {
                this.setState({ blogs: [], blog: null, blogsLoaded: true, homePageLoaded: true });
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
                    this.setState({ blogsLoaded: true, homePageLoaded: true })
                    this.setState({ blogsAreLoading: false })
                    return false
                }
                if (!response.data[0]) {
                    this.setState({ blogs: [], blog: null, blogDetails: null });
                    this.setState({ blogsLoaded: true, homePageLoaded: true })
                    this.setState({ blogsAreLoading: false })
                    return false
                }
                if (response.data[0]) {
                    this.setState({ blogsLoaded: true, homePageLoaded: true })
                    this.setState({ blogs: response.data });
                    this.setState({ blogsAreLoading: false })
                }
                else {
                    this.setState({ blogs: [], blog: null, blogDetails: null });
                    this.setState({ homePageLoaded: true })
                    this.setState({ blogs: [] });
                    this.setState({ blogsLoaded: true })
                    this.setState({ blogsAreLoading: false })
                }
            }.bind(this))
            .catch(function (err) {
                this.setState({ blogs: [], blog: null, blogDetails: null });
                this.setState({ homePageLoaded: true })
                this.setState({ blogs: [] });
                this.setState({ blogsLoaded: true })
                this.setState({ blogsAreLoading: false })
            }.bind(this))
    }
    setHomeBlogs() {
        this.setState({ blogsAreLoading: true })
        return axios.post(env.httpURL, {
            "queryMethod": "getAllPosts",
            "queryData": {
            }
        })
            .then(function (response) {
                this.setState({ loadFooter: true })
                if (!response.data) {
                    this.setState({ blogsLoaded: true, homePageLoaded: true })
                    this.setState({ blogsAreLoading: false })
                    return false
                }
                if (!response.data[0]) {
                    this.setState({ blogsLoaded: true, homePageLoaded: true })
                    this.setState({ blogsAreLoading: false })
                    return false
                }
                if (response.data[0]) {
                    this.setState({ blogs: response.data });
                    this.setState({ blogsLoaded: true, homePageLoaded: true })
                    this.setState({ blogsAreLoading: false })
                }
                else {
                    this.setState({ blogs: [] });
                    this.setState({ blogsLoaded: true, homePageLoaded: true })
                    this.setState({ blogsAreLoading: false })
                }
            }.bind(this))
            .catch(function (err) {
                this.setState({ loadFooter: true })
                this.setState({ blogs: [] });
                this.setState({ blogsLoaded: true, homePageLoaded: true })
                this.setState({ blogsAreLoading: false })
                this.setState({ loadFooter: true })
            }.bind(this))
    }
    handleNavigation(location) {
        window.scrollTo(0, 0);
        this.setState({ currentLocation: location })
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
    resize = () => this.forceUpdate()
    componentWillReceiveProps() {
        let query = {}
        let page = window.location.pathname.split('/')[1];
        let topic = window.location.pathname.split('/')[2];
        if (topicsOBJ[topic]) {
            query.topics = topic
        }
        if (pages[page] && pages[page].name !== 'Home') {
            query.type = page
            this.setState({ currentLocation: page })
        }
        this.navigateBlogs(query)
    }
    componentDidMount() {
        this.setState({ blogsLoaded: false })
        let url = window.location.pathname.split('/').join('');
        let page = window.location.pathname.split('/')[1];
        if (!pages[page]) {
            this.props.history.push('/')
        }
        let topic = window.location.pathname.split('/')[2];
        let query = {}
        if (topicsOBJ[topic]) {
            query.topics = topic
        }
        if (pages[page] && pages[page].name !== 'Home') {
            query.type = page;
            this.setState({ currentLocation: page })
        }
        this.navigateBlogs(query)
        this.setCurrentBlog(url, page);
        this.forceUpdate();
        if (window.innerWidth < 503) {
            this._handleChangeBodySize(16);
        }
        if (window.innerWidth > 503) {
            this._handleChangeBodySize(16);
        }

        window.addEventListener('resize', this.resize);
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
                this.setState({ user: user, loggedin: true })
                let urlCreator = window.URL || window.webkitURL;
                let imageUrl = urlCreator.createObjectURL(util.dataURItoBlob(JSON.parse(user.avatar).img));
                this.setState({ profilePic: imageUrl })
                this.setState({ homePageLoaded: true })
            }
            else {
                localStorage.removeItem('user');
            }
        }
        let location = window.location.pathname.slice(1, window.location.pathname.length)
        if (pages[location] && location === 'login') {
        }
        else if (pages[location] && location !== 'login') {
            this.setState({ currentLocation: location })
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
        this.setState({ blogsAreLoading: true })
        window.scrollTo(0, 0);
        this.setState({ currentLocation: 'home', blog: null })
    }
    handleMenuItemClick = (e, { name }) => {
        this.setState({ blogsAreLoading: true })
        if (name === 'search') {
            return
        }
        if (name === 'home' || name === 'login') {
            this.setState({ currentLocation: name, })
        }
        else {
            if (pages[name]) {
            }
            this.setState({ currentLocation: name, })
        }
    }
    handleMenuItemClickFooter = (name) => {
        this.setState({ blogsAreLoading: true })
        if (name === 'home' || name === 'login') {
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
        this.setState({ loggedin: true, currentLocation: 'home' })
        let urlCreator = window.URL || window.webkitURL;
        let imageUrl = urlCreator.createObjectURL(util.dataURItoBlob(JSON.parse(user.avatar).img));
        this.setState({ profilePic: imageUrl })
    }
    handleLoginButton = (e) => {
        this.setState({ currentLocation: 'login' })
    }
    handleLogoutinButton = () => {
        localStorage.removeItem('user')
        this.setState({ currentLocation: 'home', loggedin: false })
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
        this.props.history.push('/' + this.state.user.userName + '/' + this.state.user.id + '_session_' + new Date().toDateString())
        this.setState({ currentLocation: 'profile', createNew: false })
    }
    _goToEditor() {
        this.setState({ editingMode: true })
    }
    _exitEditMode() {
        this.setState({ editingMode: false, createNew: false })
    }
    render() {
        const NonFixedMenu = () => (
            <div className='cleanButton alignCenter marginTop2'>
                <Button color={this.state.colors[0]}>Development</Button>
                <Button color={this.state.colors[4]}>Technology</Button>
                <Button color={this.state.colors[3]}>Reviews</Button>
                <Button color={this.state.colors[2]}>Tutorials</Button>
                <Button color={this.state.colors[5]}>Trending</Button>
                <Button color={this.state.colors[1]}>Latest</Button>
                <Button color={this.state.colors[0]}>Futurist</Button>
            </div>
        )
        return (
            <div>
                <Helmet>
                    <meta name="theme-color" content="#4285f4" />
                    <meta name="msapplication-navbutton-color" content="#4285f4" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="#4285f4" />
                    <title>{'ZemuldO-' + util.toTitleCase(this.state.currentLocation)}</title>
                    <meta name="Danstan Otieno Onyango" content="ZemuldO-Home" />
                </Helmet>
                <div>
                    {this.state.visible && this.state.currentLocation !== 'login' ?
                        <FixedMenu
                            currentLocation={this.state.currentLocation}
                            showFixedMenu={this.showFixedMenu}
                            hideFixedMe={this.hideFixedMenu}
                            visible={this.state.visible}
                            colors={this.state.colors}
                            handleLoginButton={this.handleLoginButton}
                            handleLogoutinButton={this.handleLogoutinButton}
                            _handleSwitchToProfile={this._handleSwitchToProfile}
                            profilePic={this.state.profilePic}
                            _handleCreateNew={this._handleCreateNew}
                            loggedin={this.state.loggedin}
                            user={this.state.user}
                            handleFilterChange={this.handleFilterChange}
                            handleMenuItemClick={this.handleMenuItemClick}
                            handleHomeClick={this.handleHomeClick}
                            time={this.state.time}
                        /> : null}
                </div>
                <Visibility
                    onBottomPassed={this.showFixedMenu}
                    onBottomVisible={this.hideFixedMenu}
                    once={false}
                >
                    <MainMenu
                        currentLocation={this.state.currentLocation}
                        showFixedMenu={this.showFixedMenu}
                        hideFixedMe={this.hideFixedMenu}
                        visible={this.state.visible}
                        colors={this.state.colors}
                        handleLoginButton={this.handleLoginButton}
                        handleLogoutinButton={this.handleLogoutinButton}
                        _handleSwitchToProfile={this._handleSwitchToProfile}
                        profilePic={this.state.profilePic}
                        _handleCreateNew={this._handleCreateNew}
                        loggedin={this.state.loggedin}
                        user={this.state.user}
                        handleFilterChange={this.handleFilterChange}
                        handleMenuItemClick={this.handleMenuItemClick}
                        handleHomeClick={this.handleHomeClick}
                        time={this.state.time}
                    />
                </Visibility>
                {!this.state.visible && this.state.currentLocation !== 'login' ? <NonFixedMenu /> : null}
                <div style={{ marginTop: '3em' }}>
                    {
                        (this.state.currentLocation === 'login' || (this.state.currentLocation === 'profile')) ?
                            <Login
                                history={this.props.history}
                                handleLogoutinButton={this.handleLogoutinButton}
                                handleNavigation={this.handleNavigation}
                                user={this.state.user}
                                _exitEditMode={this._exitEditMode}
                                _goToEditor={this._goToEditor}
                                editingMode={this.state.editingMode}
                                createNew={this.state.createNew}
                                _handleCreateNew={this._handleCreateNew}
                                loggedin={this.state.loggedin}
                                successLogin={this.successLogin}
                                color={this.state.colors[0]}
                                colors={this.state.colors}
                            /> :
                            <PagesComponent
                                history={this.props.history}
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
                                setTopic={this.setTopic}
                                topic={this.state.topic}
                                user={this.state.user}
                            />
                    }
                </div>
                {
                    this.state.loadFooter && this.state.currentLocation !== 'login' ?
                        <Footer
                            colors={this.state.colors}
                            topic={this.state.topic}
                            handleMenuItemClickFooter={this.handleMenuItemClickFooter}
                            handleHomeClick={this.handleHomeClick}
                            color={this.state.colors[0]} corrent={this.state.current}
                        /> :
                        null
                }
                <ReviewPortal />
            </div>
        )
    }
}
export default App
