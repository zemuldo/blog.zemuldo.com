import React from 'react'
import {Grid,Button,Header} from 'semantic-ui-react'
import {Link} from 'react-router-dom'

class GridBlog extends React.Component {
    constructor(props){
        super(props)
        this.state = {
        }
    }
    render() {
        let o=this.props.blog
        return (
            <Grid.Column width={5}>
                <Header color='green' as='h3'>
                    {this.props.blog.title.split(' ').join(' ')}
                </Header>
                <p>Author: {this.props.blog.author}</p>
                Likes:
                <span>
                    <i style={{color:'orange'}}>
                    ~{this.props.blog.likes}
                    </i>
                </span>
                <hr color={this.props.color}/>
                <p>{this.props.blog.about}</p>
                <Link to = {'/' + o.type + '/' + o.topics[0] + '/' + o.userName + '_' + o.title.split(' ').join('-') + '_' + o.date.split(' ').join('-') + '_' + o.id.toString()}>
                    <Button
                        className="redMoreButton"
                        ref={this.props.blog._id}
                        onClick={() => { this.props.onReadMore(this.props.blog) }}
                        name="all"
                        style={{color:'blue',backgroundColor:'transparent',border:'none'}}
                    >
                        <span>Read</span>
                    </Button>
                </Link>
            </Grid.Column>
        )
    }
}
export default GridBlog
