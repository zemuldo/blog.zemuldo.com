import React from 'react'
import {Card, Button, Header} from 'semantic-ui-react'
import {topicsOBJ} from '../conf/conf'
import PropTypes from 'prop-types'

const getTopiINfo = (topics) => {
  let info = []
  topics.forEach(function (topic) {
    info.push(topicsOBJ[topic].name)
  })
  return info
}

class GridBlog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showInfo: false
    }
  }

  render () {
    let o = this.props.blog
    return (
      <Card 
      onClick={()=>this.props.history.push('/' + o.type + '/' + o.topics[0] + '/' + o.userName + '-' + o.title.split(' ').join('-') + '-' + o.date.split(' ').join('-') + '-' + o.id.toString())}
      className='blogCard' style={{
        width: 'auto',
        maxWidth: '250px',
        minWidth: '100px',
      }}
            >
        <Card.Content>
          <Card.Header>
            <Header color='green' as='h3'>
              {o.title.split(' ').join(' ')}
            </Header>
          </Card.Header>
          <Card.Meta><p>Author: {o.author}</p>
                        Likes:
                <span>
                  <i style={{color: 'orange'}}>
                                                                ~{o.likes}
                  </i>
                </span>
            <hr color={this.props.color} />
          </Card.Meta>
          <Card.Description>
            <p>{o.about}</p>
            <p>
              <span className='colorGreen'>
              {Math.round((o.wordCount/130))} Minutes read
              </span>,
                  <br />
              Related to
                  <br />
              {getTopiINfo(o.topics).join(', ')}
              <br />
              Published on {o.date}
            </p>
              <Button
                  color={'green'}
                  className='redMoreButton'
                  ref={o._id}
                  name='all'
                  style={{ color: 'blue', border: 'none', bottom: '1%'}}
              >
                <span>Read More</span>
              </Button>
          </Card.Description>
        </Card.Content>
      </Card>
    )
  }
}

GridBlog.propTypes = {
  blog: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
}

export default GridBlog
