import React, { Component } from 'react'
import {  Header,Loader,List,Icon } from 'semantic-ui-react'
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
                                            <List size="tiny" icon='labeled' horizontal color='green'>
                                                <List.Item>
                                                    <Icon color='blue' name='twitter' />
                                                </List.Item>

                                                <List.Item >
                                                    <Icon color='violet' name='facebook' />
                                                </List.Item>

                                                <List.Item>
                                                    <Icon color='blue' name='linkedin' />
                                                </List.Item>
                                                <List.Item>
                                                    <Icon color='orange' name='google plus official' />
                                                </List.Item>
                                                <List.Item>
                                                    <Icon color='red' name='mail' />
                                                </List.Item>
                                            </List>
                                            <br/>
                                            Published on:  {this.props.blog.date}  By {this.props.blog.author}
                                        </div>
                                        <hr color="green"/>
                                        <div style={{margin: '2em 1em 3em 1em',fontSize:"16px",fontFamily:"georgia", padding: '0em 3em 2em 1em'}}>
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
