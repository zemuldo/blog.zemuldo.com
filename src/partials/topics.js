import React, { Component } from 'react';
import { Header} from 'semantic-ui-react'
import _ from 'lodash'
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
let x =5
const topics = [
    { key: 'bigdata', value: 'bigdata', text: 'bigdata', name: 'bigdata'},
    { key: 'iot', value: 'iot', text: 'iot' ,name: 'iot'},
    { key: 'ml', value: 'ml', text: 'ml' ,name: 'ml'},
    { key: 'ai', value: 'ai', text: 'ai' ,name: 'ai'},
    { key: 'python', value: 'python', text: 'python' ,name: 'python'},
    { key: 'javascript', value: 'javascript', text: 'javascript' ,name: 'javascript'},
    { key: 'r', value: 'r', text: 'r' ,name: 'r'},
    { key: 'marketing', value: 'marketing', text: 'marketing' ,name: 'marketing'},
    { key: 'fintech', value: 'fintech', text: 'fintech' ,name: 'fintech'},
    { key: 'startup', value: 'startup', text: 'startup' ,name: 'startup'},
    { key: 'bot', value: 'bot', text: 'bot' ,name: 'bot'},
    { key: 'linux', value: 'linux', text: 'linux' ,name: 'linux'},
    { key: 'go', value: 'go', text: 'go' ,name: 'go'},
    { key: 'growthhack', value: 'growthhack', text: 'growthhack' ,name: 'growthhack'},
    { key: 'cloud', value: 'cloud', text: 'cloud' ,name: 'cloud'},
    { key: 'nodejs', value: 'nodejs', text: 'nodejs' ,name: 'nodejs'},
    { key: 'express', value: 'express', text: 'express' ,name: 'express'},
    { key: 'mongodb', value: 'mongodb', text: 'mongodb' ,name: 'mongodb'},
    { key: 'sql', value: 'sql', text: 'sql' ,name: 'sql'},
    { key: 'adf', value: 'adf', text: 'adf' ,name: 'adf'},
    { key: 'git', value: 'git', text: 'git' ,name: 'git'},
    { key: 'react', value: 'react', text: 'react' ,name: 'react'},
    { key: 'ui', value: 'ui', text: 'ui' ,name: 'ui'},
    { key: 'ux', value: 'ux', text: 'ux' ,name: 'ux'},
    { key: 'angular', value: 'angular', text: 'angular' ,name: 'angular'},
    { key: 'e-commerce', value: 'e-commerce', text: 'e-commerce' ,name: 'e-commerce'},
    { key: 'code', value: 'code', text: 'code' ,name: 'code'},
    { key: 'programming', value: 'programming', text: 'programming' ,name: 'programming'},
    { key: 'wearables', value: 'wearables', text: 'wearables' ,name: 'wearables'},
    { key: 'laptops', value: 'laptops', text: 'laptops' ,name: 'laptops'},
    { key: 'phones', value: 'phones', text: 'phones' ,name: 'phones'},
    { key: 'hadoop', value: 'hadoop', text: 'hadoop' ,name: 'hadoop'},
    { key: 'servers', value: 'servers', text: 'servers' ,name: 'servers'},
    { key: 'analytics', value: 'analytics', text: 'analytics' ,name: 'analytics'},
    { key: 'devops', value: 'devops', text: 'devops' ,name: 'devops'},
    { key: 'datascience', value: 'datascience', text: 'datascience' ,name: 'datascience'},
    { key: 'seo', value: 'seo', text: 'seo' ,name: 'seo'},
    { key: 'html-css', value: 'html-css', text: 'html-css' ,name: 'html-css'},
    { key: 'oracle', value: 'oracle', text: 'oracle' ,name: 'oracle'},
    { key: 'pentesting', value: 'pentesting', text: 'pentesting' ,name: 'pentesting'},
    { key: 'java', value: 'java', text: 'java' ,name: 'java'},
    { key: 'security', value: 'security', text: 'security' ,name: 'security'}
];
class Topics extends Component {
    constructor(props){
        super(props);
        this.state = {
        };
    };
    render() {
        return (
            <div  style={{color:'blue',textAlign:'centre',margin:'2em 0em 0em 1em'}}>
                <Header style={{marginLeft:'10px'}} color='blue' as='h3'>Topics</Header>
                <button
                    disabled={this.props.topic==='all'}
                    className="topicButton"
                    onClick={ this.props.onAllcClick.bind('all')}
                    name='all'
                    style={{cursor:'pointer',backgroundColor:'transparent',border:'none'} }
                >
                            <span>
                                {'All '+ '|'}
                            </span>
                </button>
                { _.times(topics.length, i =>
                    <button
                        disabled={this.props.topic===topics[i].name}
                        key={topics[i].key}
                        className="topicButton"
                        onClick={ this.props.onTopicClick.bind(this,topics[i].text)}
                        name={topics[i].name}
                        style={{cursor:'pointer',backgroundColor:'transparent',border:'none'} }
                    >
                            <span>
                                {toTitleCase(topics[i].name)}
                                {' '+ '|'}
                            </span>
                    </button>
                )
                }
            </div>
        )
    }
}
export default Topics;
