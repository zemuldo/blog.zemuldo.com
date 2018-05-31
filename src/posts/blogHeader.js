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

const menuStyle = {
    border: 'none',
    borderRadius: 0,
    boxShadow: 'none',
    marginBottom: '1em',
    marginTop: '4em',
    transition: 'box-shadow 0.5s ease, padding 0.5s ease',
}

const fixedMenuStyle = {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
}

const overlayStyle = {
    float: 'left',
}

const fixedOverlayStyle = {
    ...overlayStyle,
    position: 'fixed',
    top: '10%',
    zIndex: 10,
}

const overlayMenuStyle = {
    position: 'relative',
    transition: 'left 0.5s ease',
}

const fixedOverlayMenuStyle = {
    ...overlayMenuStyle,
    left: '1000px',
}

const env = config[process.env.NODE_ENV] || 'development'

class BlogHeader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            youLike: false,
            showDelete: false,
            userLoggedIn: false,
            likes: this.props.vars.currentBlog ? this.props.vars.currentBlog.likes : 0,
            title: this.props.vars.currentBlog.title,
            wordCount: 0,
            blogUrl: blogUrl(this.props.vars.currentBlog),
            blogUrlT: blogUrl(this.props.vars.currentBlog),
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
    show = dimmer => () => this.setState({ dimmer, open: true });

    close = () => this.setState({ open: false })

    showDeleteComment = (_id) => this.setState({ cdelopen: true, commentToDelete: _id });

    handleConfirmDeleteComment = () => {
        this.deleteComments(this.state.commentToDelete);
        this.setState({ cdelopen: false })
    };

    handleCancelDeleteComment = () => this.setState({ cdelopen: false });

    handleFormFieldEdit = (e, data) => {
        this.props.blogActions.updateBlog({ [data.name]: data.value })
    }



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
                    fbC: this.props.vars.currentBlog.fbC + (res.data.share.share_count) ? res.data.share.share_count : 0
                })
                return true
            })
            .catch((err) => {
                this.props.blogActions.updateBlog({
                    fbC: this.props.vars.currentBlog.fbC
                })
            })
    };

    getTWTCount(shareUrl) {
        return axios.get('https://public.newsharecounts.com/count.json?url=' + shareUrl, {})
            .then((res) => {
               
                this.props.blogActions.updateBlog({
                    twtC: this.props.vars.currentBlog.twtC + (res.data.count) ? res.data.count : 0
                })
            })
            .catch((err) => {
                this.props.blogActions.updateBlog({
                    twtC: this.props.vars.currentBlog.twtC
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
                    gplsC: this.props.vars.currentBlog.gplsC + 0
                })
            })
    };

    getAauthorAvatar() {
        axios.post(env.httpURL, {
            'queryMethod': 'getAvatar',
            'queryData': {
                'id': this.props.vars.currentBlog.authorID
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
            'queryData': { postID: this.props.vars.currentBlog._id }
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
        axios.post(env.fupisha, { url: `https://blog.zemuldo.com/${this.props.vars.currentBlog._id}`, custom_longUrl: `${window.location.href}` })
            .then(o => {
                this.setState({ blogUrl: o.data })
                this.setBlogCounts(this.state.blogUrl.shortUrl)
                this.setBlogCounts(`https://blog.zemuldo.com/${this.state.blogUrlT}`)
            })
            .catch(e => {
                console.log(e)
            })
    }

    updateViews = () => {
        axios.post(env.httpURL, {
            'queryMethod': 'updateViews',
            'queryData': {
                _id: this.props.vars.currentBlog._id
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
        if (this.props.vars.currentBlog) {
            let postURL = this.state.blogUrl.pathname
            let shareURL = fbShareURL + "&amp;src=sdkpreparse'"
            window.open(shareURL, 'sharer', 'toolbar=0,status=0,width=548,height=325')
        }
    }

    tweetShare() {
        if (this.props.vars.currentBlog) {
            let hashTgs = '%2F&hashtags=' + this.props.vars.currentBlog.topics.join(',')
            let via = '&via=zemuldo'
            let url = `&url=https%3A%2F%2F${this.state.blogUrl.shortUrl_Bare}`
            let fullURL = `${url}${via}`
            let shareURL = 'https://twitter.com/intent/tweet?' + this.props.vars.currentBlog.title + fullURL
            window.open(shareURL, 'sharer', 'toolbar=0,status=0,width=548,height=325')
        }
    }

    gplusShare() {
        if (this.props.vars.currentBlog) {
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
                    title: this.props.vars.currentBlog.title,
                    userID: JSON.parse(localStorage.getItem('user')).id
                }
            })
                .then(function (response) {
                    if (response.data.state === false) {
                        return
                    }
                    if (response.data.n) {
                        if (response.data.n) {
                            this.props.blogActions.updateBlog({ likes: 1 + this.props.vars.currentBlog.likes })
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
                    this.props.vars.blogActions.resetBlog({ id: null })
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
            wordCount: this.props.vars.currentBlog.wordCount,
            about: this.props.vars.currentBlog.about,
            topics: this.props.vars.currentBlog.topics,
            type: this.props.vars.currentBlog.type
        }
        let o = { editMode: false, title: this.state.title }
        update.body = this.props.vars.currentBlog.body
        if (body) {
            o.body = body
            update.body = body
        }

        this.props.blogActions.updateBlog(o);
        axios.post(env.httpURL, {
            queryMethod: 'updateBlog',
            'queryData': {
                _id: this.props.vars.currentBlog.postID,
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
                postID: this.props.vars.currentBlog._id,
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
                    postID: this.props.vars.currentBlog._id,
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
                            postID: this.props.vars.currentBlog._id,
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

    handleFormField = (e) => {
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

    stickOverlay = () => this.setState({ overlayFixed: true })

    stickTopMenu = () => this.setState({ menuFixed: true })

    unStickOverlay = () => this.setState({ overlayFixed: false })

    unStickTopMenu = () => this.setState({ menuFixed: false })

    render() {
        const { menuFixed, overlayFixed, overlayRect } = this.state
        const { open, dimmer } = this.state
        let likes = inWords(this.props.vars.currentBlog.likes)
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
                    <sup>{this.props.blog[s.count] || 0}</sup>
                    {'   '}
                </span>}
                content={`Share this on ${s.name} `}
            />
        })
        return (
            <div>
                <Helmet>
                    <title>{`Zemuldo Blogs- ${this.props.vars.currentBlog.title}`}</title>
                    <meta name="description" content={this.props.vars.currentBlog.about} />
                    < meta name="keywords" content={this.props.vars.currentBlog.topics.join(',')} />
                </Helmet>
                <Confirm
                    open={this.state.cdelopen}
                    onCancel={this.handleCancelDeleteComment}
                    onConfirm={this.handleConfirmDeleteComment}
                />
                <Modal dimmer open={this.state.showDelete}>
                    <Modal.Header>This Post will be deleted</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <Header style={{ textAlign: 'left', alignment: 'center' }} color={this.props.vars.color}
                                as='h1'>
                                {
                                    this.props.vars.currentBlog.title
                                }
                            </Header>
                            <span className='info'>
                                Published: {moment().to(this.props.vars.currentBlog.date)}
                                <br />
                            </span>
                            <span>
                                <ZPopup
                                    trigger={<span><Icon size='small' inverted circular color='blue' name='thumbs up' /></span>}
                                    content={likeMesage}
                                    name=''
                                />
                                {`Likes `}
                                <sup>{this.props.vars.currentBlog.likes}</sup>
                            </span>
                            <span>
                                {`  ,  `}
                                <Icon size='small' inverted circular color='blue'
                                    name='eye' />
                                {`Views `}
                                <sup>{this.props.vars.currentBlog.views}</sup>
                            </span>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='green' onClick={() => this.closeDelete()}>
                            Cancel
                        </Button>
                        <Button color='red' icon='checkmark' labelPosition='right' content='Delete'
                            onClick={() => this.deletBlog(this.props.vars.currentBlog.id)} />
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
                    this.props.vars.currentBlog
                        ? <div>
                            {
                                !this.props.blog.editMode ?
                                    <Visibility once={true} onBottomPassed={this.updateViews}>
                                        <Header style={{ textAlign: 'left', alignment: 'center' }} color={this.props.vars.color}
                                            as='h1'>
                                            {
                                                this.props.vars.currentBlog.title
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
                                                value={this.props.vars.currentBlog.wordCount} />
                                        </Header>

                                    </div>

                            }
                            <br />
                            <div className='shareIcon clearElem'
                                style={{ display: 'block', fontSize: '16px', fontFamily: 'georgia' }}>
                                <Header as='h2' color='blue'>
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
                                                            <sup>{this.props.vars.currentBlog.likes}</sup>
                                                        </span>


                                                        :
                                                        <span>
                                                            <ZPopup
                                                                trigger={<Button onClick={() => this.updateLikes(this.props.vars.currentBlog.id)} color='blue' circular icon='thumbs up' />}
                                                                content={likeMesage}
                                                            />
                                                            <span>
                                                                {`Likes `}
                                                                <sup>{this.props.vars.currentBlog.likes}</sup>
                                                            </span>
                                                        </span>
                                                }
                                                <span>
                                                    {`  ,  `}
                                                    <Icon size='small' inverted circular color='blue'
                                                        name='eye' />
                                                    {`Views `}<sup>{this.props.vars.currentBlog.views}</sup>
                                                </span>
                                            </span>
                                            :
                                            <ZPopup
                                                trigger={<span><Icon size='small' inverted circular color='blue' name='like outline' /> {likes}</span>}
                                                content={likeMesage}
                                            />

                                    }
                                    <span> {` ,  `}
                                        <Icon size='large' color='green' name='external share' />
                                        {shares}
                                    </span>
                                    <Visibility
                                        once={false}
                                        onTopPassed={this.stickOverlay}
                                        onTopVisible={this.unStickOverlay}
                                        style={overlayFixed ? { ...overlayStyle, ...overlayRect } : {}}
                                    />
                                    {
                                        overlayFixed ?
                                            <div
                                                style={overlayFixed ? fixedOverlayStyle : overlayStyle}
                                            >
                                                <Menu
                                                    secondary
                                                    style={overlayFixed ? fixedOverlayMenuStyle : overlayMenuStyle}
                                                    vertical={!!overlayFixed}
                                                >
                                                    {
                                                        times(shares.length, (i) =>
                                                            <Menu.Item key={i}>
                                                                {shares[i]}
                                                            </Menu.Item>
                                                        )
                                                    }
                                                </Menu>
                                            </div> : null
                                    }
                                </Header>

                                <br />
                                <span className='info font-24'>
                                    Published
                                    {` ${moment().to(this.props.vars.currentBlog.date)} By `}
                                </span>
                                <span>
                                    <Popup
                                        inverted
                                        trigger={<Image

                                            spaced={true}
                                            avatar
                                            id='photo'
                                            size='tiny'
                                            src={env.httpURL + this.props.vars.currentBlog.author.url}
                                            style={{
                                                borderStyle: 'solid',
                                                borderWidth: '3px',
                                                borderColor: 'green',
                                                borderRadius: `${(Math.min(
                                                    this.props.vars.currentBlog.author.style.height,
                                                    this.props.vars.currentBlog.author.style.width
                                                ) +
                                                    10) *
                                                    this.props.vars.currentBlog.author.style.borderRadius / 2 / 100}px`
                                            }}
                                        />}
                                    >
                                        <h3>
                                            {this.props.vars.currentBlog.author.name}
                                        </h3>
                                        <span>
                                            {`Joined ${moment().to(this.props.vars.currentBlog.author.created)}`}
                                        </span>
                                    </Popup>

                                </span>

                                <span className='info'>
                                    {this.props.vars.currentBlog.author.name} {' '}
                                </span>
                                <br />
                                {
                                    this.props.user && this.props.user.id && this.props.user.userName === this.props.vars.currentBlog.author.userName
                                        ? <div>
                                            <Dropdown color='blue' icon={null} trigger={<span><Icon color='blue' name='settings' color='blue' size='large' /> Manage</span>} pointing='left' className='link item info font-24 '>
                                                <Dropdown.Menu>
                                                    <Dropdown.Header icon='tasks' content='Manage this post' />
                                                    <Dropdown.Item className='onHoverDanger' as='a' color='red'
                                                        onClick={() => this.openDelete()}>
                                                        <Icon color='red' name='delete' />
                                                        <span >
                                                            Delete
                                                        </span>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        onClick={() => this.saveEdit()}
                                                    >
                                                        <Icon color='green' name='edit' />
                                                        <span >
                                                            Edit
                                                        </span>

                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        onClick={this.handleSave}
                                                    >
                                                        <Icon color='blue' name='save' />
                                                        <span >
                                                            save
                                                        </span>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item className='onHoverWarn' >
                                                        <Icon color='orange' name='privacy' />
                                                        <span >
                                                            Hide
                                                        </span>
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                        : null
                                }
                            </div>
                            <br />
                            <div style={{ margin: '0em 0em 3em 0em', fontSize: '16px', fontFamily: 'georgia' }}>
                                {
                                    this.props.vars.currentBlog.headerImage ?

                                        <Image alt={this.props.vars.currentBlog.topics.join(',')} fluid style={{ maxHeight: '500px' }} src={`${this.props.vars.env.httpURL}${this.props.vars.currentBlog.headerImage.name}`} /> : null
                                }
                            </div>
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

BlogHeader.propTypes = {
    blog: PropTypes.object.isRequired,
    user: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.oneOf([null])
    ]),
    vars: PropTypes.object.isRequired,
    blogActions: PropTypes.object.isRequired,
    navigateBlogs: PropTypes.func.isRequired

}

export default connect(mapStateToProps, mapDispatchToProps)(BlogHeader)
