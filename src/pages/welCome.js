import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Loader, Header, Card, Image} from 'semantic-ui-react'
import _ from 'lodash'
import {toTitleCase} from '../util'
import Blog from '../posts/blog'
import GridBlogs from '../posts/gridBlogs'
import {pages, topicsOBJ} from '../conf/conf'
import {bindActionCreators} from 'redux'
import * as VarsActions from '../store/actions/vars'
import PropTypes from 'prop-types'

class WelcomePage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.componentDidMount = this.componentDidMount.bind(this)
  }

  componentDidMount () {
  }

  render () {
    const t = 'Artiles on '
    return (
      <div style={{margin: '2em 1em 3em 1em'}}>
        {
                    !this.props.blog.id
                      ? <div>
                        {
                                this.props.blogs[0]
                                  ? <div ref={'blogs-views'}>
                                    <Header color={this.props.vars.color} as='h2'>
                                      {
                                                this.props.vars.topic !== 'all' && topicsOBJ[this.props.vars.topic]
                                                ? t + topicsOBJ[this.props.vars.topic].name
                                                    : pages[this.props.vars.currentLocation].topTitle
                                            }
                                    </Header>
                                    <br />
                                    <div className='blogs'>
                                      {
                                        this.props.vars.blogsLoaded===true?
                                        <GridBlogs
                                        history={this.props.history}
                                        setPreviousBlogs={this.props.setPreviousBlogs}
                                        setNextBlogs={this.props.setNextBlogs}
                                        color={this.props.vars.color}
                                            />:
                                            <div style={{left: '50%', position: 'fixed', bottom: '50%', zIndex: -1}}>
                                            <Loader active inline='centered' />
                                            <p>Loading Blogs...</p>
                                          </div>
                                      }
                                    </div>
                                  </div>
                                  : <div>
                                    <Header color={this.props.vars.color} as='h1' />
                                    <div style={{
                                      fontSize: '16px',
                                      fontFamily: 'georgia',
                                      padding: '0em 0em 2em 1em'
                                    }}>
                                      <p style={{
                                        fontSize: '24px'}}>
                                                There is no content on the selected topic, there are tons of topics
                                                to read about.
                                      </p>
                                      <br />
                                      <div className='blogs'>
                                        <Card.Group>
                                              {
                                                _.times(this.props.topics.length, (i) =>
                                                  <Card
                                                    onClick={() => this.props.history.push('/topics/' + this.props.topics[i].key)}
                                                    className='blogCard' style={{
                                                      width: 'auto',
                                                      maxWidth: '250px',
                                                      minWidth: '100px'
                                                    }} key={i}>
                                                    <Card.Content>
                                                      <Card.Header>
                                                      <span className={'colorBlue'}>
                                                          {topicsOBJ[this.props.topics[i].key].name}
                                                        </span>
                                                      </Card.Header>
                                                    </Card.Content>
                                                    <Card.Content>
                                                      <Card.Header>
                                                        
                                                        <p>
                                                          <Image
                                                          style={{maxHeight:'130px'}}
                                                            alt={topicsOBJ[this.props.topics[i].key].name + 'blogs image'}
                                                            src={this.props.vars.env.static+'img/blogs/topics/' + this.props.topics[i].key + '.png'}
                                                          />
                                                        </p>
                                                      </Card.Header>
                                                      <Card.Meta><span className='colorBlue'>{'Articles: ' + this.props.topics[i].blogs}</span></Card.Meta>
                                                      <Card.Description>
                                                        {toTitleCase(inWords(Number(this.props.topics[i].blogs))) + ' '}articles to read on this topic.
                                                      </Card.Description>
                                                    </Card.Content>
                                                  </Card>
                                                )
                                              }
                                        </Card.Group>

                                      </div>
                                    </div>
                                  </div>
                            }
                      </div> : null
                }
        {
                    !this.props.blog.id
                        ? null
                        : <div>
                          {
                                this.props.vars.blogsLoaded
                                  ? <Blog
                                  navigateBlogs ={this.props.navigateBlogs}
                                    color={this.props.vars.color}
                                    />
                                  : <div style={{left: '50%', position: 'fixed', bottom: '50%', zIndex: -1}}>
                                    <Loader active inline='centered' />
                                    <p>Loading Blogs...</p>
                                  </div>

                            }
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
    vars: state.vars,
    topics: state.topics
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    varsActions: bindActionCreators(VarsActions, dispatch)
  }
}

WelcomePage.propTypes = {
  blog: PropTypes.object.isRequired,
  blogs: PropTypes.array,
  topics: PropTypes.array,
  vars: PropTypes.object.isRequired,
  varsActions: PropTypes.object.isRequired,
  setPreviousBlogs: PropTypes.func.isRequired,
  setNextBlogs: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage)
