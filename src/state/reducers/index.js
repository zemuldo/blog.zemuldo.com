import { combineReducers } from "redux";

import blogs from "./blogs";
import user from './user'
import vars from './vars'
const rootReducer = combineReducers({
  blogs,user,vars
})

export default rootReducer;