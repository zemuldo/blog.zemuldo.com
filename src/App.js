import React from 'react'
import Main from './routes'
import NavBar from './partials/navBar'

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        };
    };
    render() {
        return (
            <div>
                <NavBar/>
                <Main />
            </div>
        )
    }
}
export default App