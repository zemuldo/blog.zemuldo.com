import React from 'react'
import Main from './routes'
import NavBar from './menu/navBar'
import 'semantic-ui-css/semantic.min.css';

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        };
    };
    resize = () => this.forceUpdate();
    componentDidMount(){
        window.addEventListener('resize', this.resize);
    };
    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
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