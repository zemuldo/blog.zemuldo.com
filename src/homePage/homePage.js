import _ from 'lodash'
import React,{Component} from 'react'
import { Container, Header, Icon,  List, Menu , Button , Popup , Grid,Dropdown ,Loader,Segment} from 'semantic-ui-react'
import axios from 'axios';

class HomePage extends Component {
    constructor(props){
        super(props);
        this.state = {
            blogs:this.handleData(),
            blog:{},
            logged:false,
            isLoaded: false
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

        return axios.get('http://localhost:8090/posts/'+ thisBlog.type +'/'+thisBlog.title, {
        })
            .then(response => {
                console.log(response)
                this.setState({blog:response.data})
                this.isLoading(true)
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
        return Promise.all([axios.get('http://localhost:8090/all', {}),axios.get('http://localhost:8090/posts/business/How to keep your Customers', {})])
            .then(response => {
                this.setState({blogs:response[0].data,blog:response[1].data})
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
                    (this.state.isLoaded) ? <div>
                            <div style={{ float: 'right', margin: '0em 3em 1em 0em'}}>

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
                            {
                                (window.innerWidth>800) ? <div style={{ float: 'left', margin: '2em 3em 3em 2em' , width:250}}>
                                        <Header color='green' as='h2'>Most Popular</Header>
                                        <List>
                                            { _.times(this.state.blogs.length, i => <List.Item >
                                                <List.Icon name='leaf' />
                                                <List.Content><Header color='green' as='h3'>{(this.state.blogs[i].title.length>21) ? this.state.blogs[i].title.slice(0,22)+'.....' : this.state.blogs[i].title}</Header></List.Content>
                                                <List.Content>Author: {this.state.blogs[i].author}</List.Content>
                                                <List.Content>Likes {i}</List.Content>
                                                <Button ref={this.state.blogs[i].title} onClick={() => { this.onReadMore(this.state.blogs[i]) }}  content='Read Full Content' color='green'/>
                                                <hr/>
                                            </List.Item>)
                                            }
                                        </List>
                                        <a onClick={this.goToHome}><Header color='orange' as='h4'>See All</Header></a>
                                    </div> :
                                    <div style={{ float: 'left', margin: '0em 3em 3em 2em' , width:250}}>
                                        <Dropdown item text='Popular Posts'>
                                            <Dropdown.Menu>
                                                { _.times(this.state.blogs.length, i => <Dropdown.Item>
                                                    <List.Icon name='leaf' />
                                                    <List.Content><Header color='green' as='h3'>{(this.state.blogs[i].title>21) ? this.state.blogs[i].title.slice(0,22)+'.....' : this.state.blogs[i].title}</Header></List.Content>
                                                    <List.Content>Author: {this.state.blogs[i].author}</List.Content>
                                                    <List.Content>Likes {i}</List.Content>
                                                    <Button onClick={() => { this.onReadMore(this.state.blogs[i]) }}  content='Read Full Content' color='green'/>
                                                    <hr/>
                                                </Dropdown.Item>)
                                                }
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                            }
                            <Container text style={{ marginTop: '2em' }}>
                                <Header color='green' as='h1'>{
                                    this.state.blog.title
                                }</Header>
                                <p>
                                    Published on {new Date().toDateString()} by {this.state.blog.author}
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

                        </div>:
                        <div   style={ {height:window.innerHeight,margin: '20em 3em 1em 0em'}}>
                            <Loader active inline='centered' />
                        </div>
                }
            </div>)
    }
}
export default HomePage