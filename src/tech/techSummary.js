import _ from 'lodash'
import React,{Component} from 'react'
import { Container,Header, Icon, List, Menu,Button,Dropdown, Loader } from 'semantic-ui-react'
import axios from 'axios';

const blogs = {
    'What is BlockChain?': {
        title: 'What is BlockChain?',
        author: 'Danstan',
        body: 'This example shows how to use lazy loaded images, a sticky menu, and a simple text container' +
        'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. ' +
        'Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit ' +
        'amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit ' +
        'amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare ' +
        'sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus ' +
        'lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id ' +
        'cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat.' +
        ' Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus'
    },
    "What is DeepLearning?":{
        title:'What is DeepLearning?',
        author: 'Danstan',
        body:
        'This example shows how to use lazy loaded images, a sticky menu, and a simple text container' +
        'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. ' +
        'Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit ' +
        'amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit ' +
        'amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare ' +
        'sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus ' +
        'lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id ' +
        'cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat.' +
        ' Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus'
    }
    ,
    "What is MachineLearning?":{
        title:'What is MachineLearning?',
        author:'Danstan',
        body:
        'This example shows how to use lazy loaded images, a sticky menu, and a simple text container' +
        'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. ' +
        'Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit ' +
        'amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit ' +
        'amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare ' +
        'sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus ' +
        'lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id ' +
        'cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat.' +
        ' Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus'
    }
    ,
    'What is BigData?':{
        title:'What is BigData?',
        author:'Danstan',
        body:'This example shows how to use lazy loaded images, a sticky menu, and a simple text container' +
        'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. ' +
        'Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit ' +
        'amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit ' +
        'amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare ' +
        'sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus ' +
        'lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id ' +
        'cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat.' +
        ' Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus'
    }
}
class TechSummary extends Component {
    constructor(props){
        super(props);
        this.state = {
            blogs:this.handleData(),
            blog:blogs[Object.keys(blogs)[0]],
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
        this.setState({blog:thisBlog})
        window.scrollTo(0, 0)
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
        return axios.get('http://localhost:8090/posts/tech', {
        })
            .then(response => {
                this.setState({blogs:response.data})
                this.isLoading(true)
                return response
            })
            .catch(exception => {
                this.isLoading(true)
                return exception
            });
    };
    handleCurrentBlog(){
        return axios.get('http://localhost:8090/posts/tech', {
        })
            .then(response => {
                this.setState({blogs:response.data})
                this.isLoading(true)
                return response
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
                                        <Header color='green' as='h2'>Popular on Tech</Header>
                                        <List>
                                            <List.Item >
                                                <List.Icon name='leaf' />
                                                <List.Content><Header color='green' as='h3'>{(this.state.blogs[0].title.length>21) ? this.state.blogs[0].title.slice(0,22)+'.....' : this.state.blogs[0].title}</Header></List.Content>
                                                <List.Content>{this.state.blogs[0].body.slice(0,140)+'......'}</List.Content>
                                                <List.Content>Author: {this.state.blogs[0].author}</List.Content>
                                                <List.Content>Likes {0}</List.Content>
                                                <Button onClick={() => { this.onReadMore(this.state.blogs[0]) }}  content='Read Full Content' color='green'/>
                                                <hr/>
                                            </List.Item>
                                            <List.Item>
                                                <List.Icon name='leaf' />
                                                <List.Content><Header color='green' as='h3'>{(this.state.blogs[1].title.length>21) ? this.state.blogs[1].title.slice(0,22)+'.....' : this.state.blogs[1].title}</Header></List.Content>
                                                <List.Content>{this.state.blogs[1].body.slice(0,140)+'......'}</List.Content>
                                                <List.Content>Author: {this.state.blogs[1].author}</List.Content>
                                                <List.Content>Likes {1}</List.Content>
                                                <Button onClick={() => { this.onReadMore(this.state.blogs[1]) }}  content='Read Full Content' color='green'/>
                                                <hr/>
                                            </List.Item>
                                            <List.Item>
                                                <List.Icon name='leaf' />
                                                <List.Content><Header color='green' as='h3'>{(this.state.blogs[0].title.length>21) ? this.state.blogs[0].title.slice(0,22)+'.....' : this.state.blogs[0].title}</Header></List.Content>
                                                <List.Content>{this.state.blogs[0].body.slice(0,140)+'......'}</List.Content>
                                                <List.Content>Author: {this.state.blogs[0].author}</List.Content>
                                                <List.Content>Likes {0}</List.Content>
                                                <Button onClick={() => { this.onReadMore(this.state.blogs[0]) }}  content='Read Full Content' color='green'/>
                                                <hr/>
                                            </List.Item>
                                            <List.Item>
                                                <List.Icon name='leaf' />
                                                <List.Content><Header color='green' as='h3'>{(this.state.blogs[0].title.length>21) ? this.state.blogs[0].title.slice(0,22)+'.....' : this.state.blogs[0].title}</Header></List.Content>
                                                <List.Content>{this.state.blogs[0].body.slice(0,140)+'......'}</List.Content>
                                                <List.Content>Author: {this.state.blogs[0].author}</List.Content>
                                                <List.Content>Likes {0}</List.Content>
                                                <Button onClick={() => { this.onReadMore(this.state.blogs[0]) }}  content='Read Full Content' color='green'/>
                                                <hr/>
                                            </List.Item>
                                        </List>
                                        <a onClick={this.goToHome}><Header color='orange' as='h4'>See All</Header></a>
                                    </div> :
                                    <div style={{ float: 'left', margin: '0em 3em 3em 2em' , width:250}}>
                                        <Dropdown item text='Popular Posts'>
                                            <Dropdown.Menu>
                                                <Dropdown.Item>
                                                    <List.Icon name='leaf' />
                                                    <List.Content><Header color='green' as='h3'>{(blogs[Object.keys(blogs)[0]].title>21) ? blogs[Object.keys(blogs)[1]].title.slice(0,22)+'.....' : blogs[Object.keys(blogs)[1]].title}</Header></List.Content>
                                                    <List.Content>Author: {blogs[Object.keys(blogs)[0]].author}</List.Content>
                                                    <List.Content>Likes {0}</List.Content>
                                                    <Button onClick={() => { this.onReadMore(blogs[Object.keys(blogs)[0]]) }}  content='Read Full Content' color='green'/>
                                                    <hr/>
                                                </Dropdown.Item>
                                                <Dropdown.Item>
                                                    <List.Icon name='leaf' />
                                                    <List.Content><Header color='green' as='h3'>{(blogs[Object.keys(blogs)[1]].title>21) ? blogs[Object.keys(blogs)[1]].title.slice(0,22)+'.....' : blogs[Object.keys(blogs)[1]].title}</Header></List.Content>
                                                    <List.Content>Author: {blogs[Object.keys(blogs)[1]].author}</List.Content>
                                                    <List.Content>Likes {1}</List.Content>
                                                    <Button onClick={() => { this.onReadMore(blogs[Object.keys(blogs)[1]]) }}  content='Read Full Content' color='green'/>

                                                </Dropdown.Item>
                                                <Dropdown.Item>
                                                    <List.Icon name='leaf' />
                                                    <List.Content><Header color='green' as='h3'>{(blogs[Object.keys(blogs)[2]].title>21) ? blogs[Object.keys(blogs)[2]].title.slice(0,22)+'.....' : blogs[Object.keys(blogs)[2]].title}</Header></List.Content>
                                                    <List.Content>Author: {blogs[Object.keys(blogs)[2]].author}</List.Content>
                                                    <List.Content>Likes {2}</List.Content>
                                                    <Button onClick={() => { this.onReadMore(blogs[Object.keys(blogs)[2]]) }} content='Read Full Content' color='green'/>

                                                </Dropdown.Item>
                                                <Dropdown.Item>
                                                    <List.Icon name='leaf' />
                                                    <List.Content><Header color='green' as='h3'>{(blogs[Object.keys(blogs)[3]].title>21) ? blogs[Object.keys(blogs)[3]].title.slice(0,22)+'.....' : blogs[Object.keys(blogs)[3]].title}</Header></List.Content>
                                                    <List.Content>Author: {blogs[Object.keys(blogs)[3]].author}</List.Content>
                                                    <List.Content>Likes {3}</List.Content>
                                                    <Button onClick={() => { this.onReadMore(blogs[Object.keys(blogs)[3]]) }} content='Read Full Content' color='green'/>

                                                </Dropdown.Item>
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
                                <p>This example shows how to use lazy loaded images, a sticky menu, and a simple text container</p>
                            </Container>

                            <Container text >
                                { _.times(3, i => <p key={i}>
                                    {
                                        this.state.blog.body
                                    }
                                </p>) }
                            </Container>
                        </div>:
                        <div   style={ {height:window.innerHeight,margin: '20em 3em 1em 0em'}}>
                            <Loader active inline='centered' />
                        </div>
                }
            </div>)
    }
}
export default TechSummary