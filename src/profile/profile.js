import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import {Header, Grid} from 'semantic-ui-react'
import EditorsForm from './editorsForm'
import Welcome from './profile_wellcome'
import Blogs from '../posts/blogs'
import config from '../environments/conf'
import PropTypes from "prop-types";

const env = config[process.env.NODE_ENV] || 'development'

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            blogs: null,
            blog: null,
            blogsLoaded: false,
            blogDetails: null,
            blogLoaded: false,
            blogIsLoading: false,
            richViewerState: null
        };
        this.componentDidMount = this.componentDidMount.bind(this)
        this.componentWillUnmount = this.componentWillUnmount.bind(this)
        this.blogsAreLoading = this.blogsAreLoading.bind(this);
        this.blogIsLoading = this.blogIsLoading.bind(this);
        this.onReadMore = this.onReadMore.bind(this);

    }

    blogsAreLoading(state) {
        this.setState({blogsLoaded: !state})
    }

    blogIsLoading(state) {
        this.setState({blogLoaded: !state})
    }

    setCurrentBlog(thisBlog) {
        return axios.post(env.httpURL, {
            "queryMethod": "getPost",
            "queryData": {
                id: thisBlog.id
            }
        })
            .then(response => {
                if (response.data.error) {
                }
                else {
                    this.setState({blog: response.data, blogDetails: thisBlog});
                    this.setState({blogIsLoading: false, richViewerState: response.data.body});
                    this.setState({blogLoaded: true});
                    window.scrollTo(0, 0)
                }

            })
            .catch(exception => {
                this.setState({blog: null});
                this.setState({blogLoaded: true});
                return exception;
            });
    }

    resize = () => this.forceUpdate();

    componentDidMount() {
        window.addEventListener('resize', this.resize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }

    onReadMore(thisBlog) {
        this.setState({blogIsLoading: true});
        return axios.post(env.httpURL, {
            "queryMethod": "getPost",
            "queryData": {
                "id": thisBlog.id
            }
        })
            .then(response => {
                this.setState({blog: response.data, blogDetails: thisBlog});
                this.setState({blogIsLoading: false, richViewerState: response.data.body});
                window.scrollTo(0, 0);
                this.setCurrentBlog(thisBlog);
                this.setBlogCounts()
            })
            .catch(function (err) {
                this.setState({blog: null, blogDetails: thisBlog});
                this.setState({blogIsLoading: false});
                window.scrollTo(0, 0);
                return err;
            }.bind(this))

    }

    render() {
        return (
            <div style={{padding: '1em'}}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <div>
                                <Header color='green' as='h1'>
                                    Welcome to your dashboard.
                                </Header>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        {
                            (window.innerWidth > 600) ?
                                <Grid.Column width={3}>
                                    <Header color='green' as='h3'>
                                        Your Articles
                                    </Header>
                                    <div>
                                        {
                                            this.props.blogs[0] ?
                                                <Blogs
                                                    color={this.props.vars.color}
                                                    onReadMore={this.onReadMore}
                                                /> :
                                                <div>
                                                    You haven't published anything yet
                                                </div>
                                        }
                                    </div>
                                </Grid.Column> :
                                null
                        }
                        {
                            window.innerWidth > 600 ?
                                <Grid.Column width={10}>
                                    <Header color={this.props.vars.color} as='h1'>
                                        Welcome to your Dashboard
                                    </Header>
                                    {
                                        this.props.vars.createNew ?
                                            <EditorsForm
                                                currentUser={this.props.user}
                                                onFinishClick={this.onFinishClick}
                                                handleUTAChange={this.handleUTAChange}
                                                handleCategoryChange={this.handleCategoryChange}
                                                handleTopicChange={this.handleTopicChange}
                                            /> :
                                            <div>
                                                <Header color={this.props.vars.color} as='h1'>
                                                    Your Articles
                                                </Header>
                                                <Welcome
                                                    richViewerState={this.state.richViewerState}
                                                    color={this.props.vars.colors[1]}
                                                    blogIsLoading={this.state.blogIsLoading}
                                                    blogDetails={this.state.blogDetails}
                                                    blog={this.state.blog}
                                                    blogs={this.state.blogs}
                                                    blogLoaded={this.state.blogLoaded}/>
                                            </div>
                                    }
                                </Grid.Column> :
                                <Grid.Column width={16}>
                                    <Header color={this.props.vars.color} as='h1'>
                                        Welcome to your Dashboard.
                                    </Header>
                                    {
                                        this.props.vars.createNew ?
                                            <EditorsForm
                                                currentUser={this.props.user}
                                                onFinishClick={this.onFinishClick}
                                                handleUTAChange={this.handleUTAChange}
                                                handleCategoryChange={this.handleCategoryChange}
                                                handleTopicChange={this.handleTopicChange}
                                            /> :
                                            <div>
                                                <Header color={this.props.vars.color} as='h2'>
                                                    Your Top Articles.
                                                </Header>
                                            </div>
                                    }
                                </Grid.Column>
                        }
                        {
                            (window.innerWidth > 600) ?
                                <Grid.Column width={3}>
                                    <div>
                                        I will give you some more stuff here
                                    </div>
                                </Grid.Column> :
                                null
                        }

                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        vars: state.vars,
        blogs: state.blogs
    }
};

Profile.propTypes = {
   user: PropTypes.object.isRequired,
   blogs: PropTypes.array.isRequired,
   vars: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Profile);