import React, { Component } from 'react';
import {Loader, Input, Menu } from 'semantic-ui-react'
import Login from './login/loginForm'
import 'semantic-ui-css/semantic.min.css';

class App extends Component {
    state = {}

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const { activeItem } = this.state

        return (
            <Login />
        )
    }
}


export default App;
