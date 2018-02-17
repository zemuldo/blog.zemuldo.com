import React from 'react'
import {Button, Modal, Header, Icon, Image, Dropdown, Input, Form, Popup, Tab, Comment} from 'semantic-ui-react'
import {connect} from 'react-redux'
import BlogEditor from '../blogEditor/editor'
import PreviewEditor from '../blogEditor/prevEditor'
import times from 'lodash/times'
import axios from 'axios'
import config from '../env'
import {bindActionCreators} from 'redux'
import * as BlogActions from '../store/actions/blog'
import PropTypes from 'prop-types'
import moment from 'moment'
import {peopleL, peopleU, inWords, toTitleCase, blogUrl} from '../util'
import {
    convertFromRaw,
    EditorState,
} from 'draft-js'
import {
    decorator
} from '../blogEditor/editorToolkit';
import {socialShares} from '../env'
import FacebookProvider, {Comments} from 'react-facebook'
import DisqusThread from '../chat/disqus';
const env = config[process.env.NODE_ENV] || 'development'

class Blog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            youLike: false,
            showDelete: false,
            userLoggedIn: false,
            likes: this.props.blog ? this.props.blog.likes : 0,
            authorAvatar: null,
            title: this.props.blog.title,
            wordCount: 0,
            editorState: null,
            blogUrl: blogUrl(this.props.blog),
            replyComment:'',
            comments: [
                {
                    author: {
                        name: 'Danstan Onyango',
                        avatar: '/avatars/5a756836ff08f01a6637572b.png'
                    },
                    id: '565465b45g4545y454545yg4yg',
                    mess: 'Mess 1 Hello world',
                    date: new Date().toDateString(),
                    chat: [
                        {
                            author: {
                                name: 'Danstan Onyango',
                                avatar: '/avatars/5a756836ff08f01a6637572b.png'
                            },
                            id: '565465b45gggg45y454545yg4yg',
                            mess: 'Reply 1 Hello world',
                            date: new Date().toDateString(),
                            chat: [
                                {
                                    author: {
                                        name: 'Danstan Onyango',
                                        avatar: '/avatars/5a756836ff08f01a6637572b.png'
                                    },
                                    id: '565465b45g4545y4433435yg4yg',
                                    mess: 'Reply 1 Hello world',
                                    date: new Date().toDateString()
                                },
                                {
                                    author: {
                                        name: 'Danstan Onyango',
                                        avatar: '/avatars/5a756836ff08f01a6637572b.png'
                                    },
                                    id: '565465b48989894545y454545yg4yg',
                                    mess: 'Reply 2 Hello world',
                                    date: new Date().toDateString()
                                },
                                {
                                    author: {
                                        name: 'Danstan Onyango',
                                        avatar: '/avatars/5a756836ff08f01a6637572b.png'
                                    },
                                    id: '565465b432323235y454545yg4yg',
                                    mess: 'Reply 3 Hello world',
                                    date: new Date().toDateString()
                                }
                            ]
                        },
                        {
                            author: {
                                name: 'Danstan Onyango',
                                avatar: '/avatars/5a756836ff08f01a6637572b.png'
                            },
                            id: '565465rererer5y454545yg4yg',
                            mess: 'Reply 2 Hello world',
                            date: new Date().toDateString()
                        },
                        {
                            author: {
                                name: 'Danstan Onyango',
                                avatar: '/avatars/5a756836ff08f01a6637572b.png'
                            },
                            id: '565465bioiooioioy454545yg4yg',
                            mess: 'Reply 3 Hello world',
                            date: new Date().toDateString()
                        }
                    ]
                },
                {
                    author: {
                        name: 'Danstan Onyango',
                        avatar: '/avatars/5a756836ff08f01a6637572b.png'
                    },
                    id: '565465b43434343434y454545yg4yg',
                    mess: 'Mess 2 Hello world',
                    date: new Date().toDateString()
                },
                {
                    author: {
                        name: 'Danstan Onyango',
                        avatar: '/avatars/5a756836ff08f01a6637572b.png'
                    },
                    id: '565465b45g4454545yg4yg',
                    mess: 'Mess 3 Hello world',
                    date: new Date().toDateString()
                }
            ]
        }
        this.componentDidMount = this.componentDidMount.bind(this)
        this.updateLikes = this.updateLikes.bind(this)
        this.getAauthorAvatar = this.getAauthorAvatar.bind(this)
        this.closeDelete = this.closeDelete.bind(this)
        this.openDelete = this.openDelete.bind(this)
        this.getFBCount = this.getFBCount.bind(this)
        this.getTWTCount = this.getTWTCount.bind(this)
        this.getGCCount = this.getGCCount.bind(this)
        this.saveEdit = this.saveEdit.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleEditorStateEdit = this.handleEditorStateEdit.bind(this)
        this.handleAboutChange = this.handleAboutChange.bind(this)
        this.setReplyComment = this.setReplyComment.bind(this)
    }

    handleAboutChange(e, data) {
        this.props.blogActions.updateBlog({about: data.value})
    }

    handleEditorStateEdit() {
        this.setState({wordCount: this.props.blog.wordCount})
        let editorState = JSON.parse(this.props.blog.body);
        this.setState({editorState: EditorState.createWithContent(convertFromRaw(editorState), decorator)})
    };

    closeDelete() {
        this.setState({showDelete: false})
    }

    openDelete() {
        this.setState({showDelete: true})
    }

    setBlogCounts() {
        let gplusPost = {
            'method': 'pos.plusones.get',
            'id': 'p',
            'params': {
                'nolog': true,
                'id': 'https://blog.zemuldo/' + this.state.blogUrl,
                'source': 'widget',
                'userId': '@viewer',
                'groupId': '@self'
            },
            'jsonrpc': '2.0',
            'key': 'p',
            'apiVersion': 'v1'
        }
        window.scrollTo(0, 0)
        this.getFBCount(this.state.blogUrl)
        this.getTWTCount(this.state.blogUrl)
        this.getGCCount(gplusPost)
    }

    getFBCount(shareURL) {
        return axios.get('https://graph.facebook.com/?id=https://blog.zemuldo.com/' + shareURL, {})
            .then((res) => {
                this.props.blogActions.updateBlog({
                    fbC: (res.data.share.share_count) ? res.data.share.share_count : 0
                })
                return true
            })
            .catch((err) => {
                this.props.blogActions.updateBlog({
                    fbC: 0
                })
            })
    };

    getTWTCount(shareURL) {
        return axios.get('https://public.newsharecounts.com/count.json?url=https://blog.zemuldo.com/' + shareURL, {})
            .then((res) => {
                this.props.blogActions.updateBlog({
                    twtC: (res.data.count) ? res.data.count : 0
                })
            })
            .catch((err) => {
                this.props.blogActions.updateBlog({
                    twtC: 0
                })
            })
    };

    getGCCount(gplusPost) {
        return axios.post(' https://clients6.google.com/rpc', gplusPost)
            .then((res) => {
                this.props.blogActions.updateBlog({
                    gplsC: (res.data.result.metadata.globalCounts.count) ? res.data.result.metadata.globalCounts.count : 0
                })
                return true
            })
            .catch((err) => {
                this.props.blogActions.updateBlog({
                    gplsC: 0
                })
            })
    };

    getAauthorAvatar() {
        axios.post(env.httpURL, {
            'queryMethod': 'getAvatar',
            'queryData': {
                'id': this.props.blog.authorID
            }
        })
            .then(function (res) {
                if (!res) {
                    return false
                }
                if (!res.data) {
                    return false
                }
                if (res.data.imageURL) {
                    this.setState({authorAvatar: JSON.parse(res.data.imageURL)})
                }
            }.bind(this))
            .catch(function (err) {

            })
    }

    saveEdit() {
        this.props.blogActions.updateBlog({editMode: true})
        localStorage.removeItem('editBlog')
    }

    componentDidMount() {
        this.handleEditorStateEdit()
        this.props.blogActions.updateBlog({editMode: false})
        if (this.props.blog) {
            this.getAauthorAvatar()
            this.setBlogCounts()
        }
        this.setState({youLike: true})
        if (localStorage.getItem('user')) {
            this.setState({userLoggedIn: true})
            axios.post(env.httpURL, {
                'queryMethod': 'getLike',
                'queryData': {
                    postID: this.props.blog.id,
                    title: this.props.blog.title,
                    userID: JSON.parse(localStorage.getItem('user')).id
                }
            })
                .then(function (response) {
                    if (!response.data) {
                        this.setState({youLike: false})
                        return false
                    }
                    if (!response.data.state) {
                        this.setState({youLike: false})
                        return false
                    }
                    if (response.data.state === false) {
                        this.setState({youLike: false})
                        return false
                    }
                    if (response.data.state === true) {
                        if (response.data.n) {
                            this.setState({youLike: true})
                            return true
                        } else {
                            return false
                        }
                    }
                }.bind(this))
                .catch(function (err) {
                    this.setState({youLike: false})
                    return false
                }.bind(this))
        }
    }

    fbShare() {
        let fbShareURL = 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fblog.zemuldo.com%2F'
        if (this.props.blog) {
            let postURL = blogUrl(this.props.blog)
            let shareURL = fbShareURL + postURL + "&amp;src=sdkpreparse'"
            window.open(shareURL, 'sharer', 'toolbar=0,status=0,width=548,height=325')
        }
    }

    tweetShare() {
        if (this.props.blog) {
            let hashTgs = '%2F&hashtags=' + this.props.blog.topics.join(',')
            let via = '&via=zemuldo'
            let related = '&related=https%3A%2F%2Fpic.twitter.com/Ew9ZJJDPAR%2F'
            let url = `&url=https%3A%2F%2Fblog.zemuldo.com/${this.state.blogUrl}`
            let fullURL = `${url}${related}${via}`
            let shareURL = 'https://twitter.com/intent/tweet?text=pic.twitter.com/Ew9ZJJDPAR ' + this.props.blog.title + fullURL
            window.open(shareURL, 'sharer', 'toolbar=0,status=0,width=548,height=325')
        }
    }

    gplusShare() {
        if (this.props.blog) {
            window.open(`https://plus.google.com/share?url=https://blog.zemuldo.com/&url=https%3A%2F%2Fblog.zemuldo.com/${this.state.blogUrl}`)
        }
    }

    linkdnShare() {
        let url = `https://plus.google.com/share?url=https://blog.zemuldo.com/&url=https%3A%2F%2Fblog.zemuldo.com/${this.state.blogUrl}`
        window.open('https://www.linkedin.com/cws/share?url=https%3A%2F%2Fblog.zemuldo.com  /' + url, '', 'height=550,width=525,left=100,top=100,menubar=0')
    }

    updateLikes = (id) => {
        if (localStorage.getItem('user')) {
            return axios.post(env.httpURL, {
                'queryMethod': 'updateBlogLikes',
                'queryData': {
                    id: id,
                    title: this.props.blog.title,
                    userID: JSON.parse(localStorage.getItem('user')).id
                }
            })
                .then(function (response) {
                    if (response.data.state === false) {
                        return
                    }
                    if (response.data.n) {
                        if (response.data.n) {
                            this.props.blogActions.updateBlog({likes: 1 + this.props.blog.likes})
                            this.setState({youLike: true})
                        }
                    }
                }.bind(this))
                .catch(function (err) {
                })
        }
    };
    deletBlog = (id) => {
        if (localStorage.getItem('user')) {
            return axios.post(env.httpURL, {
                'queryMethod': 'deleteBlog',
                'queryData': {
                    id: id
                }
            })
                .then(function (response) {
                    this.props.blogActions.resetBlog({id: null})
                    this.props.navigateBlogs({})
                }.bind(this))
                .catch(function (err) {
                }.bind(this))
        }
    };

    handleInputChange = (e) => {
        let test = {
            [e.target.name]: e.target.value
        }
        console.log(test)
        this.setState({[e.target.name]: e.target.value})
        this.props.blogActions.updateBlog({[e.target.name]: e.target.value})
    }

    handleSave = () => {
        let body = localStorage.getItem('editBlog')
        let update = {
            title: this.state.title,
            wordCount: this.props.blog.wordCount,
            about: this.props.blog.about
        }
        let o = {editMode: false, title: this.state.title}
        update.body = this.props.blog.body
        if (body) {
            o.body = body
            update.body = body
        }

        this.props.blogActions.updateBlog(o);
        axios.post(env.httpURL, {
            queryMethod: 'updateBlog',
            'queryData': {
                _id: this.props.blog.postID,
                update: update
            }

        })
            .then(function (response) {
                localStorage.removeItem('editBlog')
            }.bind(this))

            .catch(function (err) {

            }.bind(this))
    }

    setReplyComment (id){
        this.setState({replyComment:id})
    }

    render() {
        const BlogComments = (arr) => {
            return (<Comment.Group threaded>
                {arr.map(function (c, i) {
                    if (c.constructor === Array) {
                        return BlogComments(c)
                    }
                    return (
                        <Comment key={c.id}>
                            <Comment.Avatar as='a' src={env.httpURL + c.author.avatar}/>
                            <Comment.Content>
                                <Comment.Author as='a'>{c.author.name}</Comment.Author>
                                <Comment.Metadata>
                                    <span>{c.date}</span>
                                </Comment.Metadata>
                                <Comment.Text>{c.mess}</Comment.Text>
                                <Comment.Actions>
                                    <a onClick={()=>this.setReplyComment(c.id)}>Reply</a>
                                    {
                                        this.state.replyComment ===c.id?
                                            <Form reply>
                                                <Form.TextArea />
                                                <Button content='Add Reply' labelPosition='left' icon='edit' primary />
                                                <Button onClick={()=>this.setReplyComment('')} content='Cancel' labelPosition='left' icon='close' primary />
                                            </Form>:null
                                    }
                                </Comment.Actions>
                            </Comment.Content>
                            {
                                c.chat ?
                                    BlogComments(c.chat) : null
                            }
                        </Comment>)
                }.bind(this))}
            </Comment.Group>)

        };
        let comments = [
            {
                menuItem: 'Facebook',
                render: () =>
                    <FacebookProvider key={'1303236236454786'} appId="1303236236454786"><Comments
                        href={`https://blogs.zemuldo.com/${this.state.blogUrl}`}/>
                    </FacebookProvider>
            },
            {
                menuItem: 'Disqus',
                render: () =>
                    <DisqusThread
                        key={'zemuldoblog'}
                        shortname="zemuldoblog"
                        identifier={`https://blogs.zemuldo.com/${this.state.blogUrl}`}
                        title={`Zemuldo Blogs- ${this.props.blog.title}`}
                    />
            }
        ]
        let likes = inWords(this.props.blog.likes)
        let likeMesage = this.state.youLike ? 'You already liked this post' : 'Like this post'
        let shares = socialShares.map(s => {
            return <Popup
                inverted
                key={s.name}
                trigger=
                    {<a><Button
                        onClick={() => {
                            this[s.shareCounter]()
                        }}
                        circular color={s.color} icon={s.icon}/>
                        <sup>{this.props.blog[s.count]}</sup>
                        {'   '}
                    </a>}
                content={`Share this on ${s.name} `}
            />
        })
        return (
            <div>
                <Modal dimmer open={this.state.showDelete}>
                    <Modal.Header>This Post will be deleted</Modal.Header>
                    <Modal.Content image>
                        <Modal.Description>
                            <Header style={{textAlign: 'left', alignment: 'center'}} color={this.props.vars.color}
                                    as='h1'>
                                {
                                    this.props.blog.title
                                }
                            </Header>
                            <span className='info'>
                                   Published: {moment().to(this.props.blog.date)}
                                <br/>
                                {this.props.blog.date}
                            </span>
                            <br/>
                            <br/>
                            <span className='info'>
                                {this.props.blog.author.name} {' '}
                            </span>
                            <div style={{margin: '2em 0em 3em 0em', fontSize: '16px', fontFamily: 'georgia'}}>
                                <br/>
                                <div>{
                                    this.state.editorState ?
                                        <PreviewEditor title={this.props.blog.title}
                                                       editorState={this.state.editorState}/> :
                                        <div>Loading editor state</div>
                                }</div>
                            </div>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='green' onClick={() => this.closeDelete()}>
                            Cancel
                        </Button>
                        <Button color='red' icon='checkmark' labelPosition='right' content='Delete'
                                onClick={() => this.deletBlog(this.props.blog.id)}/>
                    </Modal.Actions>
                </Modal>
                {
                    this.props.blog
                        ? <div>
                            {
                                !this.props.blog.editMode ?
                                    <Header style={{textAlign: 'left', alignment: 'center'}} color={this.props.vars.color}
                                            as='h1'>
                                        {
                                            this.props.blog.title
                                        }
                                    </Header> :
                                    <div>
                                        <Header style={{textAlign: 'left', alignment: 'center'}}
                                                color={this.props.vars.color} as='h3'>
                                            <span>Title: </span> <Input name='title' onChange={this.handleInputChange}
                                                                        value={this.state.title}/>
                                            {' '}
                                            <span>Words </span> <Input name='wordCount' onChange={this.handleInputChange}
                                                                       value={this.props.blog.wordCount}/>
                                        </Header>

                                    </div>

                            }
                            <div className='shareIcon clearElem'
                                 style={{display: 'block', fontSize: '16px', fontFamily: 'georgia'}}>
                                {
                                    this.state.userLoggedIn
                                        ? <span>
                                            {
                                                this.state.youLike
                                                    ?
                                                    <Popup
                                                        trigger=
                                                            {<a>
                                                                <Icon size='small' inverted circular color='blue'
                                                                      name='like outline'/>
                                                                <Icon size='small' inverted circular color='red'
                                                                      name='like'/>
                                                                <br/>
                                                                {this.props.blog.likes > 1 ? `You and ${peopleL(this.props.blog.likes - 1)}` : `You like this`}
                                                            </a>}
                                                        content={likeMesage}
                                                    />

                                                    :
                                                    <Popup
                                                        trigger=
                                                            {<span>
                                                            <Button size='mini'
                                                                    onClick={() => this.updateLikes(this.props.blog.id)}
                                                                    circular color='blue' icon='thumbs up'/>
                                                            <Button size='mini'
                                                                    onClick={() => this.updateLikes(this.props.blog.id)}
                                                                    circular color='orange' icon='like'/>
                                                            <a>
                                                                <br/>
                                                                {`${toTitleCase(likes)} ${peopleU(this.props.blog.likes)}`}
                                                            </a>
                                                        </span>}
                                                        content={likeMesage}
                                                    />

                                            }
                                        </span>
                                        :
                                        <Popup
                                            trigger=
                                                {<a>
                                                    <Icon size='small' inverted circular color='blue' name='like outline'/>
                                                    <Icon size='small' inverted circular color='red' name='like'/>
                                                    <br/>
                                                    {`${toTitleCase(likes)} ${peopleU(this.props.blog.likes)}`}
                                                </a>}
                                            content={likeMesage}
                                        />

                                }
                                <br/>
                                <Icon size='large' color='green' name='external share'/>
                                Share this on: {}
                                {'  '}
                                {shares}
                                <br/>
                                <br/>
                                <span>
                                    <Popup
                                        trigger={<Image
                                            floated='left'
                                            avatar
                                            id='photo'
                                            size='tiny'
                                            src={env.httpURL + this.props.blog.author.url}
                                            style={{
                                                borderStyle: 'solid',
                                                borderWidth: '3px',
                                                borderColor: 'green',
                                                borderRadius: `${(Math.min(
                                                    this.props.blog.author.style.height,
                                                    this.props.blog.author.style.width
                                                    ) +
                                                    10) *
                                                this.props.blog.author.style.borderRadius / 2 / 100}px`
                                            }}
                                        />}
                                    >
                                    <h3>
                                    {this.props.blog.author.name}
                                    </h3>
                                    <p>
                                    {`Joined ${moment().to(this.props.blog.author.created)}`}
                                    </p>
                                    </Popup>
                                    
                                </span>
                                <span className='info'>
                                    Published
                                    {' '}{moment().to(this.props.blog.date)}
                                </span>
                                <br/>
                                <br/>
                                <span className='info'>
                                    {this.props.blog.author.name} {' '}
                                </span>
                                <br/>
                                <br/>
                                {
                                    this.props.user && this.props.user.id && this.props.user.userName === this.props.blog.author.userName
                                        ? <div>
                                            <Dropdown text='Manage' pointing className='link item info'>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item color='red'
                                                                   onClick={() => this.openDelete()}>Delete</Dropdown.Item>
                                                    <Dropdown.Item
                                                        onClick={() => this.saveEdit()}
                                                    >
                                                        Edit
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        onClick={this.handleSave}
                                                    >
                                                        Save
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>Hide</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                        : null
                                }
                            </div>
                            <hr color='green'/>
                            <div style={{margin: '0em 0em 3em 0em', fontSize: '16px', fontFamily: 'georgia'}}>
                                <br/>
                                {
                                    this.state.editorState ?
                                        <BlogEditor initEditorState={this.state.editorState} mode={'edit'}
                                                    className='editor' editorState={this.props.blog.body}/> :
                                        <div>Loading state</div>
                                }
                            </div>
                            <div>
                                {
                                    this.props.blog.editMode ?
                                        <Form style={{padding: '2em 2em 2em 2em'}}>
                                            <Form.TextArea maxLength='140' onChange={this.handleAboutChange}
                                                           label='About your blog'
                                                           value={this.props.blog.about}/>
                                        </Form>
                                        : null
                                }
                            </div>
                            <Header as='h2' icon>
                                <Icon name='comments' color={'green'}/>
                                Have a comment?
                                <Header.Subheader>
                                    Use facebook, Google + or Disqus to comment on this blog.
                                </Header.Subheader>
                            </Header>
                            <Tab menu={{attached: true}} panes={comments}/>
                            <Header as='h3' dividing>Comments</Header>
                            {
                                BlogComments(this.state.comments)
                            }

                        </div>
                        : <div>
                            Content not found!
                        </div>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        blog: state.blog,
        vars: state.vars,
        user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        blogActions: bindActionCreators(BlogActions, dispatch)
    }
}

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    user: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.oneOf([null])
    ]),
    vars: PropTypes.object.isRequired,
    blogActions: PropTypes.object.isRequired,
    navigateBlogs: PropTypes.func.isRequired

}

export default connect(mapStateToProps, mapDispatchToProps)(Blog)
