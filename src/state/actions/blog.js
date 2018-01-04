export const UPDATE_BLOG = 'UPDATE_BLOG';

export const RESET_BLOG = 'RESET_BLOG';

export const updateBlog = (blog) => {
    return {
        type: UPDATE_BLOG,
        blog
    }
}
export const resetBlog = (blog) => {
    return {
        type: RESET_BLOG,
        blog
    }
}
