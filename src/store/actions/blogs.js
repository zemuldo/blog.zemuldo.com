export const UPDATE_BLOGS = 'UPDATE_BLOGS'
export const ADD_BLOGS = 'ADD_BLOGS'

export const updateBlogs = (blogs) => {
  return {
    type: UPDATE_BLOGS,
    blogs
  }
}

export const addBlogs = (blogs) => {
  return {
    type: ADD_BLOGS,
    blogs
  }
}

