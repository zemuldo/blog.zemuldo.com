import React, { Component } from 'react';
import { Header} from 'semantic-ui-react'
import axios from 'axios'
import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'
class Topics extends Component {
    constructor(props){
        super(props);
        this.state = {
            modalOpen:false,
            topicBlogs:null

        };
        this.onTopicClick = this.onTopicClick.bind(this);
    };
    onTopicClick = (e) => {
        this.props.blogsAreLoading(true)
        return axios.post(env.httpURL,{
            "query":"getPostsTopic",
            "queryParam":{
                "topic":e
            }
        })
            .then(function (blogs) {
                this.setState({topicBlogs:blogs.data})
                if(this.props.setTopicPosts){
                    this.props.setTopicPosts(blogs.data,e)
                }
            }.bind(this))
            .catch(function (err) {
                this.props.setTopicPosts([],e)
            }.bind(this))
    }

    render() {
        return (
            <div>
                <div  style={{color:'blue',textAlign:'centre',margin:'2em 0em 0em 1em'}}>
                    <Header style={{marginLeft:'10px'}} color='blue' as='h3'>Topics</Header>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'bigdata')}  name="bigdata" style={{backgroundColor:'transparent',border:'none'} }><span>BigData</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'bi')}  name="bi" style={{backgroundColor:'transparent',border:'none'} }><span>BI</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'iot')}  name="iot" style={{backgroundColor:'transparent',border:'none'} }><span>IoT</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'ai')}  name="ai" style={{backgroundColor:'transparent',border:'none'} }><span>AI</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'ml')}  name="ml" style={{backgroundColor:'transparent',border:'none'} }><span>ML</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'datascience')}  name="datascience" style={{backgroundColor:'transparent',border:'none'} }><span>DataScience</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'startup')}  name="startup" style={{backgroundColor:'transparent',border:'none'} }><span>StartUp</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'e-commerce')}  name="e-commerce" style={{backgroundColor:'transparent',border:'none'} }><span>E-Commerce</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'growth')}  name="growth" style={{backgroundColor:'transparent',border:'none'} }><span>Growth</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'javascript')}  name="javascript" style={{backgroundColor:'transparent',border:'none'} }><span>JavaScript</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'node')}  name="node" style={{backgroundColor:'transparent',border:'none'} }><span>NodeJS</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'python')}  name="python" style={{backgroundColor:'transparent',border:'none'} }><span>Python</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'r')}  name="r" style={{backgroundColor:'transparent',border:'none'} }><span>R-Language</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'seo')}  name="seo" style={{backgroundColor:'transparent',border:'none'} }><span>SEO</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'devops')}  name="devops" style={{backgroundColor:'transparent',border:'none'} }><span>DevOps</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'docker')}  name="docker" style={{backgroundColor:'transparent',border:'none'} }><span>Docker</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'cloud')}  name="cloud" style={{backgroundColor:'transparent',border:'none'} }><span>Cloud-Computing</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'cdi')}  name="cdi" style={{backgroundColor:'transparent',border:'none'} }><span>CDI</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'analytics')}  name="analytics" style={{backgroundColor:'transparent',border:'none'} }><span>Analytics</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'marketing')}  name="marketing" style={{backgroundColor:'transparent',border:'none'} }><span>Marketing</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'java')}  name="java" style={{backgroundColor:'transparent',border:'none'} }><span>Java</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'linux')}  name="linux" style={{backgroundColor:'transparent',border:'none'} }><span>Linux</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'servers')}  name="servers" style={{backgroundColor:'transparent',border:'none'} }><span>Servers</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'hadoop')}  name="hadoop" style={{backgroundColor:'transparent',border:'none'} }><span>Hadoop</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'mongodb')}  name="mongodb" style={{backgroundColor:'transparent',border:'none'} }><span>MongoDB</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'sql')}  name="sql" style={{backgroundColor:'transparent',border:'none'} }><span>SQL</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'development')}  name="development" style={{backgroundColor:'transparent',border:'none'} }><span>Web-Development</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'phones')}  name="phones" style={{backgroundColor:'transparent',border:'none'} }><span>Phones</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'laptops')}  name="laptops" style={{backgroundColor:'transparent',border:'none'} }><span>Laptops</span> |</button>
                    <button className="topicButton" onClick={ this.onTopicClick.bind(this,'wearables')}  name="wearables" style={{backgroundColor:'transparent',border:'none'} }><span>Wearables</span> |</button>
                </div>
            </div>
        )
    }
}
export default Topics;
