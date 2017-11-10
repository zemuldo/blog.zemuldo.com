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
        this.props.dispatch(addTodo({
            id:1,
            name: 'test1',
            date:234762384623,
            completed: false
        }))
        this.props.dispatch(addTodo({
            id:2,
            name: 'test2',
            date:76876878768,
            completed: false
        }))
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