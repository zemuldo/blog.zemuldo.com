import React from 'react'
import {Header, Icon, Button, Grid, Loader, Input} from 'semantic-ui-react'
import WelcomePage from './welCome'
import Blogs from '../posts/blogs'
import Topics from '../partials/topics'
import axios from 'axios'
import TwitterProf from '../partials/twitterProf'
import config from '../conf/conf'
import {pages} from '../conf/conf'
import {topicsOBJ} from '../conf/conf'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

const env = config[process.env.NODE_ENV] || 'development'
let x = 0

class PagesComponent extends React.Component {
  constructor (props) {
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

  setNextBlogs (e) {
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
      this.setState({currentLocation: page})
    }
    if (this.state.next) {
      return axios.post(env.httpURL, {
        'queryMethod': 'getPagedPosts',
        'queryData': query
      })
                .then(function (blogs) {
                  if (blogs.data.length < 5) {
                    this.setState({next: false})
                  } else {
                    this.setState({next: true})
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

  setPreviousBlogs (e) {
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
      this.setState({currentLocation: page})
    }
    return axios.post(env.httpURL, {
      'queryMethod': 'getPagedPosts',
      'queryData': query
    })
            .then(function (blogs) {
              if (blogs.data[0]) {
                this.setState({next: true})
                this.props.setTopicNextPosts(blogs.data)
              }
            }.bind(this))
            .catch(function (err) {
              this.props.setTopicNextPosts([])
            }.bind(this))
  }

  resetNav (queryMethod, topic) {
    this.setState({queryMethod: queryMethod, topic: topic})
    x = 0
  }

  render () {
    return (
      <div>
        <Grid columns={2}>
          <Grid.Row>
            {
                            (window.innerWidth > 1030)
                                ? <Grid.Column computer={3}>
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
                                  <div style={{float: 'left', margin: '2em 3em 3em 2em'}}>
                                    <Header
                                      style={{marginLeft: '10px'}}
                                      color='blue' as='h3'>Search for it
                                        </Header>
                                    <Input
                                      icon={<Icon name='search' inverted circular link />}
                                      placeholder='Search...'
                                      onChange={this.props.handleFilterChange}
                                        />

                                    <Header color={this.props.vars.colors[2]} as='h2'>Most Popular</Header>
                                    <div>
                                      <br />
                                      {
                                                this.props.blogs[0]
                                                    ? <div>
                                                      <Blogs
                                                        color={this.props.vars.color}
                                                        />
                                                      <div>
                                                        <br />
                                                        <Button
                                                          color={this.props.vars.color}
                                                          circular
                                                          size='mini'
                                                          floated='left'
                                                          disabled={!this.state.next}
                                                          onClick={() => this.setNextBlogs('next')}
                                                          name='next'
                                                            >
                                                                Next
                                                            </Button>
                                                        <Button
                                                          color={this.props.vars.color}
                                                          circular
                                                          size='mini'
                                                          floated='right'
                                                          disabled={x === 0}
                                                          onClick={() => this.setPreviousBlogs('previous')}
                                                          name='previous'
                                                            >
                                                                Prev
                                                            </Button>
                                                      </div>
                                                    </div>
                                                    : <div>
                                                        No matching content on this Topic
                                                    </div>
                                            }
                                    </div>
                                  </div>
                                </Grid.Column>
                                : <div />

                        }
            <Grid.Column mobile={window.innerWidth < 1030 ? 16 : 10}
              computer={window.innerWidth < 1030 ? 16 : 10} width={10}>
              {
                                window.innerWidth < 600
                                    ? <Topics
                                      currentLocation={this.props.vars.currentLocation}
                                      topic={this.state.topic}
                                      onTopicClick={this.onTopicClick}
                                      onAllcClick={this.onAllcClick}
                                      setTopicNextPosts={this.props.setTopicNextPosts}
                                      blog={this.props.blog}
                                      color={this.props.vars.color}
                                      blogs={this.props.blogs}
                                      resetNav={this.resetNav} />
                                    : null
                            }
              {

                                !this.props.vars.blogLoaded
                                    ? <div style={{left: '50%', position: 'fixed', bottom: '50%', zIndex: -1}}>
                                      <Loader active inline='centered' />
                                      <p>Loading Blog...</p>
                                    </div>
                                    : <WelcomePage
                                    history={this.props.history}
                                      x={x}
                                      next={this.state.next}
                                      setPreviousBlogs={this.setPreviousBlogs}
                                      setNextBlogs={this.setNextBlogs}
                                      color={this.props.vars.colors[1]}
                                    />
                            }
            </Grid.Column>
            {
                            (window.innerWidth > 1030)
                                ? <Grid.Column width={3}>
                                  {<TwitterProf />}
                                </Grid.Column> : null
                        }
          </Grid.Row>
        </Grid>
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
