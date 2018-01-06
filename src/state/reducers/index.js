import {combineReducers} from "redux";

import blogs from './blogs';
import blog from './blog';
import user from './user';
import vars from './vars';
import topics from './topics'

const rootReducer = combineReducers({
    blogs, blog, user, vars, topics
})

export default rootReducer;