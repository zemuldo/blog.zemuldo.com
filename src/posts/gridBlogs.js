import React from 'react'
import { Loader, Card, Button, Visibility } from 'semantic-ui-react'
import times from 'lodash/times'
import GridBlog from './gridBlog'
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'
import * as BlogsActions from '../store/actions/blogs'
import PropTypes from 'prop-types'
import axios from 'axios'

class GridBlogs extends React.Component {
  constructor(props) {
    super(props)
    this.state = { showInfo: false, number: this.props.blogs.length,nomoreBlogs:false }
  }

  handleMouseEnter() {
    this.setState({ showInfo: true })
  }

  handleMouseLeave() {
    this.setState({ showInfo: false })
  }

  handleRefreshPosts = () => {
    if(window.location.pathname==='/' && !this.state.nomoreBlogs){
      axios.post(this.props.vars.env.httpURL, {
        "queryMethod": "getPosts",
        "queryData": {
          "start": this.props.blogs.length
        }
      })
        .then(o => {
          this.props.blogsActions.addBlogs(o.data)
          if(!o.data[0])this.setState({nomoreBlogs:true})
        })
        .catch(e => {
          console.log(e)
        })
    }
  }

  render() {
    return (
      <div>

        <Visibility once={false} onBottomVisible={this.handleRefreshPosts}>

          {
            this.props.vars.blogsLoaded && !this.props.blog.id
              ? <div>
                <Card.Group>
                  {
                    times(this.props.blogs.length, (i) =>
                      <GridBlog
                        history={this.props.history}
                        key={this.props.blogs[i].id}
                        color={this.props.vars.color}
                        blog={this.props.blogs[i]}
                      />
                    )
                  }
                </Card.Group>
              </div>
              : <div style={{ left: '50%', position: 'fixed', bottom: '50%', zIndex: -1 }}>
                <Loader active inline='centered' />
                <p>Loading Blogs...</p>
              </div>
          }

        </Visibility>


      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs,
    blog: state.blog,
    vars: state.vars
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      blogsActions: bindActionCreators(BlogsActions, dispatch),
  }
}

GridBlogs.propTypes = {
  blog: PropTypes.object.isRequired,
  blogs: PropTypes.array.isRequired,
  vars: PropTypes.object.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(GridBlogs)
