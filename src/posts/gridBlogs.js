import React from 'react'
import {Loader,Grid,Button,Header} from 'semantic-ui-react'

class GridBlogs extends React.Component {
    constructor(props){
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div>
                {
                    this.props.blogs.length > 0 && !this.props.blog?
                        <div>
                            <Grid>
                                {
                                    this.props.blogs[0] ?
                                        <Grid.Column width={5}>
                                            <Header color='green' as='h3'>
                                                {this.props.blogs[0].title.split(' ').join(' ')}
                                            </Header>
                                            <p>By: Author: {this.props.blogs[0].author}</p>
                                            <p>{this.props.blogs[0].about}</p>
                                            <Button
                                                className="redMoreButton"
                                                ref={this.props.blogs[0]._id}
                                                onClick={() => { this.props.onReadMore(this.props.blogs[0]) }}
                                                name="all"
                                                style={{color:'blue',backgroundColor:'transparent',border:'none'}}
                                            >
                                                <span>Read</span>
                                            </Button>
                                        </Grid.Column> : null
                                }
                                {
                                    this.props.blogs[1] ?
                                        <Grid.Column width={5}>
                                            <Header color='green' as='h3'>
                                                {this.props.blogs[1].title.split(' ').join(' ')}
                                            </Header>
                                            <p>By: Author: {this.props.blogs[1].author}</p>
                                            <p>{this.props.blogs[1].about}</p>
                                            <Button
                                                className="redMoreButton"
                                                ref={this.props.blogs[1]._id}
                                                onClick={() => { this.props.onReadMore(this.props.blogs[1]) }}
                                                name="all"
                                                style={{color:'blue',backgroundColor:'transparent',border:'none'}}
                                            >
                                                <span>Read</span>
                                            </Button>
                                        </Grid.Column> : null
                                }
                                {
                                    this.props.blogs[2] ?
                                        <Grid.Column width={5}>
                                            <Header color='green' as='h3'>
                                                {this.props.blogs[2].title.split(' ').join(' ')}
                                            </Header>
                                            <p>By: Author: {this.props.blogs[2].author}</p>
                                            <p>{this.props.blogs[2].about}</p>
                                            <Button
                                                className="redMoreButton"
                                                ref={this.props.blogs[2]._id}
                                                onClick={() => { this.props.onReadMore(this.props.blogs[2]) }}
                                                name="all"
                                                style={{color:'blue',backgroundColor:'transparent',border:'none'}}
                                            >
                                                <span>Read</span>
                                            </Button>
                                        </Grid.Column> : null
                                }
                            </Grid>
                            <Grid>
                                {
                                    this.props.blogs[3] ?
                                        <Grid.Column width={5}>
                                            <Header color='green' as='h3'>
                                                {this.props.blogs[3].title.split(' ').join(' ')}
                                            </Header>
                                            <p>By: Author: {this.props.blogs[3].author}</p>
                                            <p>{this.props.blogs[3].about}</p>
                                            <Button
                                                className="redMoreButton"
                                                ref={this.props.blogs[3]._id}
                                                onClick={() => { this.props.onReadMore(this.props.blogs[3]) }}
                                                name="all"
                                                style={{color:'blue',backgroundColor:'transparent',border:'none'}}
                                            >
                                                <span>Read</span>
                                            </Button>
                                        </Grid.Column> : null
                                }
                                {
                                    this.props.blogs[4] ?
                                        <Grid.Column width={5}>
                                            <Header color='green' as='h3'>
                                                {this.props.blogs[4].title.split(' ').join(' ')}
                                            </Header>
                                            <p>By: Author: {this.props.blogs[4].author}</p>
                                            <p>{this.props.blogs[4].about}</p>
                                            <Button
                                                className="redMoreButton"
                                                ref={this.props.blogs[4]._id}
                                                onClick={() => { this.props.onReadMore(this.props.blogs[4]) }}
                                                name="all"
                                                style={{color:'blue',backgroundColor:'transparent',border:'none'}}
                                            >
                                                <span>Read</span>
                                            </Button>
                                        </Grid.Column> : null
                                }
                                {
                                    this.props.blogs[5] ?
                                        <Grid.Column width={5}>
                                            <Header color='green' as='h3'>
                                                {this.props.blogs[5].title.split(' ').join(' ')}
                                            </Header>
                                            <p>By: Author: {this.props.blogs[5].author}</p>
                                            <p>{this.props.blogs[5].about}</p>
                                            <Button
                                                className="redMoreButton"
                                                ref={this.props.blogs[5]._id}
                                                onClick={() => { this.props.onReadMore(this.props.blogs[5]) }}
                                                name="all"
                                                style={{color:'blue',backgroundColor:'transparent',border:'none'}}
                                            >
                                                <span>Read</span>
                                            </Button>
                                        </Grid.Column> : null
                                }
                            </Grid>
                        </div> :
                        <Loader/>
                }
            </div>
        )
    }
}

export default GridBlogs
