import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom';
import {Loader, Header, Card, Image} from 'semantic-ui-react'
import _ from 'lodash'
import Blog from '../posts/blog'
import GridBlogs from "../posts/gridBlogs";
import {pages, topicsOBJ} from '../environments/conf'
import {bindActionCreators} from "redux";
import * as VarsActions from "../state/actions/vars";

class WelcomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {}

    fbShare() {
        let fbShareURL = 'https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fzemuldo.com%2F';
        if (this.props.blog) {
            let postURL = this.props.blog.title.split(' ').join('%2520') + '_' + this.props.blog.date.split(' ').join('%2520') + '_' + this.props.blog.id.toString();
            let shareURL = fbShareURL + postURL + "&amp;src=sdkpreparse'"
            window.open(shareURL, 'sharer', 'toolbar=0,status=0,width=548,height=325');
        }
    }

    tweetShare() {
        if (this.props.blog) {
            let hashTgs = '%2F&hashtags=' + this.props.blog.topics.join(',');
            let via = '&via=zemuldo';
            let related = '&related=http%3A%2F%2Fpic.twitter.com/Ew9ZJJDPAR%2F';
            let url = '&url=http%3A%2F%2Fzemuldo.com/' + this.props.blog.title.split(' ').join('-') + '_' + this.props.blog.date.split(' ').join('-') + '_' + this.props.blog.id.toString()
            let fullURL = url + related + hashTgs + via
            let shareURL = 'https://twitter.com/intent/tweet?text=pic.twitter.com/Ew9ZJJDPAR ' + this.props.blog.title + fullURL
            window.open(shareURL, 'sharer', 'toolbar=0,status=0,width=548,height=325');

        }
    }

    gplusShare() {
        window.open('https://plus.google.com/share?url=http://zemuldo.com/' + this.props.blog.title.split(' ').join('-'), "", "height=550,width=525,left=100,top=100,menubar=0");
        return false;
    }

    linkdnShare() {
        window.open('https://www.linkedin.com/cws/share?url=http%3A%2F%2Fzemuldo.com/' + this.props.blog.title.split(' ').join('-') + '_' + this.props.blog.id.toString(), "", "height=550,width=525,left=100,top=100,menubar=0");
    }

    render() {
        const t = 'Artiles on ';
        return (
          <div style={{margin: '2em 1em 3em 1em'}}>
            {
                    !this.props.blog.id ?
                      <div>
                        {
                                this.props.blogs[0] ?
                                  <div>
                                    <Header color={this.props.vars.color} as='h2'>
                                      {
                                                this.props.vars.topic!=='all' && topicsOBJ[this.props.vars.topic]?
                                                t + topicsOBJ[this.props.vars.topic].full:
                                                    pages[this.props.vars.currentLocation].topTitle
                                            }
                                    </Header>
                                    <br />
                                    <div className='blogs'>
                                      <GridBlogs
                                        x={this.props.x}
                                        next={this.props.next}
                                        setPreviousBlogs={this.props.setPreviousBlogs}
                                        setNextBlogs={this.props.setNextBlogs}
                                        onReadMore={this.props.onReadMore}
                                        color={this.props.vars.color}
                                            />
                                    </div>
                                  </div> :
                                  <div>
                                    <Header color={this.props.vars.color} as='h1' />
                                    <div style={{
                                            fontSize: "16px",
                                            fontFamily: "georgia",
                                            padding: '0em 0em 2em 1em'
                                        }}>
                                      <p>
                                                There is no content on the selected topic, there are tons of topics
                                                to read about
                                      </p>
                                      <br />
                                      <div className='blogs'>
                                        <Card.Group>
                                          {
                                                        _.times(this.props.topics.length, (i) =>
                                                          <Card className='blogCard' style={{
                                                                width: 'auto',
                                                                maxWidth: '200px',
                                                                minWidth: '100px',
                                                            }} key={i}>
                                                            <Card.Content>
                                                              <Card.Header>
                                                                <Link
                                                                  onClick={()=>this.props.varsActions.updateVars({blogsLoaded:false})}
                                                                  to={'/topics/' + this.props.topics[i].key}>
                                                                  {topicsOBJ[this.props.topics[i].key].full}
                                                                </Link>
                                                              </Card.Header>
                                                              <Card.Meta><span className='colorBlue'>{'Articles: '+this.props.topics[i].blogs}</span></Card.Meta>
                                                              <Card.Description>{this.props.topics[i].blogs+' '}articles to read on this topic.</Card.Description>
                                                            </Card.Content>
                                                          </Card>
                                                        )
                                                    }
                                        </Card.Group>

                                      </div>
                                    </div>
                                  </div>
                            }
                      </div> : null
                }
            {
                    !this.props.blog.id ?
                        null :
                        <div>
                          {
                                this.props.vars.blogsLoaded ?
                                  <Blog
                                    color={this.props.vars.color}
                                    counts={this.props.counts}
                                    deletedBlog={this.props.deletedBlog}
                                    /> :
                                  <div style={{left: '50%', position: 'fixed', bottom: '50%', zIndex: -1}}>
                                    <Loader active inline='centered' />
                                    <p>Loading Blogs...</p>
                                  </div>

                            }
                        </div>
                }
          </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        blogs: state.blogs,
        blog: state.blog,
        vars: state.vars,
        topics:state.topics
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        varsActions: bindActionCreators(VarsActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage)