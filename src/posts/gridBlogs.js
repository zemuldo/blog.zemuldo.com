import React from 'react'
import {Loader,Grid} from 'semantic-ui-react'

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
                                        <Grid.Column width={5}>
                                            <h4>{this.props.blogs[0].title}</h4>
                                            <p>By: Author: {this.props.blogs[0].author}</p>
                                            <p>{this.props.blogs[0].about}</p>
                                        </Grid.Column> : null
                                }
                                {
                                    this.props.blogs[1] ?
                                        <Grid.Column width={5}>
                                            <h4>{this.props.blogs[1].title}</h4>
                                            <p>By: Author: {this.props.blogs[1].author}</p>
                                            <p>{this.props.blogs[1].about}</p>
                                        </Grid.Column> : null
                                }
                                {
                                    this.props.blogs[2] ?
                                        <Grid.Column width={5}>
                                            <h4>{this.props.blogs[2].title}</h4>
                                            <p>By: Author: {this.props.blogs[2].author}</p>
                                            <p>{this.props.blogs[2].about}</p>
                                        </Grid.Column> : null
                                }
                            </Grid>
                            <Grid>
                                {
                                    this.props.blogs[3] ?
                                        <Grid.Column width={5}>
                                            <h4>{this.props.blogs[3].title}</h4>
                                            <p>By: Author: {this.props.blogs[3].author}</p>
                                            <p>{this.props.blogs[3].about}</p>
                                        </Grid.Column> : null
                                }
                                {
                                    this.props.blogs[4] ?
                                        <Grid.Column width={5}>
                                            <h4>{this.props.blogs[4].title}</h4>
                                            <p>By: Author: {this.props.blogs[4].author}</p>
                                            <p>{this.props.blogs[4].about}</p>
                                        </Grid.Column> : null
                                }
                                {
                                    this.props.blogs[5] ?
                                        <Grid.Column width={5}>
                                            <h4>{this.props.blogs[5].title}</h4>
                                            <p>By: Author: {this.props.blogs[5].author}</p>
                                            <p>{this.props.blogs[5].about}</p>
                                        </Grid.Column> : null
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
