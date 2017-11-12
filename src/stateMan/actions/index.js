/*
 * action types
 */

export const UPDATE_BLOGS = 'UPDATE_BLOGS'
export const UPDATE_BLOG = 'UPDATE_BLOG'

/*
 * action creators
 */

export function updateBlogs(blogs) {
    console.log(blogs)
    return { type: UPDATE_BLOGS, blogs }
}
export function updateBlog(blogs) {
    return { type: UPDATE_BLOGS, blogs }
}
