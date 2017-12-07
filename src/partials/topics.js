import React, { Component } from 'react';
import { Header} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import _ from 'lodash'
import util from '../util'
import {topics} from '../environments/conf'

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
                <Link to = {'/'+this.props.currentLocation+'/'+'all'}>
                <button
                    disabled={window.location.pathname.split('/')[2]==='all' || !window.location.pathname.split('/')[2]}
                    className="topicButton"
                    onClick={ this.props.onAllcClick.bind(this,'all')}
                    name='all'
                >
                            <span>
                                {'All '+ '|'}
                            </span>
                </button>
                </Link>
                { _.times(topics.length, i =>
                    <Link key={topics[i].key} to ={'/'+this.props.currentLocation+'/'+topics[i].name}>
                    <button
                        disabled={window.location.pathname.split('/')[2]===topics[i].name}
                        className="topicButton"
                        onClick={ this.props.onTopicClick.bind(this,topics[i].text)}
                        name={topics[i].name}
                    >
                            <span>
                                {util.toTitleCase(topics[i].name)}
                                {' '+ '|'}
                            </span>
                    </button>
                    </Link>
                )
                }
            </div>
        )
    }
}


export default Topics;
