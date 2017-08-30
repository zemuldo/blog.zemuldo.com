import React, { Component } from 'react';
import {Loader, Input, Menu } from 'semantic-ui-react'

class App extends Component {
    state = {}

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const { activeItem } = this.state

        return (
            <Menu>
              <Loader active inline='centered' />
              <Menu.Item header>Home</Menu.Item>
              <Menu.Item name='About' active={activeItem === 'about'} onClick={this.handleItemClick} />
              <Menu.Item name='Contacts' active={activeItem === 'jobs'} onClick={this.handleItemClick} />
              <Menu.Item name='Location' active={activeItem === 'locations'} onClick={this.handleItemClick} />
              <Menu.Item position='right'>
                <Input className='icon' icon='search' placeholder='Search...' />
              </Menu.Item>
            </Menu>
        )
    }
}


export default App;
