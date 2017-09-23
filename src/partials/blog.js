import React, { Component } from 'react';
import { Icon,List,Header} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'
class Blog extends Component {
    constructor(props){
        super(props);
        this.state = {

        };

    };
    render() {
        return (
            <div>
                <Header style={{}} color='green' as='h1'>
                    {
                        this.props.blog.title
                    }
                </Header>
                <div style={{}}>
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
                <div style={{margin: '3em 1em 3em 2em'}}>
                    <p>
                        {
                            this.props.blog.body
                        }
                    </p>
                </div>

            </div>
        )
    }
}
export default Blog;
