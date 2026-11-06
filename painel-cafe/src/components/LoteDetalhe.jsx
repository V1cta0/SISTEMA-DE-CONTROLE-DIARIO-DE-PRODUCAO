import { TIPOS, STATUS, fmtData, fmtKg, rendimento, origemOuComposicao } from '../utils.js'

export default function LoteDetalhe({ lote, onEditar, onExcluir, onFechar }) {
  return (
    <div>
      <h2>Lote {lote.codigo}</h2>
      <div className="grid">
        <div><span>Tipo</span><b>{TIPOS[lote.tipo]}</b></div>
        <div><span>Origem ou composição</span><b>{origemOuComposicao(lote)}</b></div>
        <div><span>Data</span><b>{fmtData(lote.data)}</b></div>
        <div><span>Entrada</span><b>{fmtKg(lote.entrada)} kg</b></div>
        <div><span>Saída</span><b>{fmtKg(lote.saida)} kg</b></div>
        <div><span>Rendimento</span><b>{fmtKg(rendimento(lote))}%</b></div>
        <div><span>Responsável</span><b>{lote.resp}</b></div>
        <div><span>Status</span><b>{STATUS[lote.status]}</b></div>
        <div className="w"><span>Observações</span><b>{lote.obs || '—'}</b></div>
      </div>
      <div className="foot">
        <button className="btn danger" onClick={() => onExcluir(lote)}>Excluir</button>
        <button className="btn" onClick={() => onEditar(lote)}>Editar</button>
        <button className="btn pri" onClick={onFechar}>Fechar</button>
      </div>
    </div>
  )
}
