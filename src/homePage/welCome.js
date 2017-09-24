import React, { Component } from 'react'
import { Button,Image, Header,Loader,List,Icon } from 'semantic-ui-react'
import ProfileBot from '../bots/profileBot'
import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'
export default class WelcomePage extends Component {
    constructor(props){
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
    }
    fbShare () {
        if(this.props.blog){
            let shareURL = 'https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fzemuldo.com%2F'+this.props.blog.title.split(' ').join('%2520')+"&amp;src=sdkpreparse'"
            window.open(shareURL, 'sharer', 'toolbar=0,status=0,width=548,height=325');

        }
    }
    tweetShare () {
        if(this.props.blog){
            let shareURL = 'https://twitter.com/intent/tweet?text='+this.props.blog.title.split(' ').join('%20')+'&url=http%3A%2F%2Fzemuldo.com/'+this.props.blog.title.split(' ').join('-')+'%2F'+'&via=zemuldo'
            window.open(shareURL, 'sharer', 'toolbar=0,status=0,width=548,height=325');

        }
    }

    render() {
        return (
            <div>
                {
                    (this.props.blogIsLoading) ?
                        <div style={{ position:'center', margin: '16em 2em 2em 2em'}}>
                            <Loader active inline='centered' />
                        </div>:
                        <div style={{margin: '3em 3em 3em 1em'}}>
                            {
                                (this.props.blog===null || !this.props.blog.title) ?
                                    <div >
                                        <Header style={{ textAlign :'left',alignment:'center'}} color='green' as='h1'>
                                            Welcome To ZemuldO.COM
                                        </Header>
                                        <hr color="green"/>
                                        <div style={{fontSize:"16px",fontFamily:"georgia", padding: '0em 3em 2em 1em'}}>
                                            <p>
                                                We share content on trending technologies like Artificial Intelligence and BlockChain.
                                                You are definitely in the right place. Here you acn get very good content on business, development
                                                and technology.
                                            </p>
                                            <p>
                                                We also offer Business and Tech Consultancy. If you are looking for ways to grow your business,
                                                We are the choice you are looking for. Reach us for insights and growth.
                                            </p>
                                        </div>

                                    </div>:
                                    <div>
                                        <Header style={{ textAlign :'left',alignment:'center'}} color='green' as='h1'>
                                            {
                                                this.props.blog.title
                                            }
                                        </Header>
                                        <div style={{display:'block',fontSize:"16px",fontFamily:"georgia"}}>
                                            Share:
                                            {'  '}
                                                <Button onClick={() => {this.tweetShare();}} circular color='twitter' icon='twitter' />
                                            {'  '}
                                                <Button onClick={() => {this.fbShare();}} circular color='facebook' icon='facebook' />
                                            {'  '}
                                                <Button onClick={() => {this.fbShare();}} circular color='linkedin' icon='linkedin' />
                                            {'  '}
                                                <Button onClick={() => {this.fbShare();}} circular color='google plus' icon='google plus' />
                                            <br/>
                                            <br/>
                                            Published on:  {this.props.blog.date}  By {this.props.blog.author}
                                        </div>
                                        <hr color="green"/>
                                        <div style={{margin: '2em 1em 3em 1em',fontSize:"16px",fontFamily:"georgia", padding: '0em 3em 2em 1em'}}>
                                            <Image width={1} size='big' shape='rounded' src='/img/blogs/blogs_pic.jpg' />
                                            <br/>
                                            <p>
                                                {
                                                    this.props.blog.body
                                                }
                                            </p>
                                        </div>

                                    </div>
                            }
                        </div>
                }
            </div>
        )
    }
}
