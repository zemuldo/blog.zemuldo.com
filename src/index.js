import React from 'react'
import ReactDOM from 'react-dom'
import thunk from 'redux-thunk'
import {createStore, applyMiddleware} from 'redux'
import {BrowserRouter} from 'react-router-dom'
import './Main.css'
import {Provider} from 'react-redux'
import reducers from './store/reducers/index'
import App from './App'

const store = createStore(
    reducers,
    applyMiddleware(thunk)
);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('zRoot'));