import React,{Component} from 'react'
import { Header, Icon, Grid ,Loader,Input} from 'semantic-ui-react'
import axios from 'axios';
import WelcomePage from '../partials/welCome'
import Blogs from '../posts/blogs'
import Topics from '../partials/topics'
import TwitterProf from '../partials/twitterProf'
import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'
class HomePage extends Component {
    constructor(props){
        super(props);
        this.state = {
            blogs:[],
            blog:null,
            blogDetails:null,
            logged:false,
            homePageLoaded:false,
            blogsLoaded:false,
            blogLoaded:false,
            blogIsLoading:false,
            bodySize:(window.innerWidth<503)?16:12,
            counts:{
                fbC:null,
                twtC:null,
                gplsC:null
            },
            topic:null,
            richViewerState:null,
            validURL:false
        };
        this.goToHome = this.goToHome.bind(this);
        this.onReadMore = this.onReadMore.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this._handleChangeBodySize = this._handleChangeBodySize.bind(this);
        this.setCurrentBlog = this.setCurrentBlog.bind(this);
        this.setTopicPosts = this.setTopicPosts.bind(this);
        this.blogsAreLoading = this.blogsAreLoading.bind(this);
        this.homePageIsLoading = this.homePageIsLoading.bind(this);
        this.blogIsLoading = this.blogIsLoading.bind(this);
        this.setHomeBlogs = this.setHomeBlogs.bind(this)


    };
    homePageIsLoading = (value)=>{
        this.setState({homePageLoaded:!value})
    }
    blogsAreLoading(state){
        this.setState({blogsLoaded:!state})
    }
    blogIsLoading(state){
        this.setState({blogLoaded:!state})
    }
    onReadMore(thisBlog){
        this.setState({blogIsLoading:true})
        return axios.post(env.httpURL, {
            "queryMethod":"getPost",
            "queryData":{
                "id":thisBlog.id
            }
        })
            .then(response => {
                this.setState({blog:response.data,blogDetails:thisBlog})
                this.setState({blogIsLoading:false,richViewerState:response.data.body})
                window.scrollTo(0,0)
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
                return Promise.all([
                    axios.get('https://graph.facebook.com/?id=http://zemuldo.com/'+this.state.blogDetails.title.split(' ').join('%2520')+'_'+this.state.blogDetails.date.split(' ').join('%2520')+'_'+this.state.blogDetails.id.toString(),{}),
                    axios.get('http://public.newsharecounts.com/count.json?url=http://zemuldo.com/'+this.state.blogDetails.title.split(' ').join('-')+'_'+this.state.blogDetails.date.split(' ').join('-')+'_'+this.state.blogDetails.id.toString(),{}),
                    axios.post(' https://clients6.google.com/rpc',gplusPost),
                ])
            })
            .then(function (res) {
                this.setState({counts:{
                    fbC:(res[0].data.share.share_count)? res[0].data.share.share_count:0,
                    twtC:(res[1].data.count)?res[1].data.count:0,
                    gplsC:(res[2].data.result.metadata.globalCounts.count)?res[2].data.result.metadata.globalCounts.count:0
                }})
            }.bind(this))
            .catch(function (err) {
                this.setState({blog:null,blogDetails:thisBlog})
                this.setState({blogIsLoading:false})
                window.scrollTo(0,0)
                return err
            }.bind(this))

    }
    goToHome(){
        this.setState({current:'ZemuldO-Home'})
    }
    _handleChangeBodySize(size){
        this.setState({bodySize:size})
    }
    resize = () => this.forceUpdate();
    setCurrentBlog(id){
        this.blogIsLoading(true)
        return Promise.all([axios.post(env.httpURL, {
            "queryMethod":"getPost",
            "queryData":{
                id:id
            }
        }),
        axios.post(env.httpURL, {
            "queryMethod":"getPostDetails",
            "queryData":{
                "id":id
            }
        })])
            .then(response => {
                if(response[0].data && !response[0].data.error && response[1].data && !response[1].data.error ){
                    this.setState({blog:response[0].data,richViewerState:response[0].data.body})
                    this.setState({blogDetails:response[1].data})
                }
                this.blogIsLoading(false)
                return true
            })
            .catch(exception => {
                this.blogIsLoading(false)
                return exception
            });

    }
    componentDidMount() {
        let url = window.location.pathname.split('/').join('')
        if(url.indexOf('-')!==-1){
            let id = url.split('_')[2]
            this.setCurrentBlog(id)
        }
        else if(url.indexOf('%20')!==-1){
            let id = url.split('_')[2]
            this.setCurrentBlog(id)
        }
        else if(url.indexOf('%2520')!==-1){
            let id = url.split('_')[2]
            this.setCurrentBlog(id)
        }
        else {
            this.blogIsLoading(false)
        }
        this.forceUpdate()
        if(window.innerWidth<503){
            this._handleChangeBodySize(16)
        }
        if(window.innerWidth>503){
            this._handleChangeBodySize(16)
        }

        window.addEventListener('resize', this.resize)
        this.setHomeBlogs()
        this.homePageIsLoading(false)
        this.blogsAreLoading(false)

    }
    setHomeBlogs(){
        return axios.post(env.httpURL, {
            "queryMethod":"getAllPosts",
            "queryData":{}
        })
            .then(function (response) {
                if(response.data[0]){
                    this.setState({blogs:response.data})
                }
            }.bind(this))
            .catch(function (err) {
            })
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }
    handleFilterChange(e) {
        e.preventDefault();
        if(e.target.value===''){
            return axios.post(env.httpURL, {
                "queryMethod":"getAllPosts",
                "queryData":{}
            })
                .then(response => {
                    this.setState({blogs:response.data})
                })
                .catch(exception => {
                });
        }
        else {
            return axios.post(env.httpURL, {
                "queryMethod":"getFiltered",
                "queryData":{
                    "filter":e.target.value,
                }
            })
                .then(response => {
                    this.setState({blogs:response.data})
                    console.log("||||||||||||||||||||||||||||")
                    console.log(this.state.blog)
                    console.log(this.state.blogDetails)
                })
                .catch(exception => {
                    this.setState({blogs:[]})
                });
        }
    }

    setTopicPosts(topicBlogs,topic){
        if(topicBlogs[0]){
            this.setState({blogs:topicBlogs,topic:topic})
            this.blogsAreLoading(false)
        }
        else {
            this.setState({blogs:[],topic:topic})
            this.blogsAreLoading(false)
        }
    }
    render(){
        return(
            <div>
                {
                    this.state.homePageLoaded ?
                        <div>
                            {
                                (window.innerWidth>503) ?
                                    <Grid columns={2}>
                                        <Grid.Row>
                                            {
                                                (window.innerWidth>600) ?
                                                    <Grid.Column  width={4}>
                                                        <Topics
                                                            blogsAreLoading={this.blogsAreLoading}
                                                            setTopicPosts={this.setTopicPosts}
                                                            onReadMore = {this.onReadMore}
                                                            blog ={this.state.blog}
                                                            color={this.props.color}
                                                            blogs={this.state.blogs}/>
                                                        <div style={{ float: 'left', margin: '2em 3em 3em 2em'}}>
                                                            <Header
                                                                style={{marginLeft:'10px'}}
                                                                color='blue' as='h3'>Search for it
                                                            </Header>
                                                            <Input
                                                                icon={<Icon name='search' inverted circular link />}
                                                                placeholder='Search...'
                                                                onChange={this.handleFilterChange}
                                                            />
                                                            <Header  color={this.props.colors[2]} as='h2'>Most Popular</Header>
                                                            {
                                                               this.state.blogsLoaded?
                                                                    <div>
                                                                        {
                                                                            (this.state.blogs[0]) ?
                                                                                <Blogs
                                                                                    color={this.props.color}
                                                                                    onReadMore = {this.onReadMore}
                                                                                    blogs ={this.state.blogs}
                                                                                    blog ={this.state.blog}/>:
                                                                                <div>
                                                                                    No matching content on this Topic
                                                                                </div>
                                                                        }
                                                                    </div>:
                                                                    <div style={{ position:'center', margin: '20em 0em 0em 0em'}} >
                                                                        <Loader active inline='centered' />
                                                                    </div>

                                                            }
                                                        </div>
                                                    </Grid.Column>:
                                                    <p>Hello</p>

                                            }
                                            <Grid.Column  width={9}>
                                                {
                                                    !this.state.blogLoaded?
                                                        <div style={{ position:'center', margin: '16em 2em 2em 2em'}}>
                                                            <Loader active inline='centered' />
                                                        </div>:
                                                        <WelcomePage
                                                            richViewerState={this.state.richViewerState}
                                                            counts={this.state.counts}
                                                            color={this.props.colors[1]}
                                                            blogDetails={this.state.blogDetails}
                                                            blog={this.state.blog}
                                                            blogs={this.state.blogs}
                                                            blogLoaded={this.state.blogLoaded}/>
                                                }

                                            </Grid.Column>
                                            {
                                                (window.innerWidth>1030) ?
                                                    <Grid.Column  width={3}>
                                                        <TwitterProf/>
                                                    </Grid.Column>:
                                                    <p>Hello</p>
                                            }
                                        </Grid.Row>
                                    </Grid>:
                                    <Grid columns={2} divided>
                                        <Grid.Row>
                                            {
                                                (window.innerWidth>600) ?
                                                    <Grid.Column  width={4}>
                                                        <Topics
                                                            blogsAreLoading={this.blogsAreLoading}
                                                            setTopicPosts={this.setTopicPosts}
                                                            onReadMore = {this.onReadMore}
                                                            blog ={this.state.blog}
                                                            color={this.props.color}
                                                            blogs={this.state.blogs}/>
                                                        <div style={{ float: 'left', margin: '2em 3em 3em 2em'}}>
                                                            <Header style={{marginLeft:'10px'}} color='blue' as='h3'>Search for it</Header>
                                                            <Input
                                                                icon={<Icon name='search' inverted circular link />}
                                                                placeholder='Search...'
                                                                onChange={this.handleFilterChange}
                                                            />
                                                            <Header
                                                                color={this.props.colors[2]} as='h2'>
                                                                Most Popular
                                                            </Header>
                                                            {
                                                                this.state.blogsLoaded?
                                                                    <div>
                                                                        {
                                                                            (this.state.blogs[0]) ?
                                                                                <Blogs
                                                                                    color={this.props.color}
                                                                                    onReadMore = {this.onReadMore}
                                                                                    blogs ={this.state.blogs} blog ={this.state.blog}/>:
                                                                                <div>
                                                                                    No matching content on this Topic
                                                                                </div>
                                                                        }
                                                                    </div>:
                                                                    <div style={{ position:'center', margin: '4em 0em 0em 0em'}} >
                                                                        <Loader active inline='centered' />
                                                                    </div>

                                                            }
                                                        </div>
                                                    </Grid.Column>:
                                                    <p>Hello</p>

                                            }
                                            <Grid.Column  width={16}>
                                                <Topics
                                                    blogsAreLoading={this.blogsAreLoading}
                                                    setTopicPosts={this.setTopicPosts}
                                                    onReadMore = {this.onReadMore}
                                                    blog ={this.state.blog}
                                                    color={this.props.color}
                                                    blogs={this.state.blogs}/>
                                                {
                                                    !this.state.blogLoaded?
                                                        <div style={{ position:'center', margin: '16em 2em 2em 2em'}}>
                                                            <Loader active inline='centered' />
                                                        </div>:
                                                        <WelcomePage
                                                            richViewerState={this.state.richViewerState}
                                                            counts={this.state.counts}
                                                            color={this.props.colors[1]}
                                                            blogDetails={this.state.blogDetails}
                                                            blog={this.state.blog}
                                                            blogs={this.state.blogs}
                                                            blogLoaded={this.state.blogLoaded}/>
                                                }
                                                {
                                                    this.state.blogsLoaded?
                                                        <div>
                                                            {
                                                                (this.state.blogs[0]) ?
                                                                    <Blogs
                                                                        color={this.props.color}
                                                                        onReadMore = {this.onReadMore}
                                                                        blogs ={this.state.blogs} blog ={this.state.blog}/>:
                                                                    <div>
                                                                        No matching content on this Topic
                                                                    </div>
                                                            }
                                                        </div>:
                                                        <div style={{ position:'center', margin: '4em 0em 0em 0em'}} >
                                                            <Loader active inline='centered' />
                                                        </div>

                                                }

                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                            }

                        </div>:
                        <div   style={ {height:window.innerHeight,margin: '20em 3em 1em 0em'}}>
                            <Loader active inline='centered' />
                        </div>
                }
            </div>)
    }
}
export default HomePage