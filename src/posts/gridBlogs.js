import React from 'react'
import {Loader, Grid, Button} from 'semantic-ui-react';
import _ from 'lodash'
import GridBlog from "./gridBlog";
import {connect} from "react-redux";

class GridBlogs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <div>
                {
                    this.props.vars.blogsLoaded && !this.props.blog.id?
                        <div>
                            <Grid>
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
                            </Grid>
                            <div>
                                <Button
                                    color={this.props.color}
                                    circular={true}
                                    size='mini'
                                    floated='left'
                                    disabled={!this.props.next}
                                    onClick={this.props.setNextBlogs.bind(this, 'next')}
                                    name="next"
                                >
                                    See More
                                </Button>
                                <Button
                                    color={this.props.color}
                                    circular={true}
                                    size='mini'
                                    floated='right'
                                    disabled={this.props.x === 0}
                                    onClick={this.props.setPreviousBlogs.bind(this, 'previous')}
                                    name="previous"
                                >
                                    Previous
                                </Button>
                            </div>
                        </div>:
                        <div style={{left: '50%', position: 'fixed', bottom: '50%', zIndex: -1}}>
                            <Loader active inline='centered'/>
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
        vars:state.vars
    }
}

export default connect(mapStateToProps)(GridBlogs)
