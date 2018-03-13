import React from 'react'
import { Header, Icon, Button, Grid, Loader, Input, Sticky } from 'semantic-ui-react'
import WelcomePage from './welCome'
import Blogs from '../posts/blogs'
import Topics from '../partials/topics'
import axios from 'axios'
import TwitterProf from '../partials/twitterProf'
import config from '../env'
import { pages } from '../env'
import { topicsOBJ } from '../env'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const env = config[process.env.NODE_ENV] || 'development'
let x = 0

class PagesComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      next: true,
      topic: 'all'
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)
    this._handleChangeBodySize = this._handleChangeBodySize.bind(this)
    this.setNextBlogs = this.setNextBlogs.bind(this)
    this.setPreviousBlogs = this.setPreviousBlogs.bind(this)
    this.resetNav = this.resetNav.bind(this)
  };

  _handleChangeBodySize (size) {
    this.setState({bodySize: size})
  }

  resize = () => this.forceUpdate();

  componentDidMount () {
    window.addEventListener('resize', this.resize)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resize)
  }

  setNextBlogs(e) {
    x += 5
    let page = window.location.pathname.split('/')[1]
    let topic = window.location.pathname.split('/')[2]
    let query = {
      'start': x.toString()
    }
    if (topicsOBJ[topic]) {
      query.topics = topic
    }
    if (pages[page] && pages[page].name !== 'Home') {
      query.type = page
      this.setState({ currentLocation: page })
    }
    if (this.state.next) {
      return axios.post(env.httpURL, {
        'queryMethod': 'getPagedPosts',
        'queryData': query
      })
        .then(function (blogs) {
          if (blogs.data.length < 5) {
            this.setState({ next: false })
          } else {
            this.setState({ next: true })
          }
          if (blogs.data[0]) {
            this.props.setTopicNextPosts(blogs.data)
          }
          if (!blogs.data[0]) {
            x -= 5
          }
        }.bind(this))
        .catch(function (err) {
          this.props.setTopicNextPosts([])
        }.bind(this))
    }
  }

  setPreviousBlogs(e) {
    if (x !== 0) {
      x -= 5
    }
    let page = window.location.pathname.split('/')[1]
    let topic = window.location.pathname.split('/')[2]
    let query = {
      'start': x.toString()
    }
    if (topicsOBJ[topic]) {
      query.topics = topic
    }
    if (pages[page] && pages[page].name !== 'Home') {
      query.type = page
      this.setState({ currentLocation: page })
    }
    return axios.post(env.httpURL, {
      'queryMethod': 'getPagedPosts',
      'queryData': query
    })
      .then(function (blogs) {
        if (blogs.data[0]) {
          this.setState({ next: true })
          this.props.setTopicNextPosts(blogs.data)
        }
      }.bind(this))
      .catch(function (err) {
        this.props.setTopicNextPosts([])
      }.bind(this))
  }

  resetNav(queryMethod, topic) {
    this.setState({ queryMethod: queryMethod, topic: topic })
    x = 0
  }

  render () {
    return (
      <div>
          {

              !this.props.vars.blogLoaded
                  ? <div style={{ left: '50%', position: 'fixed', bottom: '50%', zIndex: -1 }}>
                      <Loader active inline='centered' />
                      <p>Loading Blog...</p>
                  </div>
                  : <WelcomePage
                      navigateBlogs={this.props.navigateBlogs}
                      history={this.props.history}
                      x={x}
                      next={this.state.next}
                      setPreviousBlogs={this.setPreviousBlogs}
                      setNextBlogs={this.setNextBlogs}
                      color={this.props.vars.colors[1]}
                  />
          }
      </div>)
  }
}

const mapStateToProps = (state) => {
  return {
    vars: state.vars,
    blogs: state.blogs,
    blog: state.blog
  }
}

PagesComponent.propTypes = {
  blog: PropTypes.object,
  blogs: PropTypes.array,
  vars: PropTypes.object,
  handleFilterChange: PropTypes.func.isRequired,
  setTopicNextPosts: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(PagesComponent)
