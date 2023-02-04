import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './app/store';
import './index.css';

const helmetContext = {};
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* <HelmetProvider context={helmetContext}> */}
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
        {/* </HelmetProvider> */}
    </React.StrictMode>
);
