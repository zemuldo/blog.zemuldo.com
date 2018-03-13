import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import {Menu, Icon, Dropdown, Image, Container} from 'semantic-ui-react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import * as VarsActions from '../store/actions/vars'
import * as UserActions from '../store/actions/user'
import * as BlogsActions from '../store/actions/blogs'
import {bindActionCreators} from 'redux'
import axios from 'axios'
import config from '../env'
import * as BlogActions from '../store/actions/blog'
import PropTypes from 'prop-types'

const env = config[process.env.NODE_ENV] || 'development'

class MobileMenu extends React.Component {
   constructor(props) {
      super(props)
      this.state = {}
      this.handleFilterChange = this.handleFilterChange.bind(this)
   };

   componentDidMount() {
      window.addEventListener('resize', this.resize)
   }

   componentWillUnmount() {
      window.removeEventListener('resize', this.resize)
   }

   resize = () => this.forceUpdate();

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
       this.props.userActions.updateUser({id: null,_id:null})
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

   render() {
      let urlDetails = 'all'
      return (
          <div>
             <Container>
                 <Menu
                     text
                     fixed='top'
                     size='tiny'
                     secondary
                     color={this.props.vars.colors[0]}
                     borderless
                 >
                     <Dropdown
                         className='dropDown'
                         trigger={<Icon name='bars'/>}
                         style={{color: this.props.vars.colors[0]}}
                         pointing='top left'
                         item
                     >
                         <Dropdown.Menu>
                             <Dropdown.Item
                                 as='span'
                                 className=''
                                 name='home'
                                 active={this.props.vars.currentLocation === 'home'}
                                 onClick={this.handleHomeClick}>
                                 <Icon color={this.props.vars.colors[0]} name='home'/>
                                 <span color={this.props.vars.colors[0]}><Link to='/'>Home</Link></span>
                             </Dropdown.Item>
                             <Dropdown.Item
                                 as='span'
                                 name='dev'
                                 active={this.props.vars.currentLocation === 'dev'}
                                 onClick={this.handleMenuItemClick}>
                                 <Icon color={this.props.vars.colors[0]} name='code'/>
                                 <span color={this.props.vars.colors[0]}><Link
                                     to={'/dev/' + urlDetails}>Dev</Link></span>
                             </Dropdown.Item>
                             <Dropdown.Item
                                 as='span'
                                 name='business'
                                 active={this.props.vars.currentLocation === 'business'}
                                 onClick={this.handleMenuItemClick}>
                                 <Icon color={this.props.vars.colors[0]} name='creative commons'/>
                                 <span color={this.props.vars.colors[0]}><Link
                                     to={'/business/' + urlDetails}>Business</Link></span>
                             </Dropdown.Item>
                             <Dropdown.Item
                                 as='span'
                                 name='tech'
                                 active={this.props.vars.currentLocation === 'tech'}
                                 onClick={this.handleMenuItemClick}>
                                 <Icon color={this.props.vars.colors[0]} name='server'/>
                                 <span color={this.props.vars.colors[0]}><Link
                                     to={'/tech/' + urlDetails}>Tech</Link></span>
                             </Dropdown.Item>
                             <Dropdown.Item
                                 as='span'
                                 name='reviews'
                                 active={this.props.vars.currentLocation === 'reviews'}
                                 onClick={this.handleMenuItemClick}>
                                 <Icon color={this.props.vars.colors[0]} name='circle notched'/>
                                 <span color={this.props.vars.colors[0]}><Link
                                     to={'/reviews/' + urlDetails}>Reviews</Link></span>
                             </Dropdown.Item>
                         </Dropdown.Menu>
                     </Dropdown>
                     <Menu.Menu position='right'>
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

                                             id='photo'
                                             size='mini'
                                             src={env.httpURL+this.props.user.avatarURL}
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
                                                 <span className='colorRed'>Sign Out</span>
                                             </Dropdown.Item>
                                         </Dropdown.Menu>
                                     </Dropdown>
                                 </Menu.Item>
                         }
                     </Menu.Menu>
                 </Menu>
             </Container>
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
const mapDispatchToProps = (dispatch) => {
   return {
      blogActions: bindActionCreators(BlogActions, dispatch),
      userActions: bindActionCreators(UserActions, dispatch),
      varsActions: bindActionCreators(VarsActions, dispatch),
      blogsActions: bindActionCreators(BlogsActions, dispatch)
   }
}

MobileMenu.propTypes = {
   user: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.oneOf([null])
   ]),
   vars: PropTypes.object.isRequired,
   blogActions: PropTypes.object.isRequired,
   varsActions: PropTypes.object.isRequired,
   blogsActions: PropTypes.object.isRequired,
   userActions: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileMenu)
