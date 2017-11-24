import React, { Component } from 'react';
import { Header} from 'semantic-ui-react'
import _ from 'lodash'
import {topics} from '../environments/conf'
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
class Topics extends Component {
    constructor(props){
        super(props);
        this.state = {
        };
    };
    render() {
        return (
            <div className='topicsWrapper'>
                <Header color='blue' as='h3'>Topics</Header>
                <button
                    disabled={window.location.pathname.split('/')[2]==='all'}
                    className="topicButton"
                    onClick={ this.props.onAllcClick.bind('all')}
                    name='all'

                >
                            <span>
                                {'All '+ '|'}
                            </span>
                </button>
                { _.times(topics.length, i =>
                    <button
                        disabled={window.location.pathname.split('/')[2]===topics[i].name}
                        key={topics[i].key}
                        className="topicButton"
                        onClick={ this.props.onTopicClick.bind(this,topics[i].text)}
                        name={topics[i].name}
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
