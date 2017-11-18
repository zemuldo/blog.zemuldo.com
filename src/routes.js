import React from 'react';
import Login from './profile/loginForm'
import Page from './pages/index'
import {  Switch, Route } from 'react-router-dom'

class Routes extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        };
    };
    render() {
        return (
            <main>
                <Switch>
                    <Route exact path='/' component={Page}/>
                    <Route path='/dev' component={Page}/>
                    <Route path='/tutorials' component={Page}/>
                    <Route path='/tech' component={Page}/>
                    <Route path='/business' component={Page}/>
                    <Route path='/reviews' component={Page}/>
                    <Route path='/tutorials' component={Page}/>
                    <Route path='/about' component={Page}/>
                    <Route path='/login' component={Page}/>
                </Switch>
            </main>
        )
    }
}
export default Routes;