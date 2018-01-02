import { UPDATE_BLOG } from "../actions/blog";
const initialState = {
    gplsC:0,
    twtC:0,
    linkdCont:0,
    fbC:0
};

const blogReducer = (state = initialState, action ) => {
  switch (action.type) {
    case UPDATE_BLOG:
      return Object.assign({},state,action.blog);
    default:
    return state;
  }
}

export default blogReducer;
