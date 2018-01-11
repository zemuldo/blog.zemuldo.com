import {UPDATE_BLOGS} from '../actions/blogs'

const initialState = []

const blogsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_BLOGS:
      return action.blogs
    default:
      return state
  }
}

export default blogsReducer
