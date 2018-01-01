

export const UPDATE_BLOG = 'UPDATE_BLOG';

export const updateBlog = (blog) => {
  return {
    type: UPDATE_BLOG,
    blog
  }
}
