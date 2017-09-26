import React, { Component } from 'react';
import {  Menu, Button,Icon,Header,Modal} from 'semantic-ui-react'
import ReviewPortal from './portal'
/*import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'*/
class Topics extends Component {
    constructor(props){
        super(props);
        this.state = {
            modalOpen:false

        };

    };

    render() {
        return (
            <div  style={{color:'blue',textAlign:'centre',margin:'2em 0em 0em 0em'}}>
                <Header color='blue' as='h3'>Topics</Header>
                <button name="all" style={{backgroundColor:'transparent',border:'none'}}>All</button>
                <button name="bigdata" style={{backgroundColor:'transparent',border:'none'}}>BigData</button>
                <button name="business intelligence" style={{backgroundColor:'transparent',border:'none'}}>BI</button>
                <button name="iot" style={{backgroundColor:'transparent',border:'none'}}>IoT</button>
                <button name="ai" style={{backgroundColor:'transparent',border:'none'}}>AI</button>
                <button name="machine leaning" style={{backgroundColor:'transparent',border:'none'}}>ML</button>
                <button name="data science" style={{backgroundColor:'transparent',border:'none'}}>DataScience</button>
                <button name="startup" style={{backgroundColor:'transparent',border:'none'}}>StartUp</button>
                <button name="e-commerce" style={{backgroundColor:'transparent',border:'none'}}>E-Commerce</button>
                <button name="growth" style={{backgroundColor:'transparent',border:'none'}}>Growth</button>
                <button name="javascript" style={{backgroundColor:'transparent',border:'none'}}>JavaScript</button>
                <button name="node" style={{backgroundColor:'transparent',border:'none'}}>NodeJS</button>
                <button name="python" style={{backgroundColor:'transparent',border:'none'}}>Python</button>
                <button name="r" style={{backgroundColor:'transparent',border:'none'}}>R</button>
                <button name="seo" style={{backgroundColor:'transparent',border:'none'}}>SEO</button>
                <button name="devops" style={{backgroundColor:'transparent',border:'none'}}>DevOps</button>
                <button name="docker" style={{backgroundColor:'transparent',border:'none'}}>Docker</button>
                <button name="cloud" style={{backgroundColor:'transparent',border:'none'}}>Cloud-Computing</button>
                <button name="cdi" style={{backgroundColor:'transparent',border:'none'}}>CDI</button>
                <button name="analytics" style={{backgroundColor:'transparent',border:'none'}}>Analytics</button>
                <button name="marketing" style={{backgroundColor:'transparent',border:'none'}}>Marketing</button>
                <button name="java" style={{backgroundColor:'transparent',border:'none'}}>Java</button>
                <button name="linux" style={{backgroundColor:'transparent',border:'none'}}>Linux</button>
                <button name="servers" style={{backgroundColor:'transparent',border:'none'}}>Servers</button>
                <button name="hadoop" style={{backgroundColor:'transparent',border:'none'}}>Hadoop</button>
                <button name="mongodb" style={{backgroundColor:'transparent',border:'none'}}>MongoDB</button>
                <button name="sql" style={{backgroundColor:'transparent',border:'none'}}>SQL</button>
                <button name="development" style={{backgroundColor:'transparent',border:'none'}}>Web-Development</button>
                <button name="phones" style={{backgroundColor:'transparent',border:'none'}}>Phones</button>
                <button name="laptops" style={{backgroundColor:'transparent',border:'none'}}>Laptops</button>
                <button name="wearables" style={{backgroundColor:'transparent',border:'none'}}>Wearables</button>
            </div>
        )
    }
}
export default Topics;
