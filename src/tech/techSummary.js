import _ from 'lodash'
import React,{Component} from 'react'
import { Header, Icon,  List , Button  , Grid ,Loader,Input} from 'semantic-ui-react'
import axios from 'axios';
import About from '../partials/aboutHome'
import Blogs from '../partials/blogs'
import Blog from '../partials/blog'
import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'
class TechSummary extends Component {
    constructor(props){
        super(props);
        this.state = {
            blogs:[],
            blog:null,
            logged:false,
            isLoaded: false,
            blogIsLoading:false,
            bodySize:(window.innerWidth<503)?16:12
        };
        this.goToHome = this.goToHome.bind(this);
        this.onReadMore = this.onReadMore.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.handleData = this.handleData.bind(this);
        this.isLoading = this.isLoading.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this._handleChangeBodySize = this._handleChangeBodySize.bind(this);
        this.tick = this.tick.bind(this);
    };
    tick () {
        return Promise.all([axios.get(env.httpURL+'/posts/tech', {}),axios.get(env.httpURL+'/posts/tech/How to keep your Customers', {})])
            .then(response => {
                if(response[0].data[0]){
                    this.setState({blogs:response[0].data})
                }
            })
            .catch(exception => {

            });
    }
    onReadMore(thisBlog){
        this.setState({blogIsLoading:true})
        return axios.get(env.httpURL+'/posts/'+ thisBlog.type +'/'+thisBlog.title, {
        })
            .then(response => {
                this.setState({blog:response.data})
                this.isLoading(true)
                this.setState({blogIsLoading:false})
                window.scrollTo(0,0)
                return response
            })
            .catch(exception => {
                this.isLoading(true)
                return exception
            });
    }
    goToHome(){
        this.setState({current:'ZemuldO-Home'})
    }
    _handleChangeBodySize(size){
        this.setState({bodySize:size})
    }
    resize = () => this.forceUpdate()
    componentDidMount() {
        this.interval = setInterval(this.tick, 30000);
        this.forceUpdate()
        if(window.innerWidth<503){
            this._handleChangeBodySize(16)
        }
        if(window.innerWidth>503){
            this._handleChangeBodySize(16)
        }

        this.handleData()
        window.addEventListener('resize', this.resize)
        return Promise.all([axios.get(env.httpURL+'/posts/tech', {}),axios.get(env.httpURL+'/posts/tech/How to keep your Customers', {})])
            .then(response => {
                if(response[0].data[0]){
                    this.setState({blogs:response[0].data})
                }
            })
            .catch(exception => {

            });
    }
    componentWillUnmount() {
        clearInterval(this.interval);
        window.removeEventListener('resize', this.resize)
    }
    isLoading(value){
        this.setState({ isLoaded: value });
    };
    handleData(){
        return Promise.all([axios.get(env.httpURL+'/posts/tech', {}),axios.get(env.httpURL+'/posts/tech/How to keep your Customers', {})])
            .then(response => {
                if(response[0].data[0]){
                    this.setState({blogs:response[0].data,blog:response[0].data[0]})
                }
                else {
                    this.setState({blogs:[],blog:null})
                }
                this.isLoading(true)
                return response[0].data
            })
            .catch(exception => {
                this.setState({blogs:[],blog:null})
                this.isLoading(true)
                return exception
            });
    };

    handleFilterChange(e) {
        //e.preventDefault();
        if(e.target.value===''){
            return axios.get(env.httpURL+'/post/tech', {})
                .then(response => {
                    this.setState({blogs:response.data})
                })
                .catch(exception => {
                });
        }
        else {
            return axios.get(env.httpURL+'/filter/'+e.target.value, {})
                .then(response => {
                    this.setState({blogs:response.data})
                })
                .catch(exception => {
                    this.setState({blogs:[]})
                });
        }
    }
    render(){
        return(
            <div>
                {
                    (this.state.isLoaded) ?
                        <div>
                            {
                                (window.innerWidth>503) ?
                                    <Grid columns={2} divided>
                                        <Grid.Row>
                                            {
                                                (window.innerWidth>600) ?
                                                    <Grid.Column  width={4}>
                                                        <div style={{ float: 'left', margin: '2em 3em 3em 2em'}}>
                                                            <Input
                                                                icon={<Icon name='search' inverted circular link />}
                                                                placeholder='Search...'
                                                                onChange={this.handleFilterChange}
                                                            />
                                                            <Header color={this.props.colors[0]} as='h2'>Popular in Tech</Header>
                                                            <List>
                                                                {
                                                                    (this.state.blogs[0]) ?
                                                                        <Blogs color={this.props.color} onReadMore = {this.onReadMore} blogs ={this.state.blogs} blog ={this.state.blog}/>:
                                                                        <div>
                                                                            No matching data
                                                                        </div>
                                                                }
                                                            </List>
                                                            <a onClick={this.goToHome}><Header color='orange' as='h4'>More</Header></a>
                                                        </div>
                                                    </Grid.Column>:
                                                    <p>Hello</p>

                                            }
                                            <Grid.Column  width={10}>
                                                {
                                                    (this.state.blogIsLoading) ?
                                                        <div style={{ position:'center', margin: '16em 2em 2em 2em'}}>
                                                            <Loader active inline='centered' />
                                                        </div>:
                                                        <div style={{margin: '3em 3em 3em 1em'}}>
                                                            {
                                                                (this.state.blog===null) ?
                                                                    <About/>:
                                                                    <Blog color={this.props.color} blog = {this.state.blog}/>
                                                            }
                                                        </div>
                                                }
                                            </Grid.Column>
                                            {
                                                (window.innerWidth>1030) ?
                                                    <Grid.Column  width={2}>


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
                                                        <div style={{ float: 'left', margin: '2em 3em 3em 2em'}}>
                                                            <Input
                                                                icon={<Icon name='search' inverted circular link />}
                                                                placeholder='Search...'
                                                                onChange={this.handleFilterChange}
                                                            />
                                                            <Header color={this.props.color} as='h2'>Most Popular</Header>
                                                            <List>
                                                                {
                                                                    (this.state.blogs[0]) ?
                                                                        <Blogs color={this.props.color} onReadMore = {this.onReadMore} blogs ={this.state.blogs} blog ={this.state.blog}/>:
                                                                        <div>
                                                                            No matching data
                                                                        </div>
                                                                }
                                                            </List>
                                                            <a onClick={this.goToHome}><Header color='orange' as='h4'>More</Header></a>
                                                        </div>
                                                    </Grid.Column>:
                                                    <p>Hello</p>

                                            }
                                            <Grid.Column  width={16}>
                                                {
                                                    (this.state.blogIsLoading) ?
                                                        <div style={{ position:'center', margin: '16em 2em 2em 2em'}}>
                                                            <Loader active inline='centered' />
                                                        </div>:
                                                        <div style={{margin: '3em 1em 3em 2em'}}>
                                                            {
                                                                (this.state.blog===null) ?
                                                                    <About/>:
                                                                    <Blog color={this.props.color} blog = {this.state.blog}/>
                                                            }
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
export default TechSummary