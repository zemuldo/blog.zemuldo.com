import { combineReducers } from "redux";

import blogs from './blogs';
import blog from './blog';
import user from './user';
import vars from './vars';
const rootReducer = combineReducers({
  blogs,blog,user,vars
})

export default rootReducer;