import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { XicaraCafe } from './Decoracao.jsx'

const TransicaoContexto = createContext({ ir: () => {} })
export const useTransicao = () => useContext(TransicaoContexto)

const COBRINDO_MS = 600   // cortina de café sobe e cobre a tela
const REVELANDO_MS = 820  // a página nova já está embaixo; a cortina sai

// Troca de tela animada: ondas de café sobem, uma xícara é servida e solta vapor,
// e então a cortina sobe revelando a nova página.
// Uso: const { ir } = useTransicao();  ir('/cadastro', 'Cadastrar produção')
export default function ProvedorTransicao({ children }) {
  const navegar = useNavigate()
  const { pathname } = useLocation()
  const [fase, setFase] = useState('parado')
  const [rotulo, setRotulo] = useState('')
  const timers = useRef([])
  const ocupado = useRef(false)

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const ir = useCallback((rota, nome = '', aoCobrir) => {
    if (ocupado.current || rota === pathname) return
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduzir) {
      if (aoCobrir) aoCobrir()
      navegar(rota)
      return
    }
    ocupado.current = true
    setRotulo(nome)
    setFase('cobrindo')
    timers.current.push(setTimeout(() => {
      if (aoCobrir) aoCobrir()
      navegar(rota)
      document.documentElement.style.setProperty('--atraso-pagina', '.4s')
      setFase('revelando')
    }, COBRINDO_MS))
    timers.current.push(setTimeout(() => {
      setFase('parado')
      document.documentElement.style.setProperty('--atraso-pagina', '0s')
      ocupado.current = false
    }, COBRINDO_MS + REVELANDO_MS))
  }, [navegar, pathname])

  const valor = useMemo(() => ({ ir }), [ir])

  return (
    <TransicaoContexto.Provider value={valor}>
      {children}
      {fase !== 'parado' && (
        <div className="transicao" data-fase={fase} aria-hidden="true">
          <div className="painel-t painel-t-1" />
          <div className="painel-t painel-t-2">
            <div className="t-centro">
              <XicaraCafe tamanho={230} servindo titulo="" />
              {rotulo && <p className="t-rotulo">{rotulo}</p>}
            </div>
          </div>
        </div>
      )}
    </TransicaoContexto.Provider>
  )
}
