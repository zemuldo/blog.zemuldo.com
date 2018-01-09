import React from 'react'
import {Loader, Card, Button, Header} from 'semantic-ui-react';
import _ from 'lodash'
import GridBlog from "./gridBlog";
import {connect} from "react-redux";
import {topicsOBJ} from "../environments/conf";

const getTopiINfo = (topics) => {
    let info = []
    topics.forEach(function (topic) {
        info.push(topicsOBJ[topic].full)
    })
    return info
}

class GridBlogs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {showInfo:false};
        this.handleMouseEnter=this.handleMouseEnter.bind(this);
        this.handleMouseLeave=this.handleMouseLeave.bind(this);
    }

    handleMouseEnter(o) {
        this.setState({showInfo:true})
    }

    handleMouseLeave(o) {
        this.setState({showInfo:false})
    }

    render() {
        return (
          <div>
            {
                    this.props.vars.blogsLoaded && !this.props.blog.id ?
                      <div>
                        <Card.Group>
                          {
                                    _.times(this.props.blogs.length,(i)=>
                                      <GridBlog
                                        key={this.props.blogs[i].id}
                                        onReadMore={this.props.onReadMore}
                                        color={this.props.color}
                                        blog={this.props.blogs[i]}
                                        />
                                    )
                                }
                        </Card.Group>
                        <div>
                          <br />
                           <br/>
                          <Button
                            color={this.props.color}
                            circular
                            size='mini'
                            floated='left'
                            disabled={!this.props.next}
                            onClick={this.props.setNextBlogs.bind(this, 'next')}
                            name='next'
                                >
                                    See More
                          </Button>
                          <Button
                            color={this.props.color}
                            circular
                            size='mini'
                            floated='right'
                            disabled={this.props.x === 0}
                            onClick={this.props.setPreviousBlogs.bind(this, 'previous')}
                            name='previous'
                                >
                                    Previous
                          </Button>
                        </div>
                      </div> :
                      <div style={{left: '50%', position: 'fixed', bottom: '50%', zIndex: -1}}>
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

export default connect(mapStateToProps)(GridBlogs)
