import { UPDATE_BLOGS, ADD_BLOGS, SORT_TYPE } from '../actions/blogs'

const initialState = []

const blogsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_BLOGS:
      return action.blogs
    case ADD_BLOGS:
      return [...state.concat(action.blogs)]
    case ADD_BLOGS:
      return state.map((b) => {
        if (b.type === action.type) {
          return b;
        }
      })
    default:
      return state
  }
}

export default blogsReducer
