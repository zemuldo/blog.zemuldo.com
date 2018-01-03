import React from 'react';
import {Button,List,Header} from 'semantic-ui-react'
import _ from 'lodash'
import {Link} from 'react-router-dom'
import { connect } from "react-redux";
import axios from "axios/index";
import config from '../environments/conf'
import * as BlogsActions from "../state/actions/blogs";
import * as VarsActions from "../state/actions/vars";
import * as UserActions from "../state/actions/user";
import {bindActionCreators} from "redux";
import * as BlogActions from "../state/actions/blog";
const env = config[process.env.NODE_ENV] || 'development'

class Blogs extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.componentDidMount = this.componentDidMount.bind(this)
    };
    componentDidMount() {}
    onReadMore(thisBlog) {
        this.props.varsActions.updateVars({ blogLoaded: false });
        axios.post(env.httpURL, {
            "queryMethod": "getPost",
            "queryData": {
                "id": thisBlog.id
            }
        })
            .then(response => {
                let blog = response.data;
                Object.assign(blog,thisBlog);
                this.props.blogActions.updateBlog(blog);
                this.props.varsActions.updateVars({ blogLoaded: true });
                window.scrollTo(0, 0);
            })
            .catch(function (err) {
                this.props.blogActions.updateBlog({});
                this.props.varsActions.updateVars({ blogLoaded: true });
                return err;
            }.bind(this))
    }
    render() {
        let o = this.props.blogs
        return (
            <div>
                {
                    (this.props.blogs.length>10) ?
                        <div>
                            { _.times(this.props.blogs.length, i =>
                                    <List.Item key={this.props.blogs[i]._id} >
                                        <List.Icon name='leaf' />
                                        <List.Content>
                                            <Header color='green' as='h3'>
                                                {this.props.blogs[i].title.split(' ').join(' ')}
                                                </Header>
                                        </List.Content>
                                        <List.Content>
                                            Author: {this.props.blogs[i].author}
                                            </List.Content>
                                        <span>
                                            Likes:
                                            <span>
                                                <i style={{color:'orange'}}>
                                                ~{this.props.blogs[i].likes}
                                                </i>
                                            </span>
                                        </span>
                                        <Link to = {'/' + o[i].type + '/' + o[i].topics[0] + '/' + o[i].userName + '_' + o[i].title.split(' ').join('-') + '_' + o[i].date.split(' ').join('-') + '_' + o[i].id.toString()}>
                                            <Button
                                                className="redMoreButton"
                                                ref={this.props.blogs[i]._id}
                                                onClick={() => { this.onReadMore(this.props.blogs[i]) }}
                                                name="all"
                                                style={{color:'blue',backgroundColor:'transparent',border:'none'}}
                                            >
                                                <span>Read</span>
                                            </Button>
                                        </Link>
                                        <hr/>
                                    </List.Item>
                                )
                            }
                        </div>
                        :
                        <div>
                            {
                                this.props.blogs.map((x, i) =>
                                    <List.Item key={this.props.blogs[i]._id}>
                                        <List.Icon name='leaf' />
                                        <List.Content>
                                            <Header color='green' as='h3'>
                                                {this.props.blogs[i].title.split(' ').join(' ')}
                                            </Header>
                                        </List.Content>
                                        <List.Content>
                                            Author: {this.props.blogs[i].author}
                                            </List.Content>
                                        <span >
                                            Likes:
                                        </span>
                                            <span>
                                                <i style={{color:'orange'}}>
                                                    {this.props.blogs[i].likes}
                                                </i>
                                            </span>
                                        <Link to = {'/' + o[i].type + '/' + o[i].topics[0] + '/' + o[i].userName + '_' + o[i].title.split(' ').join('-') + '_' + o[i].date.split(' ').join('-') + '_' + o[i].id.toString()}>
                                            <Button
                                                circular
                                                size="mini"
                                                disabled={!this.props.blog?false:this.props.blog._id===this.props.blogs[i]._id}
                                                className="redMoreButton"
                                                ref={this.props.blogs[i]._id}
                                                onClick={() => { this.onReadMore(this.props.blogs[i]) }}
                                                name="all"
                                                style={{color:'blue',backgroundColor:'transparent',border:'none'}}
                                            >
                                                <span>Read More</span>
                                            </Button>
                                        </Link>

                                        <hr/>
                                    </List.Item>
                                )
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
        blog:state.blog
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        blogActions: bindActionCreators(BlogActions, dispatch),
        blogsActions: bindActionCreators(BlogsActions, dispatch),
        userActions:bindActionCreators(UserActions,dispatch),
        varsActions:bindActionCreators(VarsActions,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Blogs) ;
