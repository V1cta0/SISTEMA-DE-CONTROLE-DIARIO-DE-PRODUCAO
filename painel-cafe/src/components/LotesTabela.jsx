import { TIPOS, STATUS, fmtData, fmtKg, rendimento, origemOuComposicao } from '../utils.js'

export default function LotesTabela({ lotes, filtros, setFiltros, onAbrir }) {
  const q = filtros.q.toLowerCase()
  const visiveis = lotes.filter(
    (l) =>
      (!filtros.tipo || l.tipo === filtros.tipo) &&
      (!filtros.status || l.status === filtros.status) &&
      (!q || [l.codigo, origemOuComposicao(l), l.resp].join(' ').toLowerCase().includes(q))
  )

  const set = (campo) => (e) => setFiltros({ ...filtros, [campo]: e.target.value })

  return (
    <section className="card">
      <h2>Lotes</h2>
      <div className="filters">
        <input type="search" placeholder="Buscar por código, origem ou responsável" value={filtros.q} onChange={set('q')} aria-label="Buscar" />
        <select value={filtros.tipo} onChange={set('tipo')} aria-label="Tipo">
          <option value="">Todos os tipos</option>
          {Object.entries(TIPOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={filtros.status} onChange={set('status')} aria-label="Status">
          <option value="">Todos os status</option>
          {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="tw">
        <table>
          <thead>
            <tr>
              <th>Código</th><th>Tipo</th><th>Origem ou composição</th><th>Data</th>
              <th className="r">Saída</th><th className="r">Rendimento</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {visiveis.map((l) => (
              <tr key={l.id} onClick={() => onAbrir(l)}>
                <td>{l.codigo}</td>
                <td>{TIPOS[l.tipo]}</td>
                <td>{origemOuComposicao(l)}</td>
                <td>{fmtData(l.data)}</td>
                <td className="r">{fmtKg(l.saida)} kg</td>
                <td className="r">{fmtKg(rendimento(l))}%</td>
                <td><span className={`tag ${l.status}`}>{STATUS[l.status]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visiveis.length === 0 && (
        <div className="empty">Nenhum lote encontrado. Ajuste os filtros ou registre um novo lote.</div>
      )}
    </section>
  )
}
