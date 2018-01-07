import React from 'react'
import {Card, Button, Header} from 'semantic-ui-react'
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
        super(props);
        this.state = {
            showInfo:false
        };
        this.handleMouseEnter=this.handleMouseEnter.bind(this);
        this.handleMouseLeave=this.handleMouseLeave.bind(this);
    }

    handleMouseEnter(o) {
        this.setState({showInfo:true})
    }

    handleMouseLeave(o) {
        this.setState({showInfo:false})
    }

    render() {
        let o = this.props.blog
        return (
            <Card className='blogCard' style={{
                width: 'auto',
                maxWidth: '200px',
                minWidth: '100px',
            }} key={this.props.key}

            >
                <Card.Content >
                    <Card.Header>
                        <Header onMouseEnter={() => this.handleMouseEnter(o)}
                                onMouseLeave={() => this.handleMouseLeave(o)} color='green' as='h3'>
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
                        <hr color={this.props.color}/>
                    </Card.Meta>
                    <Card.Description>
                        <p>{o.about}</p>
                        <p>
                            15 Minutes read,
                            <br/>
                            Related to
                            <br/>
                            {getTopiINfo(o.topics).join(',')}
                            <br/>
                            Published on {o.date}
                        </p>
                    </Card.Description>
                </Card.Content>
            </Card>
        )
    }
}

export default GridBlog
