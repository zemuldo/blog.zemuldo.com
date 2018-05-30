import React from 'react'
import { Helmet } from 'react-helmet'
import { Button, Modal, Header, Icon, Image, Dropdown, Input, Form, Popup, Tab, Comment, Confirm, Visibility, Segment, Label, Select, Menu } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { topics, categories } from '../env'
import BlogEditor from '../blogEditor/editor'
import axios from 'axios'
import config from '../env'
import { bindActionCreators } from 'redux'
import * as BlogActions from '../store/actions/blog'
import * as UserActions from "../store/actions/user"
import PropTypes from 'prop-types'
import moment from 'moment'
import { peopleL, peopleU, inWords, toTitleCase, blogUrl, updateReplies, deleteComments, notifyMe } from '../util'
import {
    convertFromRaw,
    EditorState,
} from 'draft-js'
import {
    decorator
} from '../blogEditor/editorToolkit';
import { socialShares } from '../env'
import FacebookProvider, { Comments } from 'react-facebook'
import LoginForm from '../profile/lognForm'
import DisqusThread from '../chat/disqus';
import pick from 'lodash/pick'
import times from 'lodash/times'
import ZPopup from '../partials/popup'

const env = config[process.env.NODE_ENV] || 'development'

class BlogCommnts extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            youLike: false,
            showDelete: false,
            userLoggedIn: false,
            likes: this.props.blog ? this.props.blog.likes : 0,
            title: this.props.blog.title,
            wordCount: 0,
            blogUrl: blogUrl(this.props.blog),
            blogUrlT: blogUrl(this.props.blog),
            replyComment: '',
            comments: [],
            cdelopen: false,
            warning: true,
            error: false,
            success: false,
            hideMessage: true,
            logingin: false,
            menuFixed: false,
            overlayFixed: false,
        }
    }

    showDeleteComment = (_id) => this.setState({ cdelopen: true, commentToDelete: _id });

    handleConfirmDeleteComment = () => {
        this.deleteComments(this.state.commentToDelete);
        this.setState({ cdelopen: false })
    };

    handleCancelDeleteComment = () => this.setState({ cdelopen: false });

    getComments() {
        axios.post(env.httpURL, {
            'queryMethod': 'getComments',
            'queryData': { postID: this.props.blog._id }
        }
        )
            .then(o => {
                this.setState({ comments: o.data.comments })
            })
            .catch(e => {
                console.log(e)
            })
    }

    getShortURL() {
        axios.post(env.fupisha, { url: `https://blog.zemuldo.com/${this.props.blog._id}`, custom_longUrl: `${window.location.href}` })
            .then(o => {
                this.setState({ blogUrl: o.data })
                this.setBlogCounts(this.state.blogUrl.shortUrl)
                this.setBlogCounts(`https://blog.zemuldo.com/${this.state.blogUrlT}`)
            })
            .catch(e => {

            })
    }

    componentDidMount() {
        this.getComments()
    }

    fbShare() {
        let fbShareURL = 'https://www.facebook.com/sharer/sharer.php?u=' + this.state.blogUrl.shortUrl
        if (this.props.blog) {
            let postURL = this.state.blogUrl.pathname
            let shareURL = fbShareURL + "&amp;src=sdkpreparse'"
            window.open(shareURL, 'sharer', 'toolbar=0,status=0,width=548,height=325')
        }
    }

    tweetShare() {
        if (this.props.blog) {
            let hashTgs = '%2F&hashtags=' + this.props.blog.topics.join(',')
            let via = '&via=zemuldo'
            let related = '&related=https%3A%2F%2Fpic.twitter.com/Ew9ZJJDPAR%2F'
            let url = `&url=https%3A%2F%2F${this.state.blogUrl.shortUrl_Bare}`
            let fullURL = `${url}${related}${via}`
            let shareURL = 'https://twitter.com/intent/tweet?text=pic.twitter.com/Ew9ZJJDPAR ' + this.props.blog.title + fullURL
            window.open(shareURL, 'sharer', 'toolbar=0,status=0,width=548,height=325')
        }
    }

    gplusShare() {
        if (this.props.blog) {
            window.open(`https://plus.google.com/share?url=https://blog.zemuldo.com/&url=https%3A%2F%2F${this.state.blogUrl.shortUrl_Bare}`)
        }
    }

    linkdnShare() {
        let url = `https://plus.google.com/share?url=https://blog.zemuldo.com/&url=https%3A%2F%2Fblog.zemuldo.com/${this.state.blogUrl}`
        window.open('https://www.linkedin.com/cws/share?url=https%3A%2F%2Fblog.zemuldo.com  /' + url, '', 'height=550,width=525,left=100,top=100,menubar=0')
    }

    setReplyComment(_id) {
        if (!this.props.user || !this.props.user._id) {
            this.setState({ open: true })
            return false
        }
        this.setState({ replyComment: _id })
    }

    deleteComments(_id) {
        axios.post(env.httpURL, {
            queryMethod: 'deleteComment',
            'queryData': {
                postID: this.props.blog._id,
                _id: _id
            }
        })
            .then(oo => {
                console.log(oo)
                if (oo.data.nModified === 1) {
                    return deleteComments(_id, this.state.comments)
                }
            })
            .then(o => {
                if (o.constructor === Array) {
                    this.setState({ comments: o })
                    notifyMe('Comment was deleted')
                }
                this.setState({ commentToDelete: null })
            })
            .catch(e => {
                console.log(e)
            })
    }

    onCommentChange = (e) => {
        this.setState({ mess: e.target.value })
    }

    submitComment = () => {
        if (!this.state.mess || this.state.mess.length < 2) {
            return false
        }
        if (!this.props.user) {
            this.setState({ open: true })
            return false
        }

        if (this.state.mess.length > 1) {
            axios.post(env.httpURL, {
                queryMethod: "comment",
                queryData: {
                    postID: this.props.blog._id,
                    author: {
                        name: this.props.user.name,
                        avatar: this.props.user.avatarURL,
                    },
                    userID: this.props.user._id,
                    mess: this.state.mess,
                }
            })
                .then(o => {
                    this.setState({
                        comments: [...this.state.comments, {
                            author: {
                                name: this.props.user.name,
                                avatar: this.props.user.avatarURL,
                            },
                            postID: this.props.blog._id,
                            _id: o.data._id,
                            mess: this.state.mess,
                            date: new Date().toISOString()
                        }], mess: ''
                    })
                })
                .catch(e => {
                    console.log(e)
                })
        }

    }

    updateComments = (c) => {
        let o = this.state.comments;
        this.setReplyComment('')
        axios.post(env.httpURL, {
            queryMethod: "replyComment",
            queryData: c
        })
            .then(oo => {
                c._id = oo.data._id
                return updateReplies(c, o)
            })
            .then(oo => {
                this.setState({ comments: oo })
            })
            .catch(e => {
                console.log(e)
            })

    }


    render() {
        const { menuFixed, overlayFixed, overlayRect } = this.state
        const { open, dimmer } = this.state
        const BlogComments = (arr) => {
            return (
                <Comment.Group threaded>
                    {arr.map(function (c) {
                        return (
                            <Comment key={c._id}>
                                <Comment.Avatar as='a' src={env.httpURL + c.author.avatar} />
                                <Comment.Content>
                                    <Comment.Author as='a'>{c.author.name}</Comment.Author>
                                    <Comment.Metadata>
                                        <span>{moment().to(c.date)}</span>
                                    </Comment.Metadata>
                                    <Comment.Text>{c.mess}</Comment.Text>
                                    <Comment.Actions>
                                        <Button icon basic color='green' onClick={() => this.setReplyComment(c._id)} circular icon='reply' />
                                        {
                                            this.props.user && this.props.user._id && this.props.user._id === c.userID ?
                                                <Button icon basic color='red' onClick={() => this.showDeleteComment(c._id)} circular icon='delete' /> : null
                                        }
                                        {
                                            this.state.replyComment === c._id ?
                                                <Form reply>
                                                    <Form.TextArea onChange={this.onCommentChange} />
                                                    <Button
                                                        onClick={() => this.updateComments({
                                                            postID: this.props.blog._id,
                                                            parent_id: c._id,
                                                            mess: this.state.mess,
                                                            userID: this.props.user._id,
                                                            author: {
                                                                name: this.props.user.name,
                                                                avatar: this.props.user.avatarURL
                                                            }
                                                        })}
                                                        content='Add Reply'
                                                        labelPosition='left'
                                                        icon='edit'
                                                        primary
                                                    />
                                                    <Button onClick={() => this.setReplyComment('')} content='Cancel'
                                                        labelPosition='left' icon='close' primary />
                                                </Form> : null
                                        }
                                    </Comment.Actions>
                                </Comment.Content>
                                {
                                    c.chat ?
                                        BlogComments(c.chat.comments) : null
                                }
                            </Comment>)
                    }.bind(this))}
                </Comment.Group>)

        };
        let comments = [
            {

                menuItem: 'Comments',
                render: () =>
                    <div>
                        {
                            BlogComments(this.state.comments)
                        }
                        <Form>
                            <Form.TextArea style={{ maxWidth: '400px' }} onChange={this.onCommentChange} />
                            <Button disabled={!this.state.mess || this.state.mess.length < 2} onClick={() => this.submitComment('')} content='Add Comment' labelPosition='left'
                                icon='edit' primary />
                        </Form>
                    </div>
            },
            {
                menuItem: 'Facebook',
                render: () =>
                    <FacebookProvider key={'1303236236454786'} appId="1303236236454786"><Comments
                        href={`https://blogs.zemuldo.com/${this.state.blogUrl}`} />
                    </FacebookProvider>
            },
            {
                menuItem: 'Disqus',
                render: () =>
                    <DisqusThread
                        key={'zemuldoblog'}
                        shortname="zemuldoblog"
                        identifier={this.props.blog._id}
                        title={`Zemuldo Blogs- ${this.props.blog.title}`}
                    />
            }
        ]
        
        return (
            <div>
                {
                    this.props.blog
                        ? <div>
                            <Header as='h2' icon>
                                <Icon name='comments' color={'green'} />
                                Have a comment?
                                <Header.Subheader>
                                    Use facebook, Google + or Disqus to comment on this blog.
                                </Header.Subheader>
                            </Header>
                            <Tab menu={{ attached: true }} panes={comments} />

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
        blogActions: bindActionCreators(BlogActions, dispatch),
        userActions: bindActionCreators(UserActions, dispatch),
    }
}

BlogCommnts.propTypes = {
    blog: PropTypes.object.isRequired,
    user: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.oneOf([null])
    ]),

}

export default connect(mapStateToProps, mapDispatchToProps)(BlogCommnts)
