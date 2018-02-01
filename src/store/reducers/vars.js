import {UPDATE_VARS} from '../actions/vars'
import config from '../../env/conf'

const env = config[process.env.NODE_ENV] || 'development'

const vars = {
  user: null,
  iKnowYou: false,
  visitorInfo: null,
  geoAllowed: false,
  createNew: false,
  editingMode: false,
  colors: ['green', 'blue', 'orange', 'violet', 'blue', 'orange'],
  color: 'green',
  currentLocation: 'home',
  profilePic: null,
  blogsLoaded: false,
  blogsAreLoading: true,
  homePageIsLoading: true,
  blogDetails: null,
  richViewerState: null,
  blogLoaded: false,
  homePageLoaded: false,
  loadFooter: false,
  topic: 'all',
  time: new Date().toDateString(),
  signUp: false,
  ws: new WebSocket(env.wsURL),
  exploreBlogs: null,
  wsFetchBlogDeatils: false,
  env:env,
  offline:null
}

const varsReducer = (state = vars, action) => {
  switch (action.type) {
    case UPDATE_VARS:
      return Object.assign({}, state, action.vars)
    default:
      return state
  }
}

export default varsReducer
