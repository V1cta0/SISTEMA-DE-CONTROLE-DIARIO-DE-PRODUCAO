import { Routes, Route, Navigate } from 'react-router-dom'
import { obterToken } from './api.js'
import ProvedorTransicao from './components/Transicao.jsx'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Historico from './pages/Historico.jsx'

function RotaProtegida({ children }) {
  return obterToken() ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <ProvedorTransicao>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<RotaProtegida><Layout /></RotaProtegida>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/historico" element={<Historico />} />
        </Route>
      </Routes>
    </ProvedorTransicao>
  )
}
