import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReactLayoutProvider } from './ReactLayoutProvider';
import App from './App.jsx';
import './index.css';

// Create the root outside of any component
const root = ReactDOM.createRoot(document.getElementById('root'));

// Wrap the entire app with the ReactLayoutProvider
root.render(
  <React.StrictMode>
    <ReactLayoutProvider>
      <App />
    </ReactLayoutProvider>
  </React.StrictMode>
);