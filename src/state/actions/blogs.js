export const UPDATE_BLOGS = 'UPDATE_BLOGS';

export const updateBlogs = (blogs) => {
    return {
        type: UPDATE_BLOGS,
        blogs
    }
}
