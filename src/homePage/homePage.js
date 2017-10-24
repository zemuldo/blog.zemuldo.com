import React,{Component} from 'react'
import { Header, Icon, Grid ,Loader,Input} from 'semantic-ui-react'
import WelcomePage from '../partials/welCome'
import Blogs from '../posts/blogs'
import Topics from '../partials/topics'
import axios from 'axios'
import TwitterProf from '../partials/twitterProf'
import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'
let x =5
class PagesComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            next:true,
            topic:null,
            queryMethod:'getPagedPosts',
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this._handleChangeBodySize = this._handleChangeBodySize.bind(this);
        this.setNextBlogs = this.setNextBlogs.bind(this)
        this.setPreviousBlogs = this.setPreviousBlogs.bind(this)
        this.resetNav = this.resetNav.bind(this)
    };
    _handleChangeBodySize(size){
        this.setState({bodySize:size})
    }
    resize = () => this.forceUpdate();
    componentDidMount() {

    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }
    setNextBlogs(e){
        if(this.state.next){
            x+=5;
            return axios.post(env.httpURL,{
                "queryMethod":"getPagedPosts",
                "queryData":{
                    "start":x.toString(),
                    "topic":this.state.topic
                }
            })
                .then(function (blogs) {
                    if(blogs.data.length<2){
                        this.setState({next:false})
                    }
                    else {
                        this.setState({next:true})
                    }
                    this.props.setTopicNextPosts(blogs.data);
                }.bind(this))
                .catch(function (err) {
                    this.props.setTopicNextPosts([])
                }.bind(this))
        }

    }
    setPreviousBlogs(e){
        x-=5;
        return axios.post(env.httpURL,{
            "queryMethod":"getPagedPosts",
            "queryData":{
                "start":x.toString(),
                "topic":this.state.topic

            }
        })
            .then(function (blogs) {
                this.setState({next:true})
                this.props.setTopicNextPosts(blogs.data);
            }.bind(this))
            .catch(function (err) {
                this.props.setTopicNextPosts([])
            }.bind(this))

    }
    resetNav(queryMethod,topic){
        this.setState({queryMethod:queryMethod,topic:topic})
        x=0
    }
    render(){
        return(
            <div>
                {
                    this.props.homePageLoaded?
                        <div>
                            <Grid columns={2}>
                                <Grid.Row>
                                    {
                                        (window.innerWidth>600) ?
                                            <Grid.Column computer={4}>
                                                <Topics
                                                    blogsAreLoading={this.props.blogsAreLoading}
                                                    setTopicPosts={this.props.setTopicPosts}
                                                    setTopicNextPosts={this.props.setTopicNextPosts}
                                                    onReadMore = {this.props.onReadMore}
                                                    blog ={this.props.blog}
                                                    color={this.props.color}
                                                    blogs={this.props.blogs}
                                                    resetNav={this.resetNav}
                                                />
                                                <div style={{ float: 'left', margin: '2em 3em 3em 2em'}}>
                                                    <Header
                                                        style={{marginLeft:'10px'}}
                                                        color='blue' as='h3'>Search for it
                                                    </Header>
                                                    <Input
                                                        icon={<Icon name='search' inverted circular link />}
                                                        placeholder='Search...'
                                                        onChange={this.props.handleFilterChange}
                                                    />

                                                    <Header
                                                        color={this.props.colors[2]} as='h2'>Most Popular</Header>
                                                    {
                                                        this.props.blogsLoaded?
                                                            <div>
                                                                <br/>
                                                                {
                                                                    <button
                                                                        disabled={!this.state.next}
                                                                        className="topicButton"
                                                                        onClick={ this.setNextBlogs.bind(this,'next')}
                                                                        name="next"
                                                                        style={{backgroundColor:'transparent',border:'none'} }>
                                                                <span>
                                                                    Next
                                                                </span>
                                                                        </button>

                                                                    }
                                                                    {
                                                                        <button
                                                                            disabled={x===0}
                                                                            className="topicButton"
                                                                            onClick={ this.setPreviousBlogs.bind(this,'previous')}
                                                                            name="previous"
                                                                            style={{float:"right",backgroundColor:'transparent',border:'none'} }>
                                                                <span>
                                                                    Previous
                                                                </span>
                                                                        </button>
                                                                    }
                                                                    {
                                                                        (this.props.blogs[0]) ?
                                                                            <Blogs
                                                                                color={this.props.color}
                                                                                onReadMore = {this.props.onReadMore}
                                                                                blogs ={this.props.blogs}
                                                                                blog ={this.props.blog}/>:
                                                                            <div>
                                                                                No matching content on this Topic
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
                                    <Grid.Column mobile = {window.innerWidth<600?16:9} computer={window.innerWidth<600?16:9}  width={9}>
                                        {
                                            window.innerWidth<600?
                                                <Topics
                                                    blogsAreLoading={this.props.blogsAreLoading}
                                                    setTopicPosts={this.props.setTopicPosts}
                                                    setTopicNextPosts={this.props.setTopicNextPosts}
                                                    onReadMore = {this.props.onReadMore}
                                                    blog ={this.props.blog}
                                                    color={this.props.color}
                                                    blogs={this.props.blogs}/>:
                                                <div>
                                                </div>
                                        }
                                        {

                                            this.state.blogIsLoading?
                                                <div style={{ left: '50%', position: 'fixed', bottom: '50%', zIndex: -1 }}>
                                                    <Loader active inline='centered' />
                                                </div>:
                                                <div>
                                                    <WelcomePage
                                                        richViewerState={this.props.richViewerState}
                                                        color={this.props.colors[1]}
                                                        blogDetails={this.props.blogDetails}
                                                        blog={this.props.blog}
                                                        blogs={this.props.blogs}
                                                        blogLoaded={this.props.blogLoaded}/>
                                                </div>
                                        }
                                    </Grid.Column>
                                    {
                                        (window.innerWidth>1030) ?
                                            <Grid.Column  width={3}>
                                                {/*<TwitterProf/>*/}
                                            </Grid.Column>:
                                            <div>

                                            </div>
                                    }
                                </Grid.Row>
                            </Grid>
                        </div>:
                        <div style={{ left: '50%', position: 'fixed', bottom: '50%', zIndex: -1 }}>
                            <Loader active inline='centered' />
                        </div>
                }
            </div>)
    }
}
export default PagesComponent