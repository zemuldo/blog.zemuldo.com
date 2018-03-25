export const UPDATE_BLOGS = 'UPDATE_BLOGS'
export const ADD_BLOGS = 'ADD_BLOGS'
export const SORT_TYPE = 'SORT_TYPE'

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

export const sortType = (type) => {
  return {
    type: SORT_TYPE,
    type
  }
}
