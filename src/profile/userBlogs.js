import React from 'react'
import PropTypes from 'prop-types'
import {Loader, Card, Header, Button} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import times from 'lodash/times'
import {connect} from 'react-redux'
import axios from 'axios/index'
import * as BlogsActions from '../store/actions/blogs'
import * as VarsActions from '../store/actions/vars'
import {bindActionCreators} from 'redux'
import * as BlogActions from '../store/actions/blog'
import config, {topicsOBJ} from '../conf/conf'

const getTopiINfo = (topics) => {
  let info = []
  topics.forEach(function (topic) {
    info.push(topicsOBJ[topic].full)
  })
  return info
}
const env = config[process.env.NODE_ENV] || 'development'

class GridBlogs extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    let o = this.props.blogs
    return (
      <div>
        {
                !this.props.blog.id
                    ? <Card.Group>
                      {
                          times(this.props.blogs.length, (i) =>
                            <Card key={i} className='blogCard' style={{
                              width: 'auto',
                              maxWidth: '250px',
                              minWidth: '100px'
                            }}
                              >
                              <Card.Content>
                                <Card.Header>
                                  <Header color='green' as='h3'>
                                    {o[i].title.split(' ').join(' ')}
                                  </Header>
                                </Card.Header>
                                <Card.Meta><p>Author: {o[i].author.name}</p>
                                       Likes:
                                       <span><i style={{color: 'orange'}}>
                                                                ~{o[i].likes}</i></span>
                                  <hr color={this.props.vars.color} />
                                </Card.Meta>
                                <Card.Description>
                                  <p>{o[i].about}</p>
                                  <p>
                                          15 Minutes read,
                                          <br />
                                          Related to
                                          <br />
                                    {getTopiINfo(o[i].topics).join(', ')}
                                    <br />
                                          Published on {o[i].date}
                                  </p>
                                  <Link
                                    to={'/' + o[i].type + '/' + o[i].topics[0] + '/' + o[i].author + '-' + o[i].title.split(' ').join('-') + '_' + o[i].date.split(' ').join('-') + '-' + o[i].id.toString()}>
                                    <Button
                                      color={'green'}
                                      className='redMoreButton'
                                      ref={o[i]._id}
                                      name='all'
                                      style={{color: 'blue', border: 'none', bottom: '1%'}}
                                          >
                                      <span>Read More</span>
                                    </Button>
                                  </Link>
                                </Card.Description>
                              </Card.Content>
                            </Card>
                          )
                       }
                    </Card.Group>
                    : <div style={{left: '50%', position: 'fixed', bottom: '50%', zIndex: -1}}>
                      <Loader active inline='centered' />
                      <p>Loading Blogs...</p>
                    </div>
             }
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
    blogActions: bindActionCreators(BlogActions, dispatch),
    blogsActions: bindActionCreators(BlogsActions, dispatch),
    varsActions: bindActionCreators(VarsActions, dispatch)
  }
}

GridBlogs.propTypes = {
  blog: PropTypes.object.isRequired,
  blogs: PropTypes.array.isRequired,
  vars: PropTypes.object.isRequired,
}
export default connect(mapStateToProps, mapDispatchToProps)(GridBlogs)
