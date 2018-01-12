import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import {Menu, Icon, Dropdown, Image, Input} from 'semantic-ui-react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import * as VarsActions from '../state/actions/vars'
import * as UserActions from '../state/actions/user'
import * as BlogsActions from '../state/actions/blogs'
import {bindActionCreators} from 'redux'
import axios from 'axios/index'
import config from '../environments/conf'
import * as BlogActions from '../state/actions/blog'
import PropTypes from 'prop-types'

const env = config[process.env.NODE_ENV] || 'development'

class ComMenu extends React.Component {
   constructor(props) {
      super(props)
      this.state = {}
      this.handleFilterChange = this.handleFilterChange.bind(this)
   };

   componentDidMount(){
      window.addEventListener('resize', this.resize)
   }

   componentWillUnmount(){
      window.removeEventListener('resize', this.resize)
   }

   handleHomeClick = () => {
      window.scrollTo(0, 0)
      this.props.blogActions.resetBlog()
      this.props.varsActions.updateVars({currentLocation: 'home', topic: 'all'})
   };
   handleMenuItemClick = (e, {name}) => {
      window.scrollTo(0, 0)
      this.props.blogActions.resetBlog()
      if (name === 'search') {
         return false
      }
      let newVars = this.props.vars
      newVars.blogsAreLoading = true
      if (name !== 'home' || name !== 'login') {
         this.props.varsActions.updateVars({currentLocation: name, topic: 'all'})
      }
   };
   handleLogoutinButton = () => {
      localStorage.removeItem('user')
      this.props.userActions.updateUser({id: null})
   };
   handleCreateNew = () => {
      let editorState = window.localStorage.getItem('draftContent')
      let blogData = window.localStorage.getItem('blogData')
      if (editorState && blogData) {
         this.props.varsActions.updateVars({editingMode: true, createNew: true, currentLocation: 'profile'})
      } else {
         this.props.varsActions.updateVars({editingMode: false, createNew: true, currentLocation: 'profile'})
      }
   };
   handleProfile = () => {
      this.props.varsActions.updateVars({editingMode: false, createNew: false, currentLocation: 'profile'})
   };

   handleFilterChange(e) {
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

   render() {
      let urlDetails = 'all'
      return (
          <div>
             <Menu
                 style={{backgroundColor: 'black', padding: '0px 10px 0px 10px', fontSize: '18px'}}
                 fixed='top'
                 size='tiny'
                 secondary
                 color={this.props.vars.colors[0]}
                 borderless
             >
                <Menu.Item
                    as='span'
                    className=''
                    name='home'
                    active={this.props.vars.currentLocation === 'home'}
                    onClick={this.handleHomeClick}>
                   <Icon color={this.props.vars.colors[0]} name='home'/>
                   <span color={this.props.vars.colors[0]}><Link to='/home/all'>Home</Link></span>
                </Menu.Item>
                <Menu.Item
                    as='span'
                    name='dev'
                    active={this.props.vars.currentLocation === 'dev'}
                    onClick={this.handleMenuItemClick}>
                   <Icon color={this.props.vars.colors[0]} name='code'/>
                   <span color={this.props.vars.colors[0]}><Link to={'/dev/' + urlDetails}>Dev</Link></span>
                </Menu.Item>
                <Menu.Item
                    as='span'
                    name='business'
                    active={this.props.vars.currentLocation === 'business'}
                    onClick={this.handleMenuItemClick}>
                   <Icon color={this.props.vars.colors[0]} name='creative commons'/>
                   <span color={this.props.vars.colors[0]}><Link
                       to={'/business/' + urlDetails}>Business</Link></span>
                </Menu.Item>
                <Menu.Item
                    as='span'
                    name='tech'
                    active={this.props.vars.currentLocation === 'tech'}
                    onClick={this.handleMenuItemClick}>
                   <Icon color={this.props.vars.colors[0]} name='server'/>
                   <span color={this.props.vars.colors[0]}><Link to={'/tech/' + urlDetails}>Tech</Link></span>
                </Menu.Item>
                <Menu.Item
                    as='span'
                    name='reviews'
                    active={this.props.vars.currentLocation === 'reviews'}
                    onClick={this.handleMenuItemClick}>
                   <Icon color={this.props.vars.colors[0]} name='circle notched'/>
                   <span color={this.props.vars.colors[0]}><Link
                       to={'/reviews/' + urlDetails}>Reviews</Link></span>
                </Menu.Item>
                <Menu.Menu position='right'>
                   {
                      window.innerWidth>1030?
                          <Menu.Item
                              style={{fontSize: '12px'}}
                              name='search'
                              onClick={this.handleMenuItemClick}>
                             <Input
                                 icon={<Icon name='search' inverted circular link/>}
                                 placeholder='Search...'
                                 onChange={this.handleFilterChange}
                             />
                          </Menu.Item>:null
                   }
                   {
                      (!this.props.user || !this.props.user.id)
                          ? <Menu.Item
                              as='span'
                              position='right'
                              name='login'
                              color={this.props.vars.colors[0]}
                              onClick={() => {
                                 this.props.varsActions.updateVars({curentLocation: 'login', signUp: false})
                              }}>
                             <Icon color={this.props.vars.colors[0]} name='unlock'/>
                             <span style={{color: 'black'}}><Link to='/login'>Login</Link></span>
                          </Menu.Item>
                          : <Menu.Item>
                             <Dropdown
                                 className='dropDown'
                                 trigger={<Image
                                     alt={'blogd.zemuldo.com_' + this.props.user.userName + '+_profile_pic'}
                                     avatar
                                     wrapped
                                     id='photo'
                                     size='tiny'
                                     src={this.props.vars.profilePic}
                                     style={{
                                        marginLeft: '50%',
                                        borderStyle: 'solid',
                                        borderWidth: '1px',
                                        borderRadius: `${(Math.min(
                                            JSON.parse(this.props.user.avatar).height,
                                            JSON.parse(this.props.user.avatar).width
                                            ) +
                                            10) *
                                        (JSON.parse(this.props.user.avatar).borderRadius / 2 / 100)}px`
                                     }}
                                 />}
                                 style={{color: this.props.vars.colors[0]}}
                                 pointing='top right'
                                 item
                             >
                                <Dropdown.Menu>
                                   <Dropdown.Item as='span' onClick={this.handleProfile}>
                                      <Icon color={this.props.vars.colors[0]} name='user circle'/>
                                      <Link to={'/user/' + this.props.user.userName}
                                            color={this.props.vars.colors[1]}>Your Profile</Link>
                                   </Dropdown.Item>
                                   <Dropdown.Item as='span'>
                                      <Icon color={this.props.vars.colors[0]} name='users'/>
                                      <Link to={'/user/' + this.props.user.userName + '/followers'}
                                            color={this.props.vars.colors[2]}>Followers</Link>
                                   </Dropdown.Item>
                                   <Dropdown.Item as='span'>
                                      <Icon color={this.props.vars.colors[0]} name='help'/>
                                      <Link to={'/user/' + this.props.user.userName + '/help'}
                                            color={this.props.vars.colors[0]}>Help</Link>
                                   </Dropdown.Item>
                                   <Dropdown.Item as='span' onClick={this.handleCreateNew}>
                                      <Icon color={this.props.vars.colors[0]} name='plus'/>
                                      <Link to={'/user/' + this.props.user.userName + '/editor'}
                                            color={this.props.vars.colors[0]}>New Article</Link>
                                   </Dropdown.Item>
                                   <Dropdown.Item as='span'>
                                      <Icon color={this.props.vars.colors[0]} name='setting'/>
                                      <Link to={'/user/' + this.props.user.userName + '/settings'}
                                            color={this.props.vars.colors[1]}>Settings</Link>
                                   </Dropdown.Item>
                                   <Dropdown.Item as='span' onClick={this.handleLogoutinButton}>
                                      <Icon color={this.props.vars.colors[0]} name='sign out'/>
                                      <span color={this.props.vars.colors[0]}>Sign Out</span>
                                   </Dropdown.Item>
                                </Dropdown.Menu>
                             </Dropdown>
                          </Menu.Item>
                   }
                </Menu.Menu>
             </Menu>
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
