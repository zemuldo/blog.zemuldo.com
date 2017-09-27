import React, { Component } from 'react';
import { Header} from 'semantic-ui-react'
import ReviewPortal from './portal'
/*import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'*/
class Topics extends Component {
    constructor(props){
        super(props);
        this.state = {
            modalOpen:false,
            topicBlogs:null

        };

    };

    render() {
        return (
            <div>
                <div  style={{color:'blue',textAlign:'centre',margin:'2em 0em 0em 0em'}}>
                    <Header color='blue' as='h3'>Topics</Header>
                    <button className="topicButton"  name="all" style={{backgroundColor:'transparent',border:'none'} }><span>All</span> |</button>
                    <button className="topicButton"  name="bigdata" style={{backgroundColor:'transparent',border:'none'} }><span>BigData</span> |</button>
                    <button className="topicButton"  name="business intelligence" style={{backgroundColor:'transparent',border:'none'} }><span>BI</span> |</button>
                    <button className="topicButton"  name="iot" style={{backgroundColor:'transparent',border:'none'} }><span>IoT</span> |</button>
                    <button className="topicButton"  name="ai" style={{backgroundColor:'transparent',border:'none'} }><span>AI</span> |</button>
                    <button className="topicButton"  name="machine leaning" style={{backgroundColor:'transparent',border:'none'} }><span>ML</span> |</button>
                    <button className="topicButton"  name="data science" style={{backgroundColor:'transparent',border:'none'} }><span>DataScience</span> |</button>
                    <button className="topicButton"  name="startup" style={{backgroundColor:'transparent',border:'none'} }><span>StartUp</span> |</button>
                    <button className="topicButton"  name="e-commerce" style={{backgroundColor:'transparent',border:'none'} }><span>E-Commerce</span> |</button>
                    <button className="topicButton"  name="growth" style={{backgroundColor:'transparent',border:'none'} }><span>Growth</span> |</button>
                    <button className="topicButton"  name="javascript" style={{backgroundColor:'transparent',border:'none'} }><span>JavaScript</span> |</button>
                    <button className="topicButton"  name="node" style={{backgroundColor:'transparent',border:'none'} }><span>NodeJS</span> |</button>
                    <button className="topicButton"  name="python" style={{backgroundColor:'transparent',border:'none'} }><span>Python</span> |</button>
                    <button className="topicButton"  name="r" style={{backgroundColor:'transparent',border:'none'} }><span>R-Language</span> |</button>
                    <button className="topicButton"  name="seo" style={{backgroundColor:'transparent',border:'none'} }><span>SEO</span> |</button>
                    <button className="topicButton"  name="devops" style={{backgroundColor:'transparent',border:'none'} }><span>DevOps</span> |</button>
                    <button className="topicButton"  name="docker" style={{backgroundColor:'transparent',border:'none'} }><span>Docker</span> |</button>
                    <button className="topicButton"  name="cloud" style={{backgroundColor:'transparent',border:'none'} }><span>Cloud-Computing</span> |</button>
                    <button className="topicButton"  name="cdi" style={{backgroundColor:'transparent',border:'none'} }><span>CDI</span> |</button>
                    <button className="topicButton"  name="analytics" style={{backgroundColor:'transparent',border:'none'} }><span>Analytics</span> |</button>
                    <button className="topicButton"  name="marketing" style={{backgroundColor:'transparent',border:'none'} }><span>Marketing</span> |</button>
                    <button className="topicButton"  name="java" style={{backgroundColor:'transparent',border:'none'} }><span>Java</span> |</button>
                    <button className="topicButton"  name="linux" style={{backgroundColor:'transparent',border:'none'} }><span>Linux</span> |</button>
                    <button className="topicButton"  name="servers" style={{backgroundColor:'transparent',border:'none'} }><span>Servers</span> |</button>
                    <button className="topicButton"  name="hadoop" style={{backgroundColor:'transparent',border:'none'} }><span>Hadoop</span> |</button>
                    <button className="topicButton"  name="mongodb" style={{backgroundColor:'transparent',border:'none'} }><span>MongoDB</span> |</button>
                    <button className="topicButton"  name="sql" style={{backgroundColor:'transparent',border:'none'} }><span>SQL</span> |</button>
                    <button className="topicButton"  name="development" style={{backgroundColor:'transparent',border:'none'} }><span>Web-Development</span> |</button>
                    <button className="topicButton"  name="phones" style={{backgroundColor:'transparent',border:'none'} }><span>Phones</span> |</button>
                    <button className="topicButton"  name="laptops" style={{backgroundColor:'transparent',border:'none'} }><span>Laptops</span> |</button>
                    <button className="topicButton"  name="wearables" style={{backgroundColor:'transparent',border:'none'} }><span>Wearables</span> |</button>
                </div>
                <div>

                </div>
            </div>
        )
    }
}
export default Topics;
