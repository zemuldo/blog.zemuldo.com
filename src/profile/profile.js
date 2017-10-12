import React from 'react'
import axios from 'axios'
import {Header,Loader, Grid,Image } from 'semantic-ui-react'
import EditorsForm from './editorsForm'
import Welcome from '../partials/welCome'
import Blogs from '../posts/blogs'
import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'
/*import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'

const cats = {
    Development:'dev',
    Business:'business',
    Technology:'tech'
}
*/

class RichEditorExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user:JSON.parse(localStorage.getItem('user')),
            createNew:false,
            blogs:null,
            blog:null,
            blogsLoaded:false,
            blogDetails:null,
            blogLoaded:false,
            blogIsLoading:false,
            counts:{
                fbC:null,
                twtC:null,
                gplsC:null
            },
            richViewerState:null
        };
        this.componentDidMount=this.componentDidMount.bind(this)
        this.componentWillUnmount=this.componentWillUnmount.bind(this)
        this.blogsAreLoading = this.blogsAreLoading.bind(this);
        this.blogIsLoading = this.blogIsLoading.bind(this);
        this.onReadMore = this.onReadMore.bind(this);
        this.setBlogCounts = this.setBlogCounts.bind(this);

    }
    blogsAreLoading(state){
        this.setState({blogsLoaded:!state})
    }
    blogIsLoading(state){
        this.setState({blogLoaded:!state})
    }
    setCurrentBlog(thisBlog){
        return axios.post(env.httpURL, {
            "query":"getPost",
            "queryParam":{
                id:thisBlog.id
            }
        })
            .then(response => {
                if(response.data.error){
                }
                else {
                    this.setState({blog:response.data,blogDetails:thisBlog})
                    this.setState({blogIsLoading:false,richViewerState:response.data.body})
                    this.blogIsLoading(false)
                    window.scrollTo(0,0)
                }

            })
            .catch(exception => {
                this.setState({blog:null})
                this.blogIsLoading(false)
                return exception
            });
    }
    resize = () => this.forceUpdate();
    componentDidMount() {
        this.blogsAreLoading(true);
        window.addEventListener('resize', this.resize)
        return axios.post(env.httpURL, {
            "queryMethod":"getPosts",
            "queryData":{
                userName:this.state.user.userName
            }
        })
            .then(function (response) {
                if(response.data[0]){
                    this.setState({blogs:response.data})
                    this.blogsAreLoading(false);
                }
                else {
                    this.setState({blogs:[]});
                    this.blogsAreLoading(false);
                }
                console.log(this.state.blogs)
            }.bind(this))
            .catch(function (err) {
                console.log(err)
                this.setState({blogs:[]});
                this.blogsAreLoading(false)
            }.bind(this))
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }
    setBlogCounts(){
        let gplusPost = {
            "method": "pos.plusones.get",
            "id": "p",
            "params": {
                "nolog": true,
                "id": "https://zemuldo/"+this.state.blogDetails.title.split(' ').join('-')+'_'+this.state.blogDetails.date.split(' ').join('-')+'_'+this.state.blogDetails.id.toString(),
                "source": "widget",
                "userId": "@viewer",
                "groupId": "@self"
            },
            "jsonrpc": "2.0",
            "key": "p",
            "apiVersion": "v1"
        }
        window.scrollTo(0,0);
        return Promise.all([
            axios.get('https://graph.facebook.com/?id=http://zemuldo.com/'+this.state.blogDetails.title.split(' ').join('%2520')+'_'+this.state.blogDetails.date.split(' ').join('%2520')+'_'+this.state.blogDetails.id.toString(),{}),
            axios.get('http://public.newsharecounts.com/count.json?url=http://zemuldo.com/'+this.state.blogDetails.title.split(' ').join('-')+'_'+this.state.blogDetails.date.split(' ').join('-')+'_'+this.state.blogDetails.id.toString(),{}),
            axios.post(' https://clients6.google.com/rpc',gplusPost),
        ])
            .then(function (res) {
                this.setState({counts:{
                    fbC:(res[0].data.share.share_count)? res[0].data.share.share_count:0,
                    twtC:(res[1].data.count)?res[1].data.count:0,
                    gplsC:(res[2].data.result.metadata.globalCounts.count)?res[2].data.result.metadata.globalCounts.count:0
                }})
            }.bind(this))
            .catch(function (err) {
                this.setState({counts:{
                    fbC:0,
                    twtC:0,
                    gplsC:0
                }})
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
                                        Published by you
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
                                                currentUser={this.props.currentUser}
                                                _goToEditor = {this.props._goToEditor}
                                                _exitEditMode={this.props._exitEditMode}
                                                editingMode = {this.props.editingMode}
                                                onFinishClick={this.onFinishClick}
                                                handleUTAChange={this.handleUTAChange}
                                                handleCategoryChange={this.handleCategoryChange}
                                                handleTopicChange={this.handleTopicChange} />:
                                            <Welcome
                                                richViewerState={this.state.richViewerState}
                                                counts={this.state.counts}
                                                color={this.props.colors[1]}
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
                                                currentUser={this.props.currentUser}
                                                _goToEditor = {this.props._goToEditor}
                                                _exitEditMode={this.props._exitEditMode}
                                                editingMode = {this.props.editingMode}
                                                onFinishClick={this.onFinishClick}
                                                handleUTAChange={this.handleUTAChange}
                                                handleCategoryChange={this.handleCategoryChange}
                                                handleTopicChange={this.handleTopicChange} />:
                                            <Welcome
                                                richViewerState={this.state.richViewerState}
                                                counts={this.state.counts}
                                                color={this.props.colors[1]}
                                                blogDetails={this.state.blogDetails}
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