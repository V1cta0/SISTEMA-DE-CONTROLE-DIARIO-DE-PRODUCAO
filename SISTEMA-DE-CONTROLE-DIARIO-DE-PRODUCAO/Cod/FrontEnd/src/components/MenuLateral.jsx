import { Link, useLocation } from 'react-router-dom'
import { encerrarSessao, obterUsuario } from '../api.js'
import { Grao, XicaraCafe } from './Decoracao.jsx'
import { useTransicao } from './Transicao.jsx'

export { Grao }

const ICONES = {
  dashboard: <path d="M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z" />,
  cadastro: <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />,
  historico: <path d="M12 4a8 8 0 1 0 8 8h-2a6 6 0 1 1-1.8-4.2L14 10h6V4l-2.4 2.4A8 8 0 0 0 12 4Zm-1 4v5l4 2 .8-1.6-3-1.4V8h-1.8Z" />
}

function Icone({ nome }) {
  return (
    <svg className="icone-menu" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      {ICONES[nome]}
    </svg>
  )
}

export default function MenuLateral() {
  const location = useLocation()
  const { ir } = useTransicao()
  const usuario = obterUsuario()
  const primeiroNome = usuario && usuario.nome ? usuario.nome.split(' ')[0] : ''

  function sair() {
    ir('/', 'Até logo!', encerrarSessao)
  }

  const itens = [
    { rota: '/dashboard', rotulo: 'Dashboard', icone: 'dashboard' },
    { rota: '/cadastro', rotulo: 'Cadastrar produção', icone: 'cadastro' },
    { rota: '/historico', rotulo: 'Histórico', icone: 'historico' }
  ]

  return (
    <nav className="menu-lateral">
      <div className="marca"><Grao tamanho={28} cor="#e0a458" sulco="#3a2316" /><span>CICAL</span></div>

      <div className="menu-links">
        {itens.map((item) => (
          <Link
            key={item.rota}
            to={item.rota}
            className={location.pathname === item.rota ? 'ativo' : ''}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
              e.preventDefault()
              ir(item.rota, item.rotulo)
            }}
          >
            <Icone nome={item.icone} />
            <span>{item.rotulo}</span>
          </Link>
        ))}
      </div>

      <div className="menu-rodape">
        <XicaraCafe tamanho={92} className="xicara-menu" />
        {primeiroNome && <p className="menu-ola">Olá, {primeiroNome}!</p>}
        <p className="menu-sub">Seu café está pronto.</p>
      </div>

      <button className="link-sair sair" onClick={sair}>Sair</button>
    </nav>
  )
}
