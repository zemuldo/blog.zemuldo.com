import React from 'react'
import {Loader,Grid,Button,Header} from 'semantic-ui-react'
import GridBlog from "./gridBlog";

class GridBlogs extends React.Component {
    constructor(props){
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div>
                {
                    this.props.blogs.length > 0 && !this.props.blog?
                        <div>
                            <Grid>
                                {
                                    this.props.blogs[0] ?
                                        <GridBlog
                                            onReadMore = {this.props.onReadMore}
                                            color={this.props.color}
                                            blog={this.props.blogs[0]}
                                        />:null
                                }
                                {
                                    this.props.blogs[1] ?
                                        <GridBlog
                                            onReadMore = {this.props.onReadMore}
                                            color={this.props.color}
                                            blog={this.props.blogs[1]}
                                        />:null
                                }
                                {
                                    this.props.blogs[2] ?
                                        <GridBlog
                                            onReadMore = {this.props.onReadMore}
                                            color={this.props.color}
                                            blog={this.props.blogs[2]}
                                        />:null
                                }
                            </Grid>
                            <Grid>
                                {
                                    this.props.blogs[3] ?
                                        <GridBlog
                                            onReadMore = {this.props.onReadMore}
                                            color={this.props.color}
                                            blog={this.props.blogs[3]}
                                        />:null
                                }
                                {
                                    this.props.blogs[4] ?
                                        <GridBlog
                                            onReadMore = {this.props.onReadMore}
                                            color={this.props.color}
                                            blog={this.props.blogs[4]}
                                        />:null
                                }
                                {
                                    this.props.blogs[5] ?
                                        <GridBlog
                                            onReadMore = {this.props.onReadMore}
                                            color={this.props.color}
                                            blog={this.props.blogs[5]}
                                        />:null
                                }
                            </Grid>
                            <Grid>
                                {
                                    this.props.blogs[6] ?
                                        <GridBlog
                                            onReadMore = {this.props.onReadMore}
                                            color={this.props.color}
                                            blog={this.props.blogs[6]}
                                        />:null
                                }
                                {
                                    this.props.blogs[7] ?
                                        <GridBlog
                                            onReadMore = {this.props.onReadMore}
                                            color={this.props.color}
                                            blog={this.props.blogs[7]}
                                        />:null
                                }
                                {
                                    this.props.blogs[8] ?
                                        <GridBlog
                                            onReadMore = {this.props.onReadMore}
                                            color={this.props.color}
                                            blog={this.props.blogs[8]}
                                        />:null
                                }
                            </Grid>
                            <Grid>
                                {
                                    this.props.blogs[9] ?
                                        <GridBlog
                                            onReadMore = {this.props.onReadMore}
                                            color={this.props.color}
                                            blog={this.props.blogs[9]}
                                        />:null
                                }
                            </Grid>
                        </div> :
                        <Loader/>
                }
            </div>
        )
    }
}

export default GridBlogs
