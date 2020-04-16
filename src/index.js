import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ToastProvider } from 'react-toast-notifications'

import registerServiceWorker from './registerServiceWorker'
import { store } from './store/index'
import App from './App'

import 'semantic-ui-css/semantic.min.css'
import './index.css'

store.firebaseAuthIsReady.then(() => {
    ReactDOM.render(
        <Provider store={store}>
            <ToastProvider placement='top-center'>
                <App />
            </ToastProvider>
        </Provider>,
        document.getElementById('root'),
    )
    registerServiceWorker()
})
