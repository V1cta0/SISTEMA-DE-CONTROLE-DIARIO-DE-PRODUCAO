import { useEffect, useState } from 'react'

const CAFES = [
  { nome: 'Café Torrado', torra: 'Torra média', cod: '7898100210014', cor: '#6b3a1e' },
  { nome: 'Café Moído', torra: 'Moagem fina', cod: '7898100210021', cor: '#a9744f' },
  { nome: 'Blend', torra: 'Torra escura', cod: '7898100210038', cor: '#d4a24c' }
]
const PACOTES = [0, 1, 2, 0, 2]
const PERIODO = 2.4

// Esteira decorativa: cada pacote cruza o leitor a cada 2,4 s e a leitura acompanha o feixe.
export default function Esteira() {
  const [n, setN] = useState(-1)

  useEffect(() => {
    let intervalo
    const inicio = setTimeout(() => {
      setN(0)
      intervalo = setInterval(() => setN((x) => x + 1), PERIODO * 1000)
    }, PERIODO * 500)
    return () => { clearTimeout(inicio); clearInterval(intervalo) }
  }, [])

  const cafe = n >= 0 ? CAFES[PACOTES[(((2 - n) % 5) + 5) % 5]] : null

  return (
    <div className="esteira" aria-hidden="true">
      <div className="esteira-pista">
        {PACOTES.map((tipo, i) => (
          <div key={i} className="pacote" style={{ '--cor': CAFES[tipo].cor, animationDelay: `${-i * PERIODO}s` }}>
            <span className="etiqueta" />
          </div>
        ))}
        <div className="leitor"><span className="feixe" /></div>
        <div className="correia" />
      </div>
      <div className="leitura">
        <span className="leitura-status">{cafe ? 'Lido' : 'Aguardando'}</span>
        <span className="leitura-nome">{cafe ? `${cafe.nome} · ${cafe.torra}` : 'Esteira em movimento'}</span>
        <span className="leitura-cod">{cafe ? cafe.cod : '—'}</span>
        <span className="leitura-total">{Math.max(n + 1, 0)} pacotes</span>
      </div>
    </div>
  )
}
