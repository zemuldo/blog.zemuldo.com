import React from 'react'
import {Helmet} from 'react-helmet'
import Topics from '../partials/topics'
import {Header, Button, Icon, Input, Container} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import Login from '../profile/login'
import About from '../pages/about'
import {bindActionCreators} from 'redux'
import * as BlogsActions from '../store/actions/blogs'
import * as BlogActions from '../store/actions/blog'
import * as UserActions from '../store/actions/user'
import * as VarsActions from '../store/actions/vars'
import axios from 'axios'
import {toTitleCase} from '../util'
import PagesComponent from './page'
import config, {topics} from '../env'
import {pages, topicsOBJ} from '../env'
import PropTypes from 'prop-types'

const env = config[process.env.NODE_ENV] || 'development'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sessionId: null,
            x: 0,
            location: '/',
            queryingBlog: false,
            y: ((window.innerWidth / 100) - 3) <= 1 ? 1 : (window.innerWidth / 100) - 3,
            window: window.innerWidth,
            topics: (window.innerWidth / 100) - 3
        }
        this.componentDidMount = this.componentDidMount.bind(this)
        this.componentWillUnmount = this.componentWillUnmount.bind(this)
        this.componentWillUnmount = this.componentWillUnmount.bind(this)
        this._handleCreateNew = this._handleCreateNew.bind(this)
        this._handleSwitchToProfile = this._handleSwitchToProfile.bind(this)
        this._goToEditor = this._goToEditor.bind(this)
        this._exitEditMode = this._exitEditMode.bind(this)
        this.navigateBlogs = this.navigateBlogs.bind(this)
        this.setCurrentBlog = this.setCurrentBlog.bind(this)
        this.blogsAreLoading = this.blogsAreLoading.bind(this)
        this.handleFilterChange = this.handleFilterChange.bind(this)
        this.setTopicPosts = this.setTopicPosts.bind(this)
        this.setBlogHere = this.setBlogHere.bind(this)
        this.setTopicNextPosts = this.setTopicNextPosts.bind(this)
        this.show_left = this.show_left.bind(this)
        this.show_right = this.show_right.bind(this)
    };

    blogsAreLoading(state) {
        this.setState({blogsLoaded: !state})
    }

    setTopicPosts(topicBlogs, topic) {
        if (topicBlogs[0]) {
            this.setState({blogs: topicBlogs, topic: topic})
            this.blogsAreLoading(false)
        } else {
            this.setState({blogs: [], topic: topic})
            this.blogsAreLoading(false)
        }
    }

    setTopicNextPosts(topicBlogs) {
        if (topicBlogs[0]) {
            this.setState({blogs: topicBlogs})
            this.blogsAreLoading(false)
        } else {
            this.setState({blogs: []})
            this.blogsAreLoading(false)
        }
    }

    setBlogHere(id, page) {
        this.props.varsActions.updateVars({blogLoaded: false})
        if (!pages[page]) {
            window.location = '/'
        }
        return Promise.all([
            axios.post(env.httpURL, {
                'queryMethod': 'getPost',
                'queryData': {
                    id: id
                }
            }), axios.post(env.httpURL, {
                'queryMethod': 'getPostDetails',
                'queryData': {
                    'id': id
                }
            })])
            .then(function (response) {
                if (!response[0] || !response[1] || response[0].data.error) {
                    this.props.history.push('/')
                    this.props.blogActions.updateBlog({id: null})
                    this.props.varsActions.updateVars({blogLoaded: true})
                    return false
                }
                let blog = response[0].data
                Object.assign(blog, response[1].data)
                this.props.blogActions.updateBlog(blog)
                this.props.varsActions.updateVars({blogLoaded: true})
            }.bind(this))
            .catch(function (err) {
                this.props.history.push('/')
                this.props.blogActions.updateBlog({})
                this.props.varsActions.updateVars({blogLoaded: true})
            }.bind(this))
    }

    setCurrentBlog(url, page) {
        let id = null
        if (url.indexOf('-') > 0) {
            id = Number(url.split('-')[url.split('-').length - 1])
        }
        if (id && id.toString() !== 'NaN') {
            this.setBlogHere(id, page)
        } else {
            this.props.blogActions.updateBlog({})
            this.props.varsActions.updateVars({blogLoaded: true})
        }
    }

    handleFilterChange(e) {
        let query = {}
        let queryMthod = 'getAllPosts'
        if (this.props.vars.currentLocation !== 'home') {
            query.type = this.props.vars.currentLocation
        }
        if (e.target.value !== '') {
            query.filter = e.target.value
            queryMthod = 'getFiltered'
        }

        let run = () => {

            this.setState({blogsAreLoading: true})
            e.preventDefault()
            axios.post(env.httpURL, {
                'queryMethod': queryMthod,
                'queryData': query
            })
                .then(response => {
                    this.props.blogsActions.updateBlogs(response.data)
                    this.setState({blogsAreLoading: false})
                })
                .catch(err => {
                    this.setState({blogs: []})
                    this.setState({blogsAreLoading: false})
                })
        }
        clearTimeout(run)
        setTimeout(run, 1500)
    }

    navigateBlogs(query) {
        this.props.varsActions.updateVars({blogsLoaded: false})
        return axios.post(env.httpURL, {
            'queryMethod': 'getPosts',
            'queryData': query
        })
            .then(function (response) {
                if (!response.data) {
                    this.props.blogsActions.updateBlogs([])
                    this.props.varsActions.updateVars({blogsLoaded: true})
                    return false
                } else {
                    this.props.blogsActions.updateBlogs(response.data)
                    this.props.varsActions.updateVars({blogsLoaded: true})
                }
                if (response.data.length < 1) {
                    if (!this.props.vars.wsFetchBlogDeatils) {
                        this.props.varsActions.updateVars({wsFetchBlogDeatils: true})
                        this.props.vars.ws.send(JSON.stringify({
                            type: 'topicDetails',
                            pups: 'topicDetails',
                            sessionId: sessionStorage.getItem('sessionId')
                        }))
                    }
                }
            }.bind(this))
            .catch(function (err) {
                this.props.blogsActions.updateBlogs([])
                if (!this.props.vars.wsFetchBlogDeatils) {
                    this.props.varsActions.updateVars({wsFetchBlogDeatils: true})
                    this.props.vars.ws.send(JSON.stringify({
                        type: 'topicDetails',
                        pups: 'topicDetails',
                        sessionId: sessionStorage.getItem('sessionId')
                    }))
                }
                this.props.varsActions.updateVars({blogsLoaded: true})
            }.bind(this))
    }

    resize = () => this.forceUpdate();

    componentWillUpdate() {
        if (this.state.window !== window.innerWidth) {
            this.setState({
                y: (window.innerWidth / 100) - 3,
                x: 0,
                window: window.innerWidth,
                topics: (window.innerWidth / 100) - 3
            })
        }
    }

    componentWillReceiveProps() {
       if(this.state.location !== window.location.pathname){
           /*
      This method is used to detect navigation/actions from the user then update the UI.
      ie. Page navigation, Page crops etc
   */
           /*
               Build variables from the window pathname
           */
           let url = window.location.pathname.split('/')
           let id = Number(window.location.pathname.split('-')[window.location.pathname.split('-').length - 1])
           let query = {}
           let page = window.location.pathname.split('/')[1]
           let topic = window.location.pathname.split('/')[2]

           if (url.length < 4) {
               this.setState({blog: null})
           }
           if (topicsOBJ[topic]) {
               query.topics = topic
           }
           if (pages[page] && page !== 'home' && page !== 'topics') {
               if (page !== 'topics') {
                   query.type = page
               }
           }
           /*
               Navigate to Page.
               User navigated to page from one URL TO ANOTHER.
               Set current location to page and update blogs
               Set current state location to this location
           */
           if (this.state.location !== window.location.pathname) {
               this.navigateBlogs(query)
               this.setState({location: window.location.pathname})
           }

           if (this.props.blog.id && this.props.vars.blogLoaded && (id.toString() === 'NaN' || !id)) {
               this.props.blogActions.resetBlog({id: null})
           }
           if (this.state.location !== window.location.pathname && page!==this.props.vars.currentLocation) {
               if (id.toString() !== 'NaN' && this.props.blog.id !== id && this.props.vars.blogLoaded === true) {
                   this.props.varsActions.updateVars({blogLoaded: false})
                   this.setBlogHere(id, page)
               }
           }
       }

    }

    componentDidMount() {
        import('../profile/login').then(Component => {
            this.Login = Component
            this.forceUpdate()
        })
        /*
            Take store variable from url. currrent location, topic and blog
            And update blogs
        */
        let url = window.location.pathname.split('/').join('')
        let page = window.location.pathname.split('/')[1]
        let topic = window.location.pathname.split('/')[2]
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
            if (page !== 'topics') {
                query.type = page
            }
            this.props.varsActions.updateVars({currentLocation: page})
        }
        /*
             update blogs and blog
        */
        this.navigateBlogs(query)
        this.setCurrentBlog(url, page)
        this.forceUpdate()
        if (window.innerWidth < 503) {
        }
        if (window.innerWidth > 503) {
        }

        window.addEventListener('resize', this.resize)
        /*
            Attempt Auto login
        */
        let known = localStorage.getItem('user')
        if (known) {
            let user = JSON.parse(known)
            if (typeof user.avatar === 'string') {
                localStorage.removeItem('user')
                return false
            }
            if (user.firstName && user.lastName && user.userName) {
                if (page === 'login') {
                    this.props.history.push('/')
                }
                this.props.userActions.updateUser(user)
            } else {
                localStorage.removeItem('user')
            }
        }
        if (pages[page] && page !== 'login' && page !== 'signup') {
            this.props.varsActions.updateVars({currentLocation: page})
        }
        this.forceUpdate()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }

    _handleCreateNew = () => {
        let editorState = window.localStorage.getItem('draftContent')
        let blogData = window.localStorage.getItem('blogData')
        if (editorState && blogData) {
            this.setState({editingMode: true})
        }
        this.setState({createNew: true, currentLocation: 'profile'})
    }
    _handleSwitchToProfile = () => {
        this.setState({currentLocation: 'profile', createNew: false})
    }

    _goToEditor() {
        this.setState({editingMode: true})
    }

    _exitEditMode() {
        this.setState({editingMode: false, createNew: false})
    }

    show_left = () => {
        this.setState({x: this.state.x === 0 ? 0 : this.state.x - 1, y: this.state.y === 6 ? 6 : this.state.y - 1})
    };

    show_right = () => {
        this.setState({
            x: this.state.y >= topics.length ? this.state.x : this.state.x + 1,
            y: this.state.y === topics.length ? topics.length - 1 : this.state.y + 1
        })
    };

    handleContextRef = tag_contextRef => this.setState({tag_contextRef})

    render() {
        let o = topics.slice(this.state.x, this.state.y)
        const {tag_contextRef} = this.state



        return (
            <div className='main_body' ref={this.handleContextRef}>
               <Container>
                   <Helmet>
                       <meta name='theme-color' content='#4285f4'/>
                       <meta name='msapplication-navbutton-color' content='#4285f4'/>
                       <meta name='apple-mobile-web-app-status-bar-style' content='#4285f4'/>
                       <title>{'ZemuldO-' + toTitleCase(this.props.vars.currentLocation)}</title>
                       <meta name='Danstan Otieno Onyango' content='ZemuldO-Home'/>
                   </Helmet>

                   <Topics
                       currentLocation={this.props.vars.currentLocation}
                       topic={this.state.topic}
                       onTopicClick={this.onTopicClick}
                       onAllcClick={this.onAllcClick}
                       setTopicNextPosts={this.props.setTopicNextPosts}
                       blog={this.props.blog}
                       color={this.props.vars.color}
                       blogs={this.props.blogs}
                       resetNav={this.resetNav}
                   />
                   <br/>
                   <PagesComponent
                       tag_contextRef={tag_contextRef}
                       history={this.props.history}
                       navigateBlogs={this.navigateBlogs}
                       handleFilterChange={this.handleFilterChange}
                       blogsAreLoading={this.blogsAreLoading}
                       setTopicNextPosts={this.setTopicNextPosts}
                   />
               </Container>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        blog: state.blog,
        blogs: state.blogs,
        user: state.user,
        vars: state.vars
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        blogActions: bindActionCreators(BlogActions, dispatch),
        blogsActions: bindActionCreators(BlogsActions, dispatch),
        userActions: bindActionCreators(UserActions, dispatch),
        varsActions: bindActionCreators(VarsActions, dispatch)
    }
}

App.propTypes = {
    history: PropTypes.object.isRequired,
    blog: PropTypes.object.isRequired,
    blogs: PropTypes.array.isRequired,
    vars: PropTypes.object.isRequired,
    varsActions: PropTypes.object.isRequired,
    blogActions: PropTypes.object.isRequired,
    blogsActions: PropTypes.object.isRequired,
    userActions: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
