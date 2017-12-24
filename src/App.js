import React from 'react'
import Main from './routes'
import NavBar from './menu/navBar'
import Footer from './partials/footer'
import ReviewPortal from "./partials/portal";

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
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
                <Footer/>
                <ReviewPortal/>
            </div>
        )
    }
}
export default App