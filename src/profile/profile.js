import React from 'react'
import axios from 'axios'
import {Header,Loader, Grid } from 'semantic-ui-react'
import EditorsForm from './editorsForm'
import Welcome from '../partials/welCome'
import Blogs from '../posts/blogs'
import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'

class RichEditorExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user:null,
            createNew:false,
            blogs:null,
            blog:null,
            blogsLoaded:false,
            blogDetails:null,
            blogLoaded:false,
            blogIsLoading:false,
            richViewerState:null
        };
        this.componentDidMount=this.componentDidMount.bind(this)
        this.componentWillUnmount=this.componentWillUnmount.bind(this)
        this.blogsAreLoading = this.blogsAreLoading.bind(this);
        this.blogIsLoading = this.blogIsLoading.bind(this);
        this.onReadMore = this.onReadMore.bind(this);
        this.setBlogs = this.setBlogs.bind(this)

    }
    blogsAreLoading(state){
        this.setState({blogsLoaded:!state})
    }
    blogIsLoading(state){
        this.setState({blogLoaded:!state})
    }
    setCurrentBlog(thisBlog){
        return axios.post(env.httpURL, {
            "queryMethod":"getPost",
            "queryData":{
                id:thisBlog.id
            }
        })
            .then(response => {
                if(response.data.error){
                }
                else {
                    this.setState({blog:response.data,blogDetails:thisBlog})
                    this.setState({blogIsLoading:false,richViewerState:response.data.body})
                    this.setState({blogLoaded:true})
                    window.scrollTo(0,0)
                }

            })
            .catch(exception => {
                this.setState({blog:null})
                this.setState({blogLoaded:true})
                return exception
            });
    }
    resize = () => this.forceUpdate();
    componentDidMount() {
        window.addEventListener('resize', this.resize)
        this.blogsAreLoading(true);
        this.setBlogs()
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }
    setBlogs(){
        this.blogsAreLoading(true);
        axios.post(env.httpURL, {
            "queryMethod":"getPosts",
            "queryData":{
                userName:this.props.user.userName
            }
        })
            .then(function (response) {
                if(response.data[0]){
                    this.setState({blogs:response.data,blogsLoaded:true})
                    this.setState({blogLoaded:true})

                }
                else {
                    this.setState({blogs:[],blogsLoaded:true});
                    this.setState({blogLoaded:true})

                }
            }.bind(this))
            .catch(function (err) {
                this.setState({blogs:[],blogsLoaded:true});
                this.setState({blogLoaded:true})
            }.bind(this))

    }
    onReadMore(thisBlog){
        this.setState({blogIsLoading:true});
        return axios.post(env.httpURL, {
            "queryMethod":"getPost",
            "queryData":{
                "id":thisBlog.id
            }
        })
            .then(response => {
                this.setState({blog:response.data,blogDetails:thisBlog});
                this.setState({blogIsLoading:false,richViewerState:response.data.body});
                window.scrollTo(0,0);
                this.setCurrentBlog(thisBlog)
                this.setBlogCounts()
            })
            .catch(function (err) {
                this.setState({blog:null,blogDetails:thisBlog});
                this.setState({blogIsLoading:false});
                window.scrollTo(0,0);
                return err;
            }.bind(this))

    }
    render() {
        return (
            <div style={{padding: '1em'}}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column  width={16}>
                            <div>
                                <Header color='green' as='h1' >
                                    Welcome to your dashboard.
                                </Header>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        {
                            (window.innerWidth>600)?
                                <Grid.Column  width={3}>
                                    <Header color='green' as='h3' >
                                        Your Articles
                                    </Header>
                                    <div>
                                        {
                                            this.state.blogsLoaded?
                                              <div>
                                                  {
                                                      this.state.blogs[0]?
                                                          <Blogs
                                                              color={this.props.color}
                                                              onReadMore = {this.onReadMore}
                                                              blogs ={this.state.blogs}
                                                              blog ={this.state.blog}/>:
                                                          <div>
                                                              You haven't published anything yet
                                                          </div>
                                                  }
                                              </div>:
                                                <div style={{ position:'center', margin: '2em 0em 0em 0em'}} >
                                                    <Loader active inline='centered' />
                                                </div>
                                        }

                                    </div>
                                </Grid.Column>:
                                <div>

                                </div>
                        }
                        {
                            window.innerWidth>600?
                                <Grid.Column  width={10}>
                                    {
                                        this.props.createNew?
                                            <EditorsForm
                                                currentUser={this.props.user}
                                                _goToEditor = {this.props._goToEditor}
                                                _exitEditMode={this.props._exitEditMode}
                                                editingMode = {this.props.editingMode}
                                                onFinishClick={this.onFinishClick}
                                                handleUTAChange={this.handleUTAChange}
                                                handleCategoryChange={this.handleCategoryChange}
                                                handleTopicChange={this.handleTopicChange} />:
                                            <Welcome
                                                richViewerState={this.state.richViewerState}
                                                color={this.props.colors[1]}
                                                blogIsLoading={this.state.blogIsLoading}
                                                blogDetails={this.state.blogDetails}
                                                blog={this.state.blog}
                                                blogs={this.state.blogs}
                                                blogLoaded={this.state.blogLoaded}/>
                                    }
                                </Grid.Column>:
                                <Grid.Column  width={16}>
                                    {
                                        this.props.createNew?
                                            <EditorsForm
                                                currentUser={this.props.user}
                                                _goToEditor = {this.props._goToEditor}
                                                _exitEditMode={this.props._exitEditMode}
                                                editingMode = {this.props.editingMode}
                                                onFinishClick={this.onFinishClick}
                                                handleUTAChange={this.handleUTAChange}
                                                handleCategoryChange={this.handleCategoryChange}
                                                handleTopicChange={this.handleTopicChange} />:
                                            <Welcome
                                                richViewerState={this.state.richViewerState}
                                                color={this.props.colors[1]}
                                                blogIsLoading={this.state.blogIsLoading}
                                                blogDetails={this.props.blogDetails}
                                                blog={this.state.blog}
                                                blogs={this.state.blogs}
                                                blogLoaded={this.state.blogLoaded}/>
                                    }
                                </Grid.Column>
                        }
                        {
                            (window.innerWidth>600)?
                                <Grid.Column  width={3}>
                                    <div>
                                        I will give you some more stuff here
                                    </div>
                                </Grid.Column>:
                                <div>

                                </div>
                        }

                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}


export default RichEditorExample