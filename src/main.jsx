import React from 'react'; // Explicit React import
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Create the root outside of any component to ensure React context is properly established
const root = ReactDOM.createRoot(document.getElementById('root'));

// Consider wrapping your app with StrictMode for development
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);