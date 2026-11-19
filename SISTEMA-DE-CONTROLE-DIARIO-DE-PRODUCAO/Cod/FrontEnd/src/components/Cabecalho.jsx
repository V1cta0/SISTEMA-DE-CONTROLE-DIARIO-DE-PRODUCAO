import { DivisorGraos, XicaraCafe } from './Decoracao.jsx'

export default function Cabecalho({ titulo, subtitulo }) {
  return (
    <header className="cabecalho">
      <div className="cabecalho-topo">
        <div>
          <h1>{titulo}</h1>
          {subtitulo && <p className="subtitulo-pagina">{subtitulo}</p>}
        </div>
        <XicaraCafe tamanho={76} className="xicara-cabecalho" />
      </div>
      <DivisorGraos />
    </header>
  )
}
