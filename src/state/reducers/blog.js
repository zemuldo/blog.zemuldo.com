import { UPDATE_BLOG,RESET_BLOG } from "../actions/blog";
const initialState = {
    id:null,
    gplsC:0,
    twtC:0,
    linkdCont:0,
    fbC:0
};

const blogReducer = (state = initialState, action ) => {
  switch (action.type) {
    case UPDATE_BLOG:
        return Object.assign({},state,action.blog);
    case RESET_BLOG:
        return Object.assign({},state,{id:null});
    default:
        return state;
  }
}

export default blogReducer;
