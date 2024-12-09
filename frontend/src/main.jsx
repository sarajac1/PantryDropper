import React from 'react'
import ReactDOM from 'react-dom/client'
import { InventoryProvider } from './contexts/InventoryContext'
import App from './components/App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <InventoryProvider>
      <App />
    </InventoryProvider>
  </React.StrictMode>,
)