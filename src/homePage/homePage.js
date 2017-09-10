import _ from 'lodash'
import React,{Component} from 'react'
import { Container, Divider, Dropdown, Grid, Header, Icon, Image, List, Menu, Segment,Button } from 'semantic-ui-react'

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

class HomePage extends Component {
    constructor(props){
        super(props);
        this.state = {
            blog:blogs[Object.keys(blogs)[0]],
            logged:false
        };
        this.onReadMore = this.onReadMore.bind(this);
    };

    onReadMore(thisBlog){
        console.log(thisBlog)
    }

    render(){
        return(
            <div>
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
                <div style={{ float: 'left', margin: '2em 3em 3em 2em' , width:250}}>
                    <Header color='green' as='h2'>Popular Reads</Header>
                    <List>
                        {_.times(Object.keys(blogs).length, i => <List.Item>
                            <List.Icon name='leaf' />
                            <List.Content><Header color='green' as='h3'>{(blogs[Object.keys(blogs)[i]].title>21) ? blogs[Object.keys(blogs)[i]].title.slice(0,22)+'.....' : blogs[Object.keys(blogs)[i]].title}</Header></List.Content>                            <List.Content>{blogs[Object.keys(blogs)[i]].body.slice(0,140)+'......'}</List.Content>
                            <List.Content>Author: {blogs[Object.keys(blogs)[i]].author}</List.Content>
                            <List.Content>Likes {i}</List.Content>
                            <Button onClick={this.onReadMore({})} content='Read Full Content' color='green'/>
                            <hr/>
                        </List.Item>)}
                    </List>
                   <a href="homePage.js"><Header color='orange' as='h4'>See All</Header></a>
                </div>
                <Container text style={{ marginTop: '2em' }}>
                    <Header color='green' as='h1'>{
                        blogs[Object.keys(blogs)[0]].title
                    }</Header>
                    <p>
                        Published on {new Date().toDateString()} by {' Zemuldo'}
                    </p>
                    <hr color="green"/>
                    <p>This example shows how to use lazy loaded images, a sticky menu, and a simple text container</p>
                </Container>

                <Container text >
                    { _.times(3, i => <p key={i}>
                        {
                            blogs[Object.keys(blogs)[i]].body
                        }
                    </p>) }
                </Container>
        </div>)
    }
}
export default HomePage