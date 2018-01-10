import React from 'react'
import {connect} from 'react-redux'
import UserBlogs from './userBlogs'
import PropTypes from 'prop-types'

class WelcomePage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.componentDidMount = this.componentDidMount.bind(this)
  }

  componentDidMount () {

  }

  render () {
    return (
      <div>
        {
                    this.props.blog.id
                      ? null
                      : <UserBlogs
                        color={this.props.vars.color}
                        />
                }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs,
    blog: state.blog,
    vars: state.vars
  }
}

WelcomePage.propTypes = {
  blog: PropTypes.object.isRequired,
  vars: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(WelcomePage)
