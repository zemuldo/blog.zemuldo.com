import React from 'react'
import { Button, Modal, Header, Icon, Image, Dropdown, Input, Form, Popup, Tab, Comment, Confirm, Visibility } from 'semantic-ui-react'
import { connect } from 'react-redux'
import BlogEditor from '../blogEditor/editor'
import PreviewEditor from '../blogEditor/prevEditor'
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

const env = config[process.env.NODE_ENV] || 'development'

class Blog extends React.Component {
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
            logingin: false
        }
    }
    show = dimmer => () => this.setState({ dimmer, open: true });
    close = () => this.setState({ open: false })
    showDeleteComment = (_id) => this.setState({ cdelopen: true, commentToDelete: _id });
    handleConfirmDeleteComment = () => {
        this.deleteComments(this.state.commentToDelete);
        this.setState({ cdelopen: false })
    };
    handleCancelDeleteComment = () => this.setState({ cdelopen: false });

    handleAboutChange(e, data) {
        this.props.blogActions.updateBlog({ about: data.value })
    }

    handleEditorStateEdit = () => {
        this.setState({ wordCount: this.props.blog.wordCount });
        let editorState = JSON.parse(this.props.blog.body);
        this.setState({ editorState: EditorState.createWithContent(convertFromRaw(editorState), decorator) })
    };

    closeDelete = () => {
        this.setState({ showDelete: false })
    }

    openDelete() {
        this.setState({ showDelete: true })
    }

    setBlogCounts = (shareUrl) => {
        this.getFBCount(shareUrl)
        this.getTWTCount(shareUrl)
        this.getGCCount(shareUrl)
    }

    getFBCount = (shareUrl) => {
        return axios.get('https://graph.facebook.com/?id=' + shareUrl, {})
            .then((res) => {
                this.props.blogActions.updateBlog({
                    fbC: this.props.blog.fbC + (res.data.share.share_count) ? res.data.share.share_count : 0
                })
                return true
            })
            .catch((err) => {
                this.props.blogActions.updateBlog({
                    fbC: this.props.blog.fbC
                })
            })
    };

    getTWTCount(shareUrl) {
        return axios.get('https://public.newsharecounts.com/count.json?url=' + shareUrl, {})
            .then((res) => {
                this.props.blogActions.updateBlog({
                    twtC: this.props.blog.twtC + (res.data.count) ? res.data.count : 0
                })
            })
            .catch((err) => {
                this.props.blogActions.updateBlog({
                    twtC: this.props.blog.twtC
                })
            })
    };

    getGCCount(shareUrl) {
        let gplusPost = {
            'method': 'pos.plusones.get',
            'id': 'p',
            'params': {
                'nolog': true,
                'id': shareUrl,
                'source': 'widget',
                'userId': '@viewer',
                'groupId': '@self'
            },
            'jsonrpc': '2.0',
            'key': 'p',
            'apiVersion': 'v1'
        }
        return axios.post(' https://clients6.google.com/rpc', gplusPost)
            .then((res) => {
                this.props.blogActions.updateBlog({
                    gplsC: (res.data.result.metadata.globalCounts.count) ? res.data.result.metadata.globalCounts.count : 0
                })
                return true
            })
            .catch((err) => {
                this.props.blogActions.updateBlog({
                    gplsC: this.props.blog.gplsC + 0
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
                    this.setState({ authorAvatar: JSON.parse(res.data.imageURL) })
                }
            }.bind(this))
            .catch(function (err) {

            })
    }

    saveEdit() {
        this.props.blogActions.updateBlog({ editMode: true })
        localStorage.removeItem('editBlog')
    }

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

    updateViews = () => {
        axios.post(env.httpURL, {
            'queryMethod': 'updateViews',
            'queryData': {
                _id: this.props.blog._id
            }
        })
            .then((o) => {
            })
            .catch((err) => {
                return false
            })
    }

    componentDidMount() {
        this.getComments()
        this.getShortURL()
        this.handleEditorStateEdit()
        this.props.blogActions.updateBlog({ editMode: false })
        if (this.props.blog) {
            this.getAauthorAvatar()
        }
        this.setState({ youLike: true })
        if (localStorage.getItem('user')) {
            this.setState({ userLoggedIn: true })
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
                        this.setState({ youLike: false })
                        return false
                    }
                    if (!response.data.state) {
                        this.setState({ youLike: false })
                        return false
                    }
                    if (response.data.state === false) {
                        this.setState({ youLike: false })
                        return false
                    }
                    if (response.data.state === true) {
                        if (response.data.n) {
                            this.setState({ youLike: true })
                            return true
                        } else {
                            return false
                        }
                    }
                }.bind(this))
                .catch(function (err) {
                    this.setState({ youLike: false })
                    return false
                }.bind(this))
        }
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
                            this.props.blogActions.updateBlog({ likes: 1 + this.props.blog.likes })
                            this.setState({ youLike: true })
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
                    this.props.blogActions.resetBlog({ id: null })
                    this.props.navigateBlogs({})
                }.bind(this))
                .catch(function (err) {
                }.bind(this))
        }
    };

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
        this.props.blogActions.updateBlog({ [e.target.name]: e.target.value })
    }

    handleSave = () => {
        let body = localStorage.getItem('editBlog')
        let update = {
            title: this.state.title,
            wordCount: this.props.blog.wordCount,
            about: this.props.blog.about
        }
        let o = { editMode: false, title: this.state.title }
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
            .then(function (o) {
                localStorage.removeItem('editBlog')
            }.bind(this))

            .catch(function (err) {

            }.bind(this))
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

    onCommentChange =(e)=> {
        this.setState({ mess: e.target.value })
    }

    submitComment =()=> {
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

    updateComments =(c)=> {
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

    handleFormField =(e) =>{
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    onLoginClick = () => {
        this.setState({ logingin: true })
        if (!this.state.userName || !this.state.password) {
            this.setState({
                error: true,
                hideMessage: false,
                logingin: false,
                errorDetails: { field: 'Login', message: 'Invalid login details' }
            })
            setTimeout(function () {
                this.setState({ error: false, hideMessage: true })
            }.bind(this), 2000)
            return false
        }
        let userData = {
            userName: this.state.userName,
            password: this.state.password
        }
        axios.post(env.httpURL, {
            'queryMethod': 'loginUser',
            'queryData': userData
        })
            .then(function (success) {
                if (!success.data) {
                    this.setState({
                        error: true,
                        hideMessage: false,
                        errorDetails: { field: 'Login', message: 'An error occurred, Check your Internet' }
                    })
                    setTimeout(function () {
                        this.setState({ error: false, hideMessage: true })
                    }.bind(this), 2000)
                    return false
                }
                if (success.data.id) {
                    let user = success.data
                    success.data.name = success.data.userName
                    this.setState({ logingin: false })
                    this.props.userActions.updateUser(user)
                    localStorage.setItem('user', JSON.stringify(success.data))
                    this.setState({ open: false })
                } else {
                    this.setState({
                        error: true,
                        hideMessage: false,
                        logingin: false,
                        errorDetails: { field: 'Login', message: success.data.error }
                    })
                    setTimeout(function () {
                        this.setState({ error: false, hideMessage: true })
                    }.bind(this), 2000)
                }
            }.bind(this))
            .catch(function (e) {
                console.log(e)
                this.setState({
                    error: true,
                    hideMessage: false,
                    logingin: false,
                    errorDetails: { field: 'Login', message: 'An erro occured, Check your Internet' }
                })
                setTimeout(function () {
                    this.setState({ error: false, hideMessage: true })
                }.bind(this), 2000)
            }.bind(this))
    }

    render() {
        const { open, dimmer } = this.state
        const BlogComments = (arr) => {
            return (<Comment.Group threaded>
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
                                    <span href={''} onClick={() => this.setReplyComment(c._id)}>Reply</span>
                                    {
                                        this.props.user && this.props.user._id && this.props.user._id === c.userID ?
                                            <span onClick={() => this.showDeleteComment(c._id)}>Delete</span> : null
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
                            <Form.TextArea onChange={this.onCommentChange} />
                            <Button onClick={() => this.submitComment('')} content='Add Comment' labelPosition='left'
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
        let likes = inWords(this.props.blog.likes)
        let likeMesage = this.state.youLike ? 'You already liked this post' : 'Like this post'
        let shares = socialShares.map(s => {
            return <Popup
                inverted
                key={s.name}
                trigger=
                {<span><Button
                    onClick={() => {
                        this[s.shareCounter]()
                    }}
                    circular color={s.color} icon={s.icon} />
                    <sup>{this.props.blog[s.count]}</sup>
                    {'   '}
                </span>}
                content={`Share this on ${s.name} `}
            />
        })
        return (
            <div>
                <Confirm
                    open={this.state.cdelopen}
                    onCancel={this.handleCancelDeleteComment}
                    onConfirm={this.handleConfirmDeleteComment}
                />
                <Modal dimmer open={this.state.showDelete}>
                    <Modal.Header>This Post will be deleted</Modal.Header>
                    <Modal.Content image>
                        <Modal.Description>
                            <Header style={{ textAlign: 'left', alignment: 'center' }} color={this.props.vars.color}
                                as='h1'>
                                {
                                    this.props.blog.title
                                }
                            </Header>
                            <span className='info'>
                                Published: {moment().to(this.props.blog.date)}
                                <br />
                                {this.props.blog.date}
                            </span>
                            <br />
                            <br />
                            <span className='info'>
                                {this.props.blog.author.name} {' '}
                            </span>
                            <div style={{ margin: '2em 0em 3em 0em', fontSize: '16px', fontFamily: 'georgia' }}>
                                <br />
                                <div>{
                                    this.state.editorState ?
                                        <PreviewEditor title={this.props.blog.title}
                                            editorState={this.state.editorState} /> :
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
                            onClick={() => this.deletBlog(this.props.blog.id)} />
                    </Modal.Actions>
                </Modal>
                <Modal dimmer={dimmer} open={open} onClose={this.close}>
                    <Modal.Header>Select a Photo</Modal.Header>
                    <Modal.Content image>
                        <Modal.Description>
                            <LoginForm
                                color={this.props.vars.colors[0]}
                                logingin={this.state.logingin}
                                handleFormField={this.handleFormField}
                                onLoginClick={this.onLoginClick}
                                errorDetails={this.state.errorDetails}
                                error={this.state.error}
                                success={this.state.success}
                                hideMessage={this.state.hideMessage}
                            />
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='black' onClick={this.close}>
                            Nope
                        </Button>
                        <Button positive icon='checkmark' labelPosition='right' content="Take me to Login" onClick={this.close} />
                    </Modal.Actions>
                </Modal>
                {
                    this.props.blog
                        ? <div>
                            {
                                !this.props.blog.editMode ?
                                    <Visibility once={false} onBottomPassed={this.updateViews}>
                                        <Header style={{ textAlign: 'left', alignment: 'center' }} color={this.props.vars.color}
                                            as='h1'>
                                            {
                                                this.props.blog.title
                                            }
                                        </Header>

                                    </Visibility>
                                    :
                                    <div>
                                        <Header style={{ textAlign: 'left', alignment: 'center' }}
                                            color={this.props.vars.color} as='h3'>
                                            <span>Title: </span> <Input name='title' onChange={this.handleInputChange}
                                                value={this.state.title} />
                                            {' '}
                                            <span>Words </span> <Input name='wordCount' onChange={this.handleInputChange}
                                                value={this.props.blog.wordCount} />
                                        </Header>

                                    </div>

                            }
                             <br/>
                            <div className='shareIcon clearElem'
                                style={{ display: 'block', fontSize: '16px', fontFamily: 'georgia' }}>
                                {
                                    this.state.userLoggedIn
                                        ? <span>
                                            {
                                                this.state.youLike
                                                    ?
                                                    <span>
                                                        <Popup
                                                            inverted
                                                            trigger=
                                                            {<span>
                                                                <Icon size='small' inverted circular color='blue'
                                                                    name='thumbs up' />

                                                            </span>}
                                                            content={likeMesage}
                                                        />
                                                        {`Likes `}
                                                        <sup>{this.props.blog.likes}</sup>
                                                    </span>


                                                    :
                                                    <span>
                                                        <Popup
                                                            inverted
                                                            trigger=
                                                            {<span>
                                                                <Button size='mini'
                                                                    onClick={() => this.updateLikes(this.props.blog.id)}
                                                                    circular color='blue' icon='thumbs up' />

                                                            </span>}
                                                            content={likeMesage}
                                                        />
                                                        <span>
                                                            {`Likes `}
                                                            <sup>{this.props.blog.likes}</sup>

                                                        </span>
                                                    </span>


                                            }
                                            <span>
                                                {`  ,  `}
                                                <Icon size='small' inverted circular color='blue'
                                                    name='eye' />
                                                {`Views `}<sup>{this.props.blog.views}</sup>
                                            </span>
                                        </span>
                                        :
                                        <Popup
                                            inverted
                                            trigger=
                                            {<span>
                                                <Icon size='small' inverted circular color='blue' name='like outline' />
                                                <Icon size='small' inverted circular color='red' name='like' />
                                                <br />
                                                {`${toTitleCase(likes)} ${peopleU(this.props.blog.likes)}`}
                                            </span>}
                                            content={likeMesage}
                                        />

                                }
                                {` ,  `}
                                <Icon size='large' color='green' name='external share' />
                                {shares}
                                <br />
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
                                <br />
                                <span className='info'>
                                    Published
                                    {' '}{moment().to(this.props.blog.date)}
                                </span>
                                <br />
                                <span className='info'>
                                    {this.props.blog.author.name} {' '}
                                </span>
                                <br />
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
                            <br />
                            <div style={{ margin: '0em 0em 3em 0em', fontSize: '16px', fontFamily: 'georgia' }}>
                                {
                                    this.props.blog.headerImage ?

                                        <Image alt={this.props.blog.topics.join(',')} fluid style={{ maxHeight: '500px' }} src={`${this.props.vars.env.httpURL}${this.props.blog.headerImage.name}`} /> : null
                                }
                                <br />
                                {
                                    this.state.editorState ?
                                        <BlogEditor initEditorState={this.state.editorState} mode={'edit'}
                                            className='editor' editorState={this.props.blog.body} /> :
                                        <div>Loading state</div>
                                }
                            </div>
                            <div>
                                {
                                    this.props.blog.editMode ?
                                        <Form style={{ padding: '2em 2em 2em 2em' }}>
                                            <Form.TextArea maxLength='140' onChange={this.handleAboutChange}
                                                label='About your blog'
                                                value={this.props.blog.about} />
                                        </Form>
                                        : null
                                }
                            </div>
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
