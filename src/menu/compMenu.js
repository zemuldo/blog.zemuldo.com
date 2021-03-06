import React from 'react'
import { Menu, Icon, Dropdown, Image, Input, Visibility, Segment, Responsive, Container, Divider } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as VarsActions from '../store/actions/vars'
import * as UserActions from '../store/actions/user'
import * as BlogsActions from '../store/actions/blogs'
import { bindActionCreators } from 'redux'
import axios from 'axios'
import config from '../env'
import * as BlogActions from '../store/actions/blog'
import PropTypes from 'prop-types'

const env = config[process.env.NODE_ENV] || 'development'

class ComMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    };

    componentDidMount() {
        window.addEventListener('resize', this.resize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }

    handleHomeClick = () => {
        window.scrollTo(0, 0)
        this.props.blogActions.resetBlog()
        this.props.varsActions.updateVars({ currentLocation: 'home', topic: 'all' })
    };
    handleMenuItemClick = (e, { name }) => {
        window.scrollTo(0, 0)
        this.props.blogActions.resetBlog()
        if (name === 'search') {
            return false
        }
        let newVars = this.props.vars
        newVars.blogsAreLoading = true
        if (name !== 'home' || name !== 'login') {
            this.props.varsActions.updateVars({ currentLocation: name, topic: 'all' })
        }
    };
    handleLogoutinButton = () => {
        localStorage.removeItem('user')
        this.props.userActions.updateUser({ id: null, _id: null })
    };
    handleCreateNew = () => {
        let editorState = window.localStorage.getItem('draftContent')
        let blogData = window.localStorage.getItem('blogData')
        if (editorState && blogData) {
            this.props.varsActions.updateVars({ editingMode: true, createNew: true, currentLocation: 'profile' })
        } else {
            this.props.varsActions.updateVars({ editingMode: false, createNew: true, currentLocation: 'profile' })
        }
    };
    handleProfile = () => {
        this.props.varsActions.updateVars({ editingMode: false, createNew: false, currentLocation: 'profile' })
    };

    handleFilterChange = (e) => {
        let query = {}
        let queryMthod = 'getAllPosts'
        if (this.props.vars.currentLocation !== 'home') {
            query.type = this.props.vars.currentLocation
        }
        if (e.target.value !== '') {
            query.filter = e.target.value
            queryMthod = 'getFiltered'
        }
        e.preventDefault()
        axios.post(env.httpURL, {
            'queryMethod': queryMthod,
            'queryData': query
        })
            .then(response => {
                this.props.blogsActions.updateBlogs(response.data)
            })
            .catch(err => {
                this.props.blogsActions.updateBlogs([])
                return err
            })
    }

    resize = () => this.forceUpdate();

    hideFixedMenu = () => this.setState({ fixed: false })
    showFixedMenu = () => this.setState({ fixed: true })

    render() {
        let urlDetails = 'all'
        const { fixed } = this.state
        return (
            <div>
                <Responsive >
                    <Visibility once={false} onBottomPassed={this.showFixedMenu} onBottomPassedReverse={this.hideFixedMenu}>
                        <Segment style={{ backgroundColor: '#252629', maxHeight: '40px' }} textAlign='center' vertical>
                            <Menu
                            
                                style={{ padding: '0px 10px 0px 10px', fontSize: '18px', maxHeight: '50px', backgroundColor: '#252629' }}
                                text={!fixed}
                                fixed={fixed ? 'top' : null}
                                secondary={!fixed}
                                borderless
                                size='tiny'
                                color={this.props.vars.colors[0]}
                            >
                                <Container>
                                    <Link to='/'>
                                        <Image  style={{
                                                                borderStyle: 'solid',
                                                                borderWidth: '3px',
                                                                borderRadius:'50%'
                                                            }} alt='zemuldo creator danstan' circular size={'tiny'} src={`${env.static}img/creator/dan.jpg`} />
                                    </Link>
                                    <Menu.Item
                                        style={{ fontSize: '24px' }}
                                        as='span'
                                        className=''
                                        name='home'
                                        onClick={this.handleHomeClick}>
                                        <span className='colorWhite' color={'white'}><Link className='colorWhite' to='/'>Zemuldo Blogs</Link></span>
                                    </Menu.Item>
                                    <Menu.Menu position='right'>
                                        {
                                            window.innerWidth > 1030 ?
                                                <Menu.Item
                                                    style={{ fontSize: '12px' }}
                                                    name='search'
                                                >
                                                    <Input
                                                        icon={<Icon color='blue' name='search' inverted circular link />}
                                                        placeholder='Search...'
                                                        onChange={this.handleFilterChange}
                                                    />
                                                </Menu.Item> : null
                                        }
                                        {
                                            (!this.props.user || !this.props.user.id)
                                                ? <Menu.Item
                                                    as='span'
                                                    position='right'
                                                    name='login'
                                                    color={this.props.vars.colors[0]}
                                                    onClick={this.handleMenuItemClick}>
                                                    <Icon color={this.props.vars.colors[0]} name='unlock' />
                                                    <span style={{ color: 'black' }}><Link to='/login'>Login</Link></span>
                                                </Menu.Item>
                                                : <Menu.Item>
                                                    <Dropdown
                                                        icon={null}
                                                        className='dropDown'
                                                        trigger={<Image
                                                            alt={'blogd.zemuldo.com_' + this.props.user.userName + '+_profile_pic'}

                                                            id='photo'
                                                            avatar
                                                            size='mini'
                                                            src={env.httpURL + this.props.user.avatarURL}
                                                            style={{
                                                                borderStyle: 'solid',
                                                                borderWidth: '2px',
                                                                borderRadius: `${(Math.min(
                                                                    this.props.user.avatar.height,
                                                                    this.props.user.avatar.width
                                                                ) +
                                                                    10) *
                                                                    (this.props.user.avatar.borderRadius / 2 / 100)}px`
                                                            }}
                                                        />}
                                                        style={{ color: 'blue' }}
                                                        pointing='top right'
                                                    >

                                                        <Dropdown.Menu>
                                                            <Dropdown.Header>
                                                                <Icon size='huge' color='blue' name='user circle' />
                                                                {`Hi ${this.props.user.firstName} ${this.props.user.lastName}`}
                                                            </Dropdown.Header>
                                                            <Dropdown.Divider />
                                                            <Dropdown.Item as='span' onClick={this.handleProfile}>
                                                                <Icon color={this.props.vars.colors[0]} name='user circle' />
                                                                <Link to={'/user/' + this.props.user.userName}
                                                                    color={this.props.vars.colors[1]}>Your Profile</Link>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item as='span'>
                                                                <Icon color={this.props.vars.colors[1]} name='users' />
                                                                <Link to={'/user/' + this.props.user.userName + '/followers'}
                                                                    color={this.props.vars.colors[2]}>Followers</Link>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item as='span'>
                                                                <Icon color={this.props.vars.colors[2]} name='help' />
                                                                <Link to={'/user/' + this.props.user.userName + '/help'}
                                                                    color={this.props.vars.colors[0]}>Help</Link>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item as='span' onClick={this.handleCreateNew}>
                                                                <Icon color={this.props.vars.colors[3]} name='plus' />
                                                                <Link to={'/user/' + this.props.user.userName + '/editor'}
                                                                    color={this.props.vars.colors[0]}>New Article</Link>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item as='span'>
                                                                <Icon color={this.props.vars.colors[1]} name='setting' />
                                                                <Link to={'/user/' + this.props.user.userName + '/settings'}
                                                                    color={this.props.vars.colors[1]}>Settings</Link>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item as='span' onClick={this.handleLogoutinButton}>
                                                                <Icon color={'red'} name='shutdown' />
                                                                <span className='colorBlue' color={this.props.vars.colors[0]}>Sign Out</span>
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </Menu.Item>
                                        }
                                    </Menu.Menu>
                                </Container>
                            </Menu>
                        </Segment>
                    </Visibility>
                </Responsive>
                <br />
                <br />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        vars: state.vars
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        blogActions: bindActionCreators(BlogActions, dispatch),
        userActions: bindActionCreators(UserActions, dispatch),
        varsActions: bindActionCreators(VarsActions, dispatch),
        blogsActions: bindActionCreators(BlogsActions, dispatch)
    }
}

ComMenu.propTypes = {
    user: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.oneOf([null])
    ]),
    vars: PropTypes.object.isRequired,
    blogActions: PropTypes.object.isRequired,
    varsActions: PropTypes.object.isRequired,
    userActions: PropTypes.object.isRequired,
    blogsActions: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ComMenu)
