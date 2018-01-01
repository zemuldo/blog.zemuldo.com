import React from 'react';
import {Button,List,Header} from 'semantic-ui-react'
import _ from 'lodash'
import {Link} from 'react-router-dom'
import { connect } from "react-redux";

class Blogs extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.componentDidMount = this.componentDidMount.bind(this)
    };
    componentDidMount() {}
    render() {
        let o = this.props.blogs
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
                                        <Link to = {'/' + o[i].type + '/' + o[i].topics[0] + '/' + o[i].userName + '_' + o[i].title.split(' ').join('-') + '_' + o[i].date.split(' ').join('-') + '_' + o[i].id.toString()}>
                                            <Button
                                                className="redMoreButton"
                                                ref={this.props.blogs[i]._id}
                                                onClick={() => { this.props.onReadMore(this.props.blogs[i]) }}
                                                name="all"
                                                style={{color:'blue',backgroundColor:'transparent',border:'none'}}
                                            >
                                                <span>Read</span>
                                            </Button>
                                        </Link>
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
                                        <Link to = {'/' + o[i].type + '/' + o[i].topics[0] + '/' + o[i].userName + '_' + o[i].title.split(' ').join('-') + '_' + o[i].date.split(' ').join('-') + '_' + o[i].id.toString()}>
                                            <Button
                                                circular
                                                size="mini"
                                                disabled={!this.props.blog?false:this.props.blog._id===this.props.blogs[i]._id}
                                                className="redMoreButton"
                                                ref={this.props.blogs[i]._id}
                                                onClick={() => { this.props.onReadMore(this.props.blogs[i]) }}
                                                name="all"
                                                style={{color:'blue',backgroundColor:'transparent',border:'none'}}
                                            >
                                                <span>Read More</span>
                                            </Button>
                                        </Link>

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

const mapStateToProps = (state) => {
    return {
        blogs: state.blogs,
        blog:state.blog
    }
}

export default connect(mapStateToProps)(Blogs) ;
