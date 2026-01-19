/**
 * Application Entry Point
 * 
 * Mounts the React application to the DOM.
 * This is the first file executed by Vite when the app loads.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Mount the app to the root element
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
