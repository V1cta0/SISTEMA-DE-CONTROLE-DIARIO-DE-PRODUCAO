import { useState } from 'react'
import { TIPOS, STATUS, fmtData, fmtKg, rendimento, origemOuComposicao } from '../utils.js'

// Mostra o resultado da última leitura do código de barras.
// `leitura` = { codigo, lote } (lote = null quando o código não existe).
export default function LeituraPanel({ leitura, onManual }) {
  const [manual, setManual] = useState('')

  function enviar(e) {
    e.preventDefault()
    if (manual.trim()) onManual(manual.trim())
    setManual('')
  }

  const lote = leitura?.lote

  return (
    <section className="card" aria-label="Leitura de código de barras">
      <h2>Leitura de código de barras</h2>

      {!leitura && <p className="muted">Aguardando leitura… passe o código no leitor.</p>}

      {leitura && !lote && (
        <p className="erro">
          Código <b>{leitura.codigo}</b> não encontrado.
        </p>
      )}

      {lote && (
        <div className="leitura">
          <div className="cod">{lote.codigo}</div>
          <div className="grid">
            <div><span>Tipo</span><b>{TIPOS[lote.tipo]}</b></div>
            <div><span>Origem ou composição</span><b>{origemOuComposicao(lote)}</b></div>
            <div><span>Data</span><b>{fmtData(lote.data)}</b></div>
            <div><span>Saída</span><b>{fmtKg(lote.saida)} kg</b></div>
            <div><span>Rendimento</span><b>{fmtKg(rendimento(lote))}%</b></div>
            <div><span>Status</span><b>{STATUS[lote.status]}</b></div>
            <div><span>Responsável</span><b>{lote.resp}</b></div>
          </div>
        </div>
      )}

      {/* Só para testar sem o leitor físico. Pode ser removido depois. */}
      <form className="manual" onSubmit={enviar}>
        <input
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          placeholder="Testar sem leitor: digite um código"
          aria-label="Código manual"
        />
        <button className="btn">Simular leitura</button>
      </form>
    </section>
  )
}
