import React from 'react'
import Page from './pages/main'
import Login from './profile/login'
import About from './pages/about'
import {Switch, Route} from 'react-router-dom'

class Routes extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  };

  render () {
    return (
      <main>
        <Switch>
          <Route exact path='/' component={Page} />
          <Route path='/dev/:loadedDetails' component={Page} />
          <Route path='/home/:loadedDetails' component={Page} />
          <Route path='/tech/:loadedDetails' component={Page} />
          <Route path='/business/:loadedDetails' component={Page} />
          <Route path='/reviews/:loadedDetails' component={Page} />
          <Route path='/tutorials/:loadedDetails' component={Page} />
          <Route path='/topics/:topic' component={Page} />
          <Route path='/about' component={About} />
          <Route path='/:user/:details' component={Login} />
          <Route path='/login' component={Login} />
          <Route path='/signup' component={Login} />
          <Route exact path='/*' component={Page} />
        </Switch>
      </main>
    )
  }
}

export default Routes
