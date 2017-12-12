import React from 'react'
import Main from './routes'
import 'semantic-ui-css/semantic.min.css';

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        };
    };
    componentDidMount(){}
    render() {
        return (
            <div>
                <Main />
            </div>
        )
    }
}
export default App