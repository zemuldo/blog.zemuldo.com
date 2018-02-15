import React from 'react'
import {Loader, Card, Button } from 'semantic-ui-react'
import times from 'lodash/times'
import GridBlog from './gridBlog'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

class GridBlogs extends React.Component {
  constructor (props) {
    super(props)
    this.state = {showInfo: false}
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }

  handleMouseEnter () {
    this.setState({showInfo: true})
  }

  handleMouseLeave () {
    this.setState({showInfo: false})
  }

  render () {
    return (
      <div>
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
                        <div>
                          <br />
                          <br />
                          <Button
                            color={this.props.vars.color}
                            circular
                            size='mini'
                            floated='left'
                            onClick={() => this.props.setNextBlogs('next')}
                            name='next'
                                >
                                    See More
                          </Button>
                          <Button
                            color={this.props.vars.color}
                            circular
                            size='mini'
                            floated='right'
                            onClick={() => this.props.setPreviousBlogs('previous')}
                            name='previous'
                                >
                                    Previous
                          </Button>
                        </div>
                      </div>
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

GridBlogs.propTypes = {
  blog: PropTypes.object.isRequired,
  blogs: PropTypes.array.isRequired,
  vars: PropTypes.object.isRequired,
  setNextBlogs: PropTypes.func.isRequired,
  setPreviousBlogs: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(GridBlogs)
