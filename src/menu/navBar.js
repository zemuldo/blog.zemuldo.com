import React from 'react'
import CompMenu from './compMenu';
import MobileMenu from './mobileMenu'

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    componentDidMount() {
    }

    render() {
        return (
          <div>
            {
                    window.innerWidth > 800 ?
                      <CompMenu /> :
                      <MobileMenu />
                }
            <br />

          </div>
        )
    }
}

export default NavBar