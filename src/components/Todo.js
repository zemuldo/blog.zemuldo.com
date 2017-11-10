import React from 'react'
import PropTypes from 'prop-types'

class Todo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        };
    };
    render() {
        return (
            <li
                onClick={this.props.onClick}
                style={{
                    textDecoration: this.props.todo.completed ? 'line-through' : 'none'
                }}
            >
                {this.props.todo.name}
            </li>
        )
    }
}

export default Todo