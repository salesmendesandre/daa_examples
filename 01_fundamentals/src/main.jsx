import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'


import Dashboard from './components/Dashboard.jsx'
import DashboardWithCallback from './components/DashboardWithCallback.jsx'
import ClickCounter from './components/ClickCounter.jsx'
import ClickDashboard from './components/ClickDashboard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <h1>Fundamentos de React - Ejemplos</h1>
    <h2 class="title-component">Componente Dashboard</h2>
    <Dashboard />
    <h2 class="title-component">Componente Dashboard con callback</h2>
    <DashboardWithCallback />
    <h2 class="title-component">Componente ClickCounter</h2>
    <ClickCounter />
    <h2 class="title-component">Componente ClickCounter</h2>
    <ClickCounter />
    <h2 class="title-component">Componente ClickDashboard</h2>
    <ClickDashboard />
  </StrictMode>,
)
