import React from 'react';
import {Header} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import _ from 'lodash'
import util from '../util'
import {topics} from '../environments/conf'
import {bindActionCreators} from "redux";
import * as VarsActions from "../state/actions/vars";
import {connect} from "react-redux";

class Topics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    render() {
        return (
            <div className='topicsWrapper'>
                <Header color='blue' as='h3'>Topics</Header>
                <Link to={'/' + this.props.currentLocation + '/all'}>
                    <button
                        disabled={this.props.vars.topic === 'all' || !window.location.pathname.split('/')[2]}
                        className="topicButton"
                        onClick={()=>this.props.varsActions.updateVars({topic: 'all'})}
                        name='all'
                    >
                            <span>
                                {'All |'}
                            </span>
                    </button>
                </Link>
                {_.times(topics.length, i =>
                    <Link key={topics[i].key} to={'/' + this.props.currentLocation + '/' + topics[i].name}>
                        <button
                            disabled={this.props.vars.topic === topics[i].name}
                            className="topicButton"
                            onClick={()=>this.props.varsActions.updateVars({topic: topics[i].text})}
                            name={topics[i].name}
                        >
                            <span>
                                {util.toTitleCase(topics[i].name)}
                                {' |'}
                            </span>
                        </button>
                    </Link>
                )
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        blog: state.blog,
        blogs: state.blogs,
        user: state.user,
        vars: state.vars
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        varsActions: bindActionCreators(VarsActions, dispatch)
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Topics)