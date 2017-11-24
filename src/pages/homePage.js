import React,{Component} from 'react'
import { Header, Icon,Button, Grid ,Loader,Input} from 'semantic-ui-react'
import WelcomePage from '../partials/welCome'
import Blogs from '../posts/blogs'
import Topics from '../partials/topics'
import axios from 'axios'
import TwitterProf from '../partials/twitterProf'
import config from '../environments/conf'
import {pages} from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'
let x =0
class PagesComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            next:true,
            topic:'all',
            queryMethod:'getPagedPosts',
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this._handleChangeBodySize = this._handleChangeBodySize.bind(this);
        this.setNextBlogs = this.setNextBlogs.bind(this)
        this.setPreviousBlogs = this.setPreviousBlogs.bind(this);
        this.resetNav = this.resetNav.bind(this);
        this.onTopicClick = this.onTopicClick.bind(this);
    };
    onTopicClick = (e) => {
        this.props.history.push('/'+this.props.current+'/'+e)
        this.props.setTopic(e)
    }
    onAllcClick = (e) => {
        this.props.history.push('/'+this.props.current+'/all')
        this.props.setTopic('all')
    }
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
        x+=5;
        if(this.state.next){
            return axios.post(env.httpURL,{
                "queryMethod":'getPagedPosts',
                "queryData":{
                    "start":x.toString(),
                    "topics":this.state.topic
                }
            })
                .then(function (blogs) {
                    if(blogs.data.length<5){
                        this.setState({next:false})
                    }
                    else {
                        this.setState({next:true})
                    }
                    if(blogs.data[0]){
                        this.props.setTopicNextPosts(blogs.data);
                    }
                    if(!blogs.data[0]){
                        x-=5;
                    }
                }.bind(this))
                .catch(function (err) {
                    this.props.setTopicNextPosts([])
                }.bind(this))
        }

    }
    setPreviousBlogs(e){
       if(x!==0){
           x-=5;
       }
        return axios.post(env.httpURL,{
            "queryMethod":'getPagedPosts',
            "queryData":{
                "start":x.toString(),
                "topics":this.state.topic

            }
        })
            .then(function (blogs) {
              if(blogs.data[0]){
                  this.setState({next:true})
                  this.props.setTopicNextPosts(blogs.data);
              }
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
                                                    topic={this.state.topic}
                                                    onTopicClick = {this.onTopicClick}
                                                    onAllcClick = {this.onAllcClick}
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
                                                                        (this.props.blogs[0]) ?
                                                                            <div>
                                                                                <Blogs
                                                                                    color={this.props.color}
                                                                                    onReadMore = {this.props.onReadMore}
                                                                                    blogs ={this.props.blogs}
                                                                                    blog ={this.props.blog}/>
                                                                                <div>
                                                                                    <br/>
                                                                                    <Button
                                                                                        color={this.props.color}
                                                                                        circular={true}
                                                                                        size='mini'
                                                                                        floated='left'
                                                                                        disabled={!this.state.next}
                                                                                        onClick={ this.setNextBlogs.bind(this,'next')}
                                                                                        name="next"
                                                                                    >
                                                                                        Next
                                                                                    </Button>
                                                                                    <Button
                                                                                        color={this.props.color}
                                                                                        circular={true}
                                                                                        size='mini'
                                                                                        floated='right'
                                                                                        disabled={x===0}
                                                                                        onClick={ this.setPreviousBlogs.bind(this,'previous')}
                                                                                        name="previous"
                                                                                    >
                                                                                        Prev
                                                                                    </Button>
                                                                                </div>
                                                                            </div>:
                                                                            <div>
                                                                                No matching content on this Topic
                                                                            </div>
                                                                    }
                                                            </div>:
                                                            <div className='small-loader' >
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
                                                    topic={this.state.topic}
                                                    onTopicClick = {this.onTopicClick}
                                                    onAllcClick = {this.onAllcClick}
                                                    blogsAreLoading={this.props.blogsAreLoading}
                                                    setTopicPosts={this.props.setTopicPosts}
                                                    setTopicNextPosts={this.props.setTopicNextPosts}
                                                    onReadMore = {this.props.onReadMore}
                                                    blog ={this.props.blog}
                                                    color={this.props.color}
                                                    blogs={this.props.blogs}
                                                    resetNav={this.resetNav}/>:
                                                <div>
                                                </div>
                                        }
                                        {

                                            !this.props.blogLoaded?
                                                <div className='margin-5050'>
                                                    <Loader active inline='centered' />
                                                </div>:
                                                <div>
                                                    <WelcomePage
                                                        richViewerState={this.props.richViewerState}
                                                        color={this.props.colors[1]}
                                                        blogDetails={this.props.blogDetails}
                                                        blog={this.props.blog}
                                                        blogs={this.props.blogs}
                                                        blogLoaded={this.props.blogLoaded}
                                                        deletedBlog={this.props.deletedBlog}
                                                        user={this.props.user}
                                                    />
                                                </div>
                                        }
                                    </Grid.Column>
                                    {
                                        (window.innerWidth>1030) ?
                                            <Grid.Column  width={3}>
                                                {<TwitterProf/>}
                                            </Grid.Column>:
                                            <div>

                                            </div>
                                    }
                                </Grid.Row>
                            </Grid>
                        </div>:
                        <div className='center-loader'>
                            <Loader active inline='centered' />
                        </div>
                }
            </div>)
    }
}
export default PagesComponent