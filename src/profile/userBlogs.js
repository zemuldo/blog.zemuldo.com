import React from 'react'
import {Loader, Grid} from 'semantic-ui-react'
import GridBlog from "../posts/gridBlog";
import {connect} from "react-redux";
import axios from "axios/index";
import * as BlogsActions from "../state/actions/blogs";
import * as VarsActions from "../state/actions/vars";
import * as UserActions from "../state/actions/user";
import {bindActionCreators} from "redux";
import * as BlogActions from "../state/actions/blog";
import config from '../environments/conf'

const env = config[process.env.NODE_ENV] || 'development'

class GridBlogs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.onReadMore = this.onReadMore.bind(this)
    }

    onReadMore(thisBlog) {
        this.props.varsActions.updateVars({blogLoaded: false});
        axios.post(env.httpURL, {
            "queryMethod": "getPost",
            "queryData": {
                "id": thisBlog.id
            }
        })
            .then(response => {
                let blog = response.data;
                Object.assign(blog, thisBlog);
                this.props.blogActions.updateBlog(blog);
                this.props.varsActions.updateVars({blogLoaded: true});
                window.scrollTo(0, 0);
            })
            .catch(function (err) {
                this.props.blogActions.updateBlog({});
                this.props.varsActions.updateVars({blogLoaded: true});
                return err;
            }.bind(this))
    }

    render() {
        return (
            <div>
                {
                    !this.props.blog.id ?
                        <div>
                            <div>
                                <Grid>
                                    {
                                        this.props.blogs[0] ?
                                            <GridBlog
                                                onReadMore={this.onReadMore}
                                                color={this.props.color}
                                                blog={this.props.blogs[0]}
                                            /> : null
                                    }
                                    {
                                        this.props.blogs[1] ?
                                            <GridBlog
                                                onReadMore={this.onReadMore}
                                                color={this.props.color}
                                                blog={this.props.blogs[1]}
                                            /> : null
                                    }
                                    {
                                        this.props.blogs[2] ?
                                            <GridBlog
                                                onReadMore={this.onReadMore}
                                                color={this.props.color}
                                                blog={this.props.blogs[2]}
                                            /> : null
                                    }
                                </Grid>
                                <Grid>
                                    {
                                        this.props.blogs[3] ?
                                            <GridBlog
                                                onReadMore={this.onReadMore}
                                                color={this.props.color}
                                                blog={this.props.blogs[3]}
                                            /> : null
                                    }
                                    {
                                        this.props.blogs[4] ?
                                            <GridBlog
                                                onReadMore={this.onReadMore}
                                                color={this.props.color}
                                                blog={this.props.blogs[4]}
                                            /> : null
                                    }
                                    {
                                        this.props.blogs[5] ?
                                            <GridBlog
                                                onReadMore={this.onReadMore}
                                                color={this.props.color}
                                                blog={this.props.blogs[5]}
                                            /> : null
                                    }
                                </Grid>
                                <Grid>
                                    {
                                        this.props.blogs[6] ?
                                            <GridBlog
                                                onReadMore={this.onReadMore}
                                                color={this.props.color}
                                                blog={this.props.blogs[6]}
                                            /> : null
                                    }
                                    {
                                        this.props.blogs[7] ?
                                            <GridBlog
                                                onReadMore={this.onReadMore}
                                                color={this.props.color}
                                                blog={this.props.blogs[7]}
                                            /> : null
                                    }
                                    {
                                        this.props.blogs[8] ?
                                            <GridBlog
                                                onReadMore={this.onReadMore}
                                                color={this.props.color}
                                                blog={this.props.blogs[8]}
                                            /> : null
                                    }
                                </Grid>
                                <Grid>
                                    {
                                        this.props.blogs[9] ?
                                            <GridBlog
                                                onReadMore={this.onReadMore}
                                                color={this.props.color}
                                                blog={this.props.blogs[9]}
                                            /> : null
                                    }
                                </Grid>
                            </div>
                        </div> :
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
        blog: state.blog
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        blogActions: bindActionCreators(BlogActions, dispatch),
        blogsActions: bindActionCreators(BlogsActions, dispatch),
        userActions: bindActionCreators(UserActions, dispatch),
        varsActions: bindActionCreators(VarsActions, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(GridBlogs)
