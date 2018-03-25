import { UPDATE_BLOGS, ADD_BLOGS } from '../actions/blogs'

const initialState = []

const blogsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_BLOGS:
      return action.blogs
    case ADD_BLOGS:
      return [...state.concat(action.blogs)]
    default:
      return state
  }
}

export default blogsReducer
