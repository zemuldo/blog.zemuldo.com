import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom';
import {Loader, Header, Card, Image} from 'semantic-ui-react'
import _ from 'lodash'
import Blog from '../posts/blog'
import GridBlogs from "../posts/gridBlogs";
import {pages, topicsOBJ} from '../environments/conf'
import {bindActionCreators} from "redux";
import * as VarsActions from "../state/actions/vars";
import PropTypes from "prop-types";

class WelcomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        
    }

    render() {
        const t = 'Artiles on ';
        return (
          <div style={{margin: '2em 1em 3em 1em'}}>
            {
                    !this.props.blog.id ?
                      <div>
                        {
                                this.props.blogs[0] ?
                                  <div ref={'blogs-views'}>
                                    <Header color={this.props.vars.color} as='h2'>
                                      {
                                                this.props.vars.topic!=='all' && topicsOBJ[this.props.vars.topic]?
                                                t + topicsOBJ[this.props.vars.topic].full:
                                                    pages[this.props.vars.currentLocation].topTitle
                                            }
                                    </Header>
                                    <br />
                                    <div className='blogs'>
                                      <GridBlogs
                                        setPreviousBlogs={this.props.setPreviousBlogs}
                                        setNextBlogs={this.props.setNextBlogs}
                                        onReadMore={this.props.onReadMore}
                                        color={this.props.vars.color}
                                            />
                                    </div>
                                  </div> :
                                  <div>
                                    <Header color={this.props.vars.color} as='h1' />
                                    <div style={{
                                            fontSize: "16px",
                                            fontFamily: "georgia",
                                            padding: '0em 0em 2em 1em'
                                        }}>
                                      <p style={{
                                         fontSize: "24px"}}>
                                                There is no content on the selected topic, there are tons of topics
                                                to read about.
                                      </p>
                                      <br />
                                      <div className='blogs'>
                                        <Card.Group>
                                          {
                                                        _.times(this.props.topics.length, (i) =>
                                                          <Card className='blogCard' style={{
                                                                width: 'auto',
                                                                maxWidth: '200px',
                                                                minWidth: '100px',
                                                            }} key={i}>
                                                            <Card.Content>
                                                              <Card.Header>
                                                                <Link
                                                                  onClick={()=>this.props.varsActions.updateVars({blogsLoaded:false})}
                                                                  to={'/topics/' + this.props.topics[i].key}>
                                                                  {topicsOBJ[this.props.topics[i].key].full}
                                                                </Link>
                                                              </Card.Header>
                                                              <Card.Meta><span className='colorBlue'>{'Articles: '+this.props.topics[i].blogs}</span></Card.Meta>
                                                              <Card.Description>{this.props.topics[i].blogs+' '}articles to read on this topic.</Card.Description>
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
                    !this.props.blog.id ?
                        null :
                        <div>
                          {
                                this.props.vars.blogsLoaded ?
                                  <Blog
                                    color={this.props.vars.color}
                                    deletedBlog={this.props.deletedBlog}
                                    /> :
                                  <div style={{left: '50%', position: 'fixed', bottom: '50%', zIndex: -1}}>
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
        topics:state.topics
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        varsActions: bindActionCreators(VarsActions, dispatch)
    }
};

WelcomePage.propTypes = {
   blog: PropTypes.object.isRequired,
   blogs: PropTypes.array,
   topics: PropTypes.array,
   vars: PropTypes.object.isRequired,
   varsActions: PropTypes.object.isRequired,
   deletedBlog: PropTypes.func.isRequired,
   setPreviousBlogs: PropTypes.func.isRequired,
   setNextBlogs: PropTypes.func.isRequired,
   onReadMore: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage)