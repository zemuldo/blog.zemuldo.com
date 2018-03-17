import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import {Header, Loader, Container} from 'semantic-ui-react'
import EditorsForm from './editorsForm'
import GridBlogs from '../posts/gridBlogs'
import config from '../env'
import PropTypes from 'prop-types'

const env = config[process.env.NODE_ENV] || 'development'

class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: null,
      blogs: null,
      blog: null,
      blogsLoaded: false,
      blogDetails: null,
      blogLoaded: false,
      blogIsLoading: false,
      richViewerState: null
    }
  }

  blogsAreLoading (state) {
    this.setState({blogsLoaded: !state})
  }

  blogIsLoading (state) {
    this.setState({blogLoaded: !state})
  }

  setCurrentBlog (thisBlog) {
    return axios.post(env.httpURL, {
      'queryMethod': 'getPost',
      'queryData': {
        id: thisBlog.id
      }
    })
            .then(response => {
              if (response.data.error) {
              } else {
                this.setState({blog: response.data, blogDetails: thisBlog})
                this.setState({blogIsLoading: false, richViewerState: response.data.body})
                this.setState({blogLoaded: true})
                window.scrollTo(0, 0)
              }
            })
            .catch(exception => {
              this.setState({blog: null})
              this.setState({blogLoaded: true})
              return exception
            })
  }

  resize = () => this.forceUpdate();

  componentDidMount () {
    window.addEventListener('resize', this.resize)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resize)
  }

  onReadMore (thisBlog) {
    this.setState({blogIsLoading: true})
    return axios.post(env.httpURL, {
      'queryMethod': 'getPost',
      'queryData': {
        'id': thisBlog.id
      }
    })
            .then(response => {
              this.setState({blog: response.data, blogDetails: thisBlog})
              this.setState({blogIsLoading: false, richViewerState: response.data.body})
              window.scrollTo(0, 0)
              this.setCurrentBlog(thisBlog)
              this.setBlogCounts()
            })
            .catch(function (err) {
              this.setState({blog: null, blogDetails: thisBlog})
              this.setState({blogIsLoading: false})
              window.scrollTo(0, 0)
              return err
            }.bind(this))
  }

  render () {
    return (
        <Container>
            {
                this.props.vars.createNew
                    ? <EditorsForm
                        currentUser={this.props.user}
                        onFinishClick={this.onFinishClick}
                        handleUTAChange={this.handleUTAChange}
                        handleCategoryChange={this.handleCategoryChange}
                        handleTopicChange={this.handleTopicChange}
                    />
                    : <div>
                        <Header color={this.props.vars.color} as='h1'>
                            Published by You
                        </Header>
                        <div className='blogs'>
                            {
                                this.props.vars.blogsLoaded===true?
                                    <GridBlogs
                                        history={this.props.history}
                                        color={this.props.vars.color}
                                    />:
                                    <div style={{left: '50%', position: 'fixed', bottom: '50%', zIndex: -1}}>
                                        <Loader active inline='centered' />
                                        <p>Loading Blogs...</p>
                                    </div>
                            }
                        </div>
                    </div>
            }
        </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    vars: state.vars,
    blogs: state.blogs
  }
}

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  blogs: PropTypes.array.isRequired,
  vars: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(Profile)
