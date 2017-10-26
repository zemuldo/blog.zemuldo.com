import React from 'react';
import {Button, Icon,List,Header} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import _ from 'lodash'
import axios from 'axios';
import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development';
class Blogs extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        };
        this.componentDidMount = this.componentDidMount.bind(this)

    };
    componentDidMount() {
    }

    render() {
        return (
            <div>
                {
                    (this.props.blogs.length>10) ?
                        <div>
                            { _.times(this.props.blogs.length, i =>
                                    <List.Item key={this.props.blogs[i]._id} >
                                        <List.Icon name='leaf' />
                                        <List.Content>
                                            <Header color='green' as='h3'>
                                                {this.props.blogs[i].title.split(' ').join(' ')}
                                                </Header>
                                        </List.Content>
                                        <List.Content>
                                            Author: {this.props.blogs[i].author}
                                            </List.Content>
                                        <span>
                                            Likes:
                                            <span>
                                                <i style={{color:'orange'}}>
                                                ~{this.props.blogs[i].likes}
                                                </i>
                                            </span>
                                        </span>
                                        <Button
                                            className="redMoreButton"
                                            ref={this.props.blogs[i]._id}
                                            onClick={() => { this.props.onReadMore(this.props.blogs[i]) }}
                                            name="all"
                                            style={{color:'blue',backgroundColor:'transparent',border:'none'}}
                                        >
                                            <span>Read</span>
                                        </Button>
                                        <hr/>
                                    </List.Item>
                                )
                            }
                        </div>
                        :
                        <div>
                            {
                                this.props.blogs.map((x, i) =>
                                    <List.Item key={this.props.blogs[i]._id}>
                                        <List.Icon name='leaf' />
                                        <List.Content>
                                            <Header color='green' as='h3'>
                                                {this.props.blogs[i].title.split(' ').join(' ')}
                                            </Header>
                                        </List.Content>
                                        <List.Content>
                                            Author: {this.props.blogs[i].author}
                                            </List.Content>
                                        <span >
                                            Likes:
                                        </span>
                                            <span>
                                                <i style={{color:'orange'}}>
                                                    {this.props.blogs[i].likes}
                                                </i>
                                            </span>
                                        <Button
                                            circular
                                            size="mini"
                                            disabled={!this.props.blog?false:this.props.blog._id===this.props.blogs[i].post_ID}
                                            className="redMoreButton"
                                            ref={this.props.blogs[i]._id}
                                            onClick={() => { this.props.onReadMore(this.props.blogs[i]) }}
                                            name="all"
                                            style={{color:'blue',backgroundColor:'transparent',border:'none'}}
                                        >
                                            <span>Read</span>
                                        </Button>
                                        <hr/>
                                    </List.Item>
                                )
                            }
                        </div>
                }
            </div>
        )
    }
}
export default Blogs;
