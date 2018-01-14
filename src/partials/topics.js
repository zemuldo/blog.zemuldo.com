import React from 'react'
import {Header} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import _ from 'lodash'
import util from '../util'
import {topics} from '../environments/conf'
import {bindActionCreators} from 'redux'
import * as VarsActions from '../store/actions/vars'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

class Topics extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  };
  render () {
    return (
      <div className='topicsWrapper'>
        <Header color='blue' as='h3'>Topics</Header>
        <Link to={'/' + this.props.vars.currentLocation + '/all'}>
          <button
            disabled={this.props.vars.topic === 'all' || !window.location.pathname.split('/')[2]}
            className='topicButton'
            onClick={() => this.props.varsActions.updateVars({topic: 'all'})}
            name='all'
                    >
            <span>
              {'All |'}
            </span>
          </button>
        </Link>
        {_.times(topics.length, i =>
          <Link key={topics[i].key} to={'/' + this.props.vars.currentLocation + '/' + topics[i].name}>
            <button
              disabled={this.props.vars.topic === topics[i].name}
              className='topicButton'
              onClick={() => this.props.varsActions.updateVars({topic: topics[i].text})}
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
    blogs: state.blogs,
    vars: state.vars
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    varsActions: bindActionCreators(VarsActions, dispatch)
  }
}

Topics.propTypes = {
  vars: PropTypes.object.isRequired,
  varsActions: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Topics)
