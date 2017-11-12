import { combineReducers } from 'redux'
import {
    UPDATE_BLOGS,
    UPDATE_BLOG
} from '../actions'

function blogs(state = [], action) {
    switch (action.type) {
        case UPDATE_BLOGS:
            return action.blogs
        default:
            return state
    }
}

function blog(state = null, action) {
    switch (action.type) {
        case UPDATE_BLOG:
            return [
                ...state,
                action.blogs
                ]
        default:
            return state
    }
}

const BlogsReducer = combineReducers({
    blogs,
    blog
})

export default BlogsReducer