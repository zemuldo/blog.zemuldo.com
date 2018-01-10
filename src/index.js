import React from 'react'
import ReactDOM from 'react-dom'
import thunk from 'redux-thunk'
import {createStore, applyMiddleware} from 'redux'
import {BrowserRouter} from 'react-router-dom'
import App from './App'
import './Main.css'
import {Provider} from 'react-redux'
import reducers from './state/reducers/index'
import 'semantic-ui-css/semantic.min.css'

const store = createStore(
    reducers,
    applyMiddleware(thunk)
)

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
    document.getElementById('main-app'))
