import React from 'react'
import Main from './routes'

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {

        };
    };
    componentDidMount(){
        // Check for browser support of service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js')
                .then(function(registration) {
                    // Successful registration
                    console.log('Hooray. Registration successful, scope is:', registration.scope);
                }).catch(function(err) {
                // Failed registration, service worker won’t be installed
                console.log('Whoops. Service worker registration failed, error:', err);
            });
        }
    }
    render() {
        return (
            <div>
                <Main />
            </div>
        )
    }
}
export default App