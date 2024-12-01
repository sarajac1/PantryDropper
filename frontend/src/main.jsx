import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.jsx';
import './styles/index.css';
import { InventoryProvider } from './contexts/InventoryContext.js';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
