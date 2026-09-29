import { Routes, Route, Navigate } from 'react-router-dom'
import { obterToken } from './api.js'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Historico from './pages/Historico.jsx'

function RotaProtegida({ children }) {
  return obterToken() ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
      <Route path="/cadastro" element={<RotaProtegida><Cadastro /></RotaProtegida>} />
      <Route path="/historico" element={<RotaProtegida><Historico /></RotaProtegida>} />
    </Routes>
  )
}
