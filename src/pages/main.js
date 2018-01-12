import React from 'react'
import {Helmet} from 'react-helmet'
import {Header, Button, Icon, Input} from 'semantic-ui-react'
import _ from 'lodash'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as BlogsActions from '../state/actions/blogs'
import * as BlogActions from '../state/actions/blog'
import * as UserActions from '../state/actions/user'
import * as VarsActions from '../state/actions/vars'
import axios from 'axios'
import util from '../util'
import PagesComponent from './page'
import config, {topics} from '../environments/conf'
import {pages, topicsOBJ} from '../environments/conf'
import PropTypes from 'prop-types'

const env = config[process.env.NODE_ENV] || 'development'

class App extends React.Component {
   constructor(props) {
      super(props)
      this.state = {
         sessionId: null,
         x: 0,
         y: (window.innerWidth / 100) - 3,
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
      this.setHomeBlogs = this.setHomeBlogs.bind(this)
      this.navigateBlogs = this.navigateBlogs.bind(this)
      this.onReadMore = this.onReadMore.bind(this)
      this.setCurrentBlog = this.setCurrentBlog.bind(this)
      this.blogsAreLoading = this.blogsAreLoading.bind(this)
      this.handleFilterChange = this.handleFilterChange.bind(this)
      this.setTopicPosts = this.setTopicPosts.bind(this)
      this.setBlogHere = this.setBlogHere.bind(this)
      this.setTopicNextPosts = this.setTopicNextPosts.bind(this)
      this.deletedBlog = this.deletedBlog.bind(this)
      this.setTopic = this.setTopic.bind(this)
      this.handleUpdateBlogs = this.handleUpdateBlogs.bind(this)
      this.show_left = this.show_left.bind(this)
      this.show_right = this.show_right.bind(this)
   };

   handleUpdateBlogs(blogs) {
      this.props.blogsActions.updateBlogs(blogs)
   }

   setTopic(topic) {
      this.setState({topic: topic})
   }

   deletedBlog() {
      this.setState({blog: null})
      this.setHomeBlogs()
   }

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
             let blog = response[0].data
             Object.assign(blog, response[1].data)
             this.props.blogActions.updateBlog(blog)
             this.props.varsActions.updateVars({blogLoaded: true})
          }.bind(this))
          .catch(function (err) {
             this.props.blogActions.updateBlog({})
             this.props.varsActions.updateVars({blogLoaded: true})
          }.bind(this))
   }

   setCurrentBlog(url, page) {
      let id = null
      if (url.indexOf('-') > 0) {
         id = Number(url.split('_')[url.split('_').length - 1])
      } else if (url.indexOf('%20') > 0) {
         id = Number(url.split('_')[url.split('_').length - 1])
      } else if (url.indexOf('%2520') > 0) {
         id = Number(url.split('_')[url.split('_').length - 1])
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

   onReadMore(thisBlog) {
      this.props.varsActions.updateVars({blogLoaded: false})
      axios.post(env.httpURL, {
         'queryMethod': 'getPost',
         'queryData': {
            'id': thisBlog.id
         }
      })
          .then(response => {
             let blog = response.data
             Object.assign(blog, thisBlog)
             this.props.blogActions.updateBlog(blog)
             this.props.varsActions.updateVars({blogLoaded: true})
             window.scrollTo(0, 0)
          })
          .catch(function (err) {
             this.props.blogActions.updateBlog({})
             this.props.varsActions.updateVars({blogLoaded: true})
             return err
          }.bind(this))
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

   setHomeBlogs() {
      this.setState({blogsAreLoading: true})
      return axios.post(env.httpURL, {
         'queryMethod': 'getAllPosts',
         'queryData': {}
      })
          .then(function (response) {
             this.setState({loadFooter: true})
             if (!response.data) {
                this.setState({blogsLoaded: true, homePageLoaded: true})
                this.setState({blogsAreLoading: false})
                return false
             }
             if (!response.data[0]) {
                this.setState({blogsLoaded: true, homePageLoaded: true})
                this.setState({blogsAreLoading: false})
                return false
             }
             if (response.data[0]) {
                this.handleUpdateBlogs(response.data)
                this.setState({blogsLoaded: true, homePageLoaded: true})
                this.setState({blogsAreLoading: false})
             } else {
                this.setState({blogs: []})
                this.setState({blogsLoaded: true, homePageLoaded: true})
                this.setState({blogsAreLoading: false})
             }
          }.bind(this))
          .catch(function (err) {
             this.setState({loadFooter: true})
             this.setState({blogs: []})
             this.setState({blogsLoaded: true, homePageLoaded: true})
             this.setState({blogsAreLoading: false})
             this.setState({loadFooter: true})
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
      /*
         This method is used to detect navigation/actions from the user then update the UI.
         ie. Page navigation, Page crops etc
      */
      /*
          Build variables from the window pathname
      */
      let url = window.location.pathname.split('/')
      let id = Number(window.location.pathname.split('_')[window.location.pathname.split('_').length - 1])
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
         query.type = page
      }
      /*
          Navigate to home from page.
          User navigated to home but state current location is not home.
          Set current location to home and update blogs
      */
      if (page === '' && this.props.vars.currentLocation !== 'home') {
         this.navigateBlogs(query)
         this.props.varsActions.updateVars({currentLocation: 'home'})
      }
      /*
          Navigate to page from home
          User navigated to page but state current location is home.
          Set current location to page and update blogs
      */
      if (pages[page] && this.props.vars.currentLocation === 'home' && this.props.vars.currentLocation !== page) {
         this.props.varsActions.updateVars({currentLocation: page})
         this.navigateBlogs(query)
      }
      /*
          Navigate to another page from page
          User navigated to another page but state current location is page.
          Set current location to another page and update blogs
      */
      if (page !== '' && pages[page] && this.props.vars.currentLocation !== 'home' && page !== this.props.vars.currentLocation) {
         query.type = page
         this.props.varsActions.updateVars({currentLocation: page})
         if (!this.props.blogs[0] || this.props.blogs[0].type !== page) {
            if (page !== this.props.vars.currentLocation && page !== '') {
               this.navigateBlogs(query)
            }
         }
      }
      if (this.props.blog.id && this.props.vars.blogLoaded && (id.toString() === 'NaN' || !id)) {
         this.props.blogActions.resetBlog({id: null})
      }
      if (page === this.props.vars.currentLocation && topic && topic !== this.props.vars.topic) {
         this.props.varsActions.updateVars({topic: topic})
         this.navigateBlogs(query)
      }
      if (id.toString() !== 'NaN' && this.props.blog.id !== id && this.props.vars.blogLoaded) {
         this.props.varsActions.updateVars({blogLoaded: false})
         this.setBlogHere(id, page)
      }
   }

   componentDidMount() {
      /*
          Initialize state variables for loading.
      */
      this.props.varsActions.updateVars({blogsLoaded: false})

      /*
          Take state variable from url. currrent location, topic and blog
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
         if (typeof user.avatar !== 'string') {
            localStorage.removeItem('user')
            return false
         }
         if (user.firstName && user.lastName && user.userName) {
            if (page === 'login') {
               this.props.history.push('/')
            }
            this.props.userActions.updateUser(user)
            let urlCreator = window.URL || window.webkitURL
            let imageUrl = urlCreator.createObjectURL(util.dataURItoBlob(JSON.parse(user.avatar).img))
            this.props.varsActions.updateVars({profilePic: imageUrl})
            this.setBlogs(user.userName)
         } else {
            localStorage.removeItem('user')
         }
      }
      if (pages[page] && page !== 'login' && page !== 'signup') {
         this.props.varsActions.updateVars({currentLocation: page})
      }
      this.forceUpdate()
      window.addEventListener('resize', this.resize)
   }

   setBlogs(userName) {
      axios.post(env.httpURL, {
         'queryMethod': 'getPosts',
         'queryData': {
            userName: userName
         }
      })
          .then(function (response) {
             if (response.data[0]) {
                this.props.blogsActions.updateBlogs(response.data)
             } else {
                this.props.blogsActions.updateBlogs([])
             }
          }.bind(this))
          .catch(function (err) {
             this.props.blogsActions.updateBlogs([])
          }.bind(this))
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

   render() {
      let o = topics.slice(this.state.x, this.state.y)

      return (
          <div className='main_body'>
             <Helmet>
                <meta name='theme-color' content='#4285f4'/>
                <meta name='msapplication-navbutton-color' content='#4285f4'/>
                <meta name='apple-mobile-web-app-status-bar-style' content='#4285f4'/>
                <title>{'ZemuldO-' + util.toTitleCase(this.props.vars.currentLocation)}</title>
                <meta name='Danstan Otieno Onyango' content='ZemuldO-Home'/>
             </Helmet>

             <div style={{marginTop: '6em'}}>
                {window.innerWidth<600?<br/>:null}
                <div className='alignCenter'>
                   {
                      window.innerWidth < 1030 ?
                          <span style={window.innerWidth>600?{float: 'right', marginTop: '0px'}:{marginTop: '0px'}}>
                          <Input
                              icon={<Icon name='search' inverted circular link />}
                              action={{ color: 'green', labelPosition: 'left', icon: 'search', content: 'Search' }}
                              actionPosition='left'
                              placeholder='Everything...'
                              onChange={this.handleFilterChange}
                          />
                       </span> : null
                   }
                   <h1>
                      <Link to='/'>
                         <Header color={this.props.vars.color} as={'h1'}>
                            Zemuldo Blogs-{pages[this.props.vars.currentLocation].name}
                         </Header>
                      </Link>

                   </h1>
                </div>
                <br/>

                <div className='alignCenter'>
                   <Button disabled={this.state.x === 0} style={{backgroundColor: 'transparent', border: 'none'}}
                           onClick={this.show_left}>
                      <Icon size='big' color='orange' name='chevron left'/>
                   </Button>
                   {_.times(o.length, i =>
                           <Link key={o[i].key} to={'/' + this.props.vars.currentLocation + '/' + o[i].name}>
                              <Button
                                  size={'small'}
                                  style={{backgroundColor: 'green'}}
                                  disabled={this.props.vars.topic === o[i].name}
                                  className='topicButton'
                                  onClick={() => this.props.varsActions.updateVars({topic: o[i].text})}
                                  name={o[i].name}
                              >
                  <span>
                    {util.toTitleCase(o[i].name)}
                  </span>
                              </Button>
                           </Link>
                   )
                   }
                   <Button disabled={this.state.y >= topics.length}
                           style={{backgroundColor: 'transparent', border: 'none'}} onClick={this.show_right}>
                      <Icon size='big' color='orange' name='chevron right'/>
                   </Button>
                </div>
                <PagesComponent
                    history={this.props.history}
                    handleFilterChange={this.handleFilterChange}
                    blogsAreLoading={this.blogsAreLoading}
                    onReadMore={this.onReadMore}
                    setTopicPosts={this.setTopicPosts}
                    setTopicNextPosts={this.setTopicNextPosts}
                    deletedBlog={this.deletedBlog}
                    setTopic={this.setTopic}
                />
             </div>
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
