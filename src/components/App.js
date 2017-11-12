import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'
import {updateBlogs,addTodo} from "../stateMan/actions/actions";
import {connect} from 'react-redux'

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        };
    };
    componentDidMount(){
        let todos = [
            {
            id:1,
            name: 'test1',
            date:234762384623,
            completed: false
        },
            {
                id:1,
                name: 'test1',
                date:234762384623,
                completed: false
            },
            {
                id:1,
                name: 'test1',
                date:234762384623,
                completed: false
            }
        ]
        for (let i = 0;i<todos.length;i++){
            this.props.dispatch(addTodo(todos[i]))
        }
    }
    render() {
        return (
            <div>
                <AddTodo />
                <VisibleTodoList />
                <Footer />
            </div>
        )
    }
}

App = connect()(App)

export default App