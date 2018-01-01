import { UPDATE_BLOG } from "../actions/blog";
const initialState = {};

const blogReducer = (state = initialState, action ) => {
  switch (action.type) {
    case UPDATE_BLOG:
      return Object.assign({},state,action.blog);
    default:
    return state;
  }
}

export default blogReducer;
