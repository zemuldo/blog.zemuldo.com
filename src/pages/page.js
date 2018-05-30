import React from 'react'
import { Loader } from 'semantic-ui-react'
import WelcomePage from './welCome'
import axios from 'axios'
import config from '../env'
import { pages } from '../env'
import { topicsOBJ } from '../env'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import BlogHeader from '../posts/blogHeader'

const env = config[process.env.NODE_ENV] || 'development'
let x = 0

class PagesComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      next: true,
      topic: 'all'
    }
  };

  _handleChangeBodySize(size) {
    this.setState({ bodySize: size })
  }

  resize = () => this.forceUpdate();

  componentDidMount() {
    window.addEventListener('resize', this.resize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  resetNav(queryMethod, topic) {
    this.setState({ queryMethod: queryMethod, topic: topic })
    x = 0
  }

  render() {
    return (
      <div>
        {

          !this.props.vars.blogLoaded
            ? <div >
              <div>
                {
                  this.props.vars.currentBlog ?
                    <BlogHeader navigateBlogs={this.props.navigateBlogs} /> : <p>Loading content..</p>
                }
              </div>
              <Loader active inline='centered' />
            </div>
            : <WelcomePage
              navigateBlogs={this.props.navigateBlogs}
              history={this.props.history}
              x={x}
              next={this.state.next}
              color={this.props.vars.colors[1]}
            />
        }
      </div>)
  }
}

const mapStateToProps = (state) => {
  return {
    vars: state.vars,
    blogs: state.blogs,
    blog: state.blog
  }
}

PagesComponent.propTypes = {
  vars: PropTypes.object,
}

export default connect(mapStateToProps)(PagesComponent)
