import React from 'react'
import { connect } from 'react-redux'
import { addTodo,updateBlogs } from '../stateMan/actions/actions'

let AddTodo = ({ dispatch }) => {
    let input

    return (
        <div>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    if (!input.value.trim()) {
                        return
                    }
                    dispatch(addTodo({name:input.value,date:new Date()}))
                    input.value = ''

                }}
            >
                <input
                    ref={node => {
                        input = node
                    }}
                />
                <button type="submit">
                    Add Todo
                </button>
            </form>
        </div>
    )
}
AddTodo = connect()(AddTodo)

export default AddTodo