import _ from 'lodash'
import React,{Component} from 'react'
import { Container, Header, Icon,  List, Menu , Button , Popup , Grid,Dropdown ,Loader,Segment,Image,Input} from 'semantic-ui-react'
import axios from 'axios';

class HomePage extends Component {
    constructor(props){
        super(props);
        this.state = {
            blogs:this.handleData(),
            blog:null,
            logged:false,
            isLoaded: false,
            blogIsLoading:false
        };
        this.goToHome = this.goToHome.bind(this);
        this.onReadMore = this.onReadMore.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.handleData = this.handleData.bind(this);
        this.isLoading = this.isLoading.bind(this);
    };
    onReadMore(thisBlog){
        this.setState({blogIsLoading:true})
        return axios.get('http://zemuldo.com:8090/posts/'+ thisBlog.type +'/'+thisBlog.title, {
        })
            .then(response => {
                console.log(response)
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
        this.setState({current:'Zemuldo Tech Blog and Articles'})
    }
    resize = () => this.forceUpdate()
    componentDidMount() {
        window.addEventListener('resize', this.resize)
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }
    isLoading(value){
        this.setState({ isLoaded: value });
    };
    handleData(){
        return Promise.all([axios.get('http://zemuldo.com:8090/all', {}),axios.get('http://zemuldo.com:8090/posts/business/How to keep your Customers', {})])
            .then(response => {
                this.setState({blogs:response[0].data})
                this.isLoading(true)
                return response[0].data
            })
            .catch(exception => {
                this.isLoading(true)
                return exception
            });
    };
    render(){
        return(
            <div>
                {
                    (this.state.isLoaded) ?
                        <div>
                            <Grid columns={3} divided>
                                <Grid.Row>
                                    {
                                        (window.innerWidth>800) ?
                                            <Grid.Column  width={4}>
                                                <div style={{ float: 'left', margin: '2em 3em 3em 2em' , width:250}}>
                                                    <Input
                                                        icon={<Icon name='search' inverted circular link />}
                                                        placeholder='Search...'
                                                    />
                                                    <Header color='green' as='h2'>Most Popular</Header>
                                                    <List>
                                                        { _.times(this.state.blogs.length, i => <List.Item >
                                                            <List.Icon name='leaf' />
                                                            <List.Content><Header color='green' as='h3'>{(this.state.blogs[i].title.length>21) ? this.state.blogs[i].title: this.state.blogs[i].title}</Header></List.Content>
                                                            <List.Content>Author: {this.state.blogs[i].author}</List.Content>
                                                            <List.Content>Likes {i}</List.Content>
                                                            <Button ref={this.state.blogs[i].title} onClick={() => { this.onReadMore(this.state.blogs[i]) }}  content='Read Full Content' color='green'/>
                                                            <hr/>
                                                        </List.Item>)
                                                        }
                                                    </List>
                                                    <a onClick={this.goToHome}><Header color='orange' as='h4'>More</Header></a>
                                                </div>
                                            </Grid.Column>:
                                            <div>

                                            </div>

                                    }
                                    <Grid.Column  width={10}>
                                        {
                                            (this.state.blogIsLoading) ?
                                                <div style={{ position:'center', margin: '20em 3em 1em 0em'}}>
                                                    <Loader active inline='centered' />
                                                </div>:
                                                <div>
                                                    {
                                                        (this.state.blog===null) ?
                                                            <div>
                                                                <Container text style={{ marginTop: '2em' }}>
                                                                    <Header style={{alignment:'center'}} color='green' as='h1'>
                                                                        Welcome To ZemuldO.COM
                                                                    </Header>
                                                                    <hr color="green"/>
                                                                    <p>
                                                                        We share content on trending technologies like Artificial Intelligence and BlockChain.
                                                                        You are definitely in the right place. Here you acn get very good content on business, development
                                                                        and technology.
                                                                    </p>
                                                                    <p>
                                                                        We also offer Business and Tech Consultancy. If you are looking for ways to grow your business,
                                                                        We are the choice you are looking for. Reach us for insights and growth.
                                                                    </p>
                                                                </Container>
                                                                <Container text >
                                                                    <p>

                                                                    </p>
                                                                </Container>

                                                        </div>:
                                                            <div>
                                                                <Container text style={{ marginTop: '2em' }}>
                                                                    <Header color='green' as='h1'>{
                                                                        this.state.blog.title
                                                                    }</Header>
                                                                    <p>
                                                                        Published on:  {this.state.blog.date}  By {this.state.blog.author}
                                                                    </p>
                                                                    <hr color="green"/>
                                                                </Container>
                                                                <Container text >
                                                                    <p>
                                                                        {
                                                                            this.state.blog.body
                                                                        }
                                                                    </p>
                                                                </Container>
                                                                <Container style={{ margin: '3em 0em 0em 0em'}} >

                                                                </Container>
                                                            </div>
                                                    }
                                                </div>
                                        }
                                    </Grid.Column>
                                    <Grid.Column  width={2}>
                                        <div style={{margin: '8em 3em 1em 3em'}}>
                                            <Menu icon='labeled' vertical color='green'>
                                                <Menu.Header>
                                                    <Menu.Item>
                                                        <Icon name="share" color='orange'/>
                                                        Share
                                                    </Menu.Item>
                                                </Menu.Header>
                                                <Menu.Item>
                                                    <Icon color='blue' name='twitter' />
                                                </Menu.Item>

                                                <Menu.Item >
                                                    <Icon color='violet' name='facebook' />
                                                </Menu.Item>

                                                <Menu.Item>
                                                    <Icon color='blue' name='linkedin' />
                                                </Menu.Item>
                                                <Menu.Item>
                                                    <Icon color='orange' name='google plus official' />
                                                </Menu.Item>
                                                <Menu.Item>
                                                    <Icon color='red' name='mail' />
                                                </Menu.Item>
                                            </Menu>
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>:
                        <div   style={ {height:window.innerHeight,margin: '20em 3em 1em 0em'}}>
                            <Loader active inline='centered' />
                        </div>
                }
            </div>)
    }
}
export default HomePage