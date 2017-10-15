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
            homePageLoaded:false,
            blogsLoaded:false,
            blogLoaded:false,
            blogIsLoading:false,
            bodySize:(window.innerWidth<503)?16:12,
            fbC:null,
            twtC:null,
            gplsC:null,
            topic:null,
            richViewerState:null
        };
        this.goToHome = this.goToHome.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this._handleChangeBodySize = this._handleChangeBodySize.bind(this);

        this.blogsAreLoading = this.blogsAreLoading.bind(this);
        this.homePageIsLoading = this.homePageIsLoading.bind(this);
        this.blogIsLoading = this.blogIsLoading.bind(this);
        this.getBlogDetails = this.getBlogDetails.bind(this)
    };
    homePageIsLoading(value){
        this.setState({homePageLoaded:!value})
    }
    blogsAreLoading(state){
        this.setState({blogsLoaded:!state})
    }
    blogIsLoading(state){
        this.setState({blogLoaded:!state})
    }
    getBlogDetails(id){
        return axios.post(env.httpURL, {
            "queryMethod":"getPostDetails",
            "queryData":{
                "id":id
            }
        })
            .then(function (response) {
                if(response.data.error){
                }
                else {
                    this.setState({blogDetails:response.data,isHome:false});
                    this.setState({blogLoaded:true})
                    window.scrollTo(0,0);
                }

            }
            .bind(this))
            .catch(function (err) {
                console.log(err)
                this.setState({blogLoaded:true})
                return err
            }.bind(this));
    }
    goToHome(){
        this.setState({current:'ZemuldO-Home'})
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


    render(){
        return(
            <div>
                {
                    this.props.blogsLoaded && this.props.homePageLoaded ?
                        <div>
                            <Grid columns={2}>
                                <Grid.Row>
                                    {
                                        (window.innerWidth>600) ?
                                            <Grid.Column computer={4}>
                                                <Topics
                                                    blogsAreLoading={this.props.blogsAreLoading}
                                                    setTopicPosts={this.props.setTopicPosts}
                                                    onReadMore = {this.props.onReadMore}
                                                    blog ={this.props.blog}
                                                    color={this.props.color}
                                                    blogs={this.props.blogs}/>
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

                                            this.state.blogIsLoading?
                                                <div style={{ left: '50%', position: 'fixed', bottom: '50%', zIndex: -1 }}>
                                                    <Loader active inline='centered' />
                                                </div>:
                                                <div>
                                                    {
                                                        window.innerWidth<600?
                                                            <Topics
                                                                blogsAreLoading={this.props.blogsAreLoading}
                                                                setTopicPosts={this.props.setTopicPosts}
                                                                onReadMore = {this.props.onReadMore}
                                                                blog ={this.props.blog}
                                                                color={this.props.color}
                                                                blogs={this.props.blogs}/>:
                                                            <div>
                                                            </div>
                                                    }
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
export default HomePage