import React, { Component } from 'react';
import {Input, Menu } from 'semantic-ui-react'

const items = [
    { key: 'Home', active: true, name: 'Home' },
    { key: 'About', name: 'About' },
    { key: 'Contact', name: 'Contact' },
]

class App extends Component {
    state = {}

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const { activeItem } = this.state

        return (
            <Menu>
              <Menu.Item header>Our Company</Menu.Item>
              <Menu.Item name='aboutUs' active={activeItem === 'aboutUs'} onClick={this.handleItemClick} />
              <Menu.Item name='jobs' active={activeItem === 'jobs'} onClick={this.handleItemClick} />
              <Menu.Item name='locations' active={activeItem === 'locations'} onClick={this.handleItemClick} />
              <Menu.Item position='right'>
                <Input className='icon' icon='search' placeholder='Search...' />
              </Menu.Item>
            </Menu>
        )
    }
}


export default App;
