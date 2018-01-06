import React from 'react'
import {Grid, Button, Header} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {topicsOBJ} from '../environments/conf'

const getTopiINfo = (topics)=>{
    let info = []
    topics.forEach(function (topic) {
        info.push(topicsOBJ[topic].full)
    })
    return info
}

class GridBlog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showInfo:false
        }
        this.someHandler=this.someHandler.bind(this)
        this.someOtherHandler=this.someOtherHandler.bind(this)
    }

    someHandler(o) {
        this.setState({showInfo:true})
    }

    someOtherHandler(o) {
        this.setState({showInfo:false})
    }

    render() {
        let o = this.props.blog
        return (
            <Grid.Column
                width={5}
                onMouseEnter={() => this.someHandler(o)}
                onMouseLeave={() => this.someOtherHandler(o)}>
                <Header color='green' as='h3'>
                    {o.title.split(' ').join(' ')}
                </Header>
                <p>Author: {o.author}</p>
                Likes:
                <span>
                    <i style={{color: 'orange'}}>
                    ~{o.likes}
                    </i>
                </span>
                <hr color={this.props.color}/>
                <p>{o.about}</p>
                {
                    this.state.showInfo?
                        <p>
                            15 Minutes read,
                            <br/>
                            Related to
                            <br/>
                            {getTopiINfo(o.topics).join(',')}
                            <br/>
                            Published on {o.date}
                        </p>:
                        null
                }
                <Link
                    to={'/' + o.type + '/' + o.topics[0] + '/' + o.userName + '_' + o.title.split(' ').join('-') + '_' + o.date.split(' ').join('-') + '_' + o.id.toString()}>
                    <Button
                        className="redMoreButton"
                        ref={o._id}
                        onClick={() => {
                            this.props.onReadMore(o)
                        }}
                        name="all"
                        style={{color: 'blue', border: 'none'}}
                    >
                        <span>Read</span>
                    </Button>
                </Link>
            </Grid.Column>
        )
    }
}

export default GridBlog
