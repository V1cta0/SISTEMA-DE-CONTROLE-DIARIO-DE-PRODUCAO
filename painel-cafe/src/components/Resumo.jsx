import { TIPOS, fmtKg } from '../utils.js'

export default function Resumo({ lotes }) {
  const limite = new Date()
  limite.setDate(limite.getDate() - 30)
  const recentes = lotes.filter((l) => new Date(l.data) >= limite)
  const total = recentes.reduce((s, l) => s + Number(l.saida), 0)

  const porTipo = Object.keys(TIPOS).map((t) => ({
    tipo: t,
    kg: recentes.filter((l) => l.tipo === t).reduce((s, l) => s + Number(l.saida), 0),
  }))

  return (
    <section className="card" aria-label="Resumo dos últimos 30 dias">
      <div className="big">
        {fmtKg(total)} <small>kg em 30 dias</small>
      </div>
      <div className="strip">
        {porTipo.map((p) => (
          <span key={p.tipo} className={`seg ${p.tipo}`} style={{ flex: p.kg || 0 }} />
        ))}
      </div>
      <div className="legend">
        {porTipo.map((p) => (
          <span key={p.tipo}>
            <i className={`dot ${p.tipo}`} /> {TIPOS[p.tipo]}: {fmtKg(p.kg)} kg
          </span>
        ))}
      </div>
    </section>
  )
}
