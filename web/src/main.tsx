import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { ToastContainer } from "react-toastify"

import './index.css'

import { App } from './App.tsx'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <ToastContainer autoClose={3000} theme="light" position="bottom-right"/>
  </StrictMode>,
)
