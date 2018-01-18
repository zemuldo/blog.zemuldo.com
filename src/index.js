import React from 'react'
import ReactDOM from 'react-dom'
import thunk from 'redux-thunk'
import {createStore, applyMiddleware} from 'redux'
import {BrowserRouter} from 'react-router-dom'
import App from './App'
import './Main.css'
import {Provider} from 'react-redux'
import reducers from './store/reducers/index'
import 'semantic-ui-css/semantic.min.css'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const store = createStore(
    reducers,
    applyMiddleware(thunk)
)

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
        <MuiThemeProvider>
            <App />
        </MuiThemeProvider>
    </BrowserRouter>
  </Provider>,
    document.getElementById('main-app'))
