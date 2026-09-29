import { Link, useLocation, useNavigate } from 'react-router-dom'
import { encerrarSessao } from '../api.js'

export default function MenuLateral() {
  const location = useLocation()
  const navegar = useNavigate()

  function sair() {
    encerrarSessao()
    navegar('/')
  }

  const itens = [
    { rota: '/dashboard', rotulo: 'Dashboard' },
    { rota: '/cadastro', rotulo: 'Cadastrar Produção' },
    { rota: '/historico', rotulo: 'Histórico' },
  ]

  return (
    <nav className="menu-lateral">
      <h2>☕ CICAL</h2>
      {itens.map((item) => (
        <Link key={item.rota} to={item.rota} className={location.pathname === item.rota ? 'ativo' : ''}>
          {item.rotulo}
        </Link>
      ))}
      <button className="link-sair sair" onClick={sair}>Sair</button>
    </nav>
  )
}
