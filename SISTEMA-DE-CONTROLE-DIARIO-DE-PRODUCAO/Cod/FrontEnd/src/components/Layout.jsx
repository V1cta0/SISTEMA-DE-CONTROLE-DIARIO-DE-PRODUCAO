import { Outlet, useLocation } from 'react-router-dom'
import MenuLateral from './MenuLateral.jsx'
import { GraosFlutuantes } from './Decoracao.jsx'

// Moldura das páginas internas. O menu fica parado e só o conteúdo (main) é remontado
// a cada troca de rota, o que dispara a animação de entrada da página.
export default function Layout() {
  const { pathname } = useLocation()
  return (
    <div className="app-layout">
      <GraosFlutuantes />
      <MenuLateral />
      <main key={pathname} className="conteudo">
        <Outlet />
      </main>
    </div>
  )
}
