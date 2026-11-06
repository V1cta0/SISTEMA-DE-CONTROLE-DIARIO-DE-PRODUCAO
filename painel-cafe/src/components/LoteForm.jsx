import { useState } from 'react'
import { hoje } from '../utils.js'

const vazio = {
  codigo: '', tipo: 'torrado', data: hoje(), origem: '', composicao: '',
  entrada: '', saida: '', resp: '', status: 'producao', obs: '',
}

export default function LoteForm({ inicial, onSalvar, onCancelar }) {
  const [f, setF] = useState(inicial || vazio)
  const set = (campo) => (e) => setF({ ...f, [campo]: e.target.value })
  const blend = f.tipo === 'blend'

  function enviar(e) {
    e.preventDefault()
    onSalvar({ ...f, entrada: Number(f.entrada), saida: Number(f.saida) })
  }

  return (
    <form onSubmit={enviar}>
      <h2>{inicial ? 'Editar lote' : 'Registrar lote'}</h2>
      <div className="f">
        <div className="w">
          <label>Código de barras</label>
          <input value={f.codigo} onChange={set('codigo')} required />
        </div>
        <div>
          <label>Tipo</label>
          <select value={f.tipo} onChange={set('tipo')}>
            <option value="torrado">Torrado em grão</option>
            <option value="moido">Moído</option>
            <option value="blend">Blend</option>
          </select>
        </div>
        <div>
          <label>Data</label>
          <input type="date" value={f.data} onChange={set('data')} required />
        </div>
        {blend ? (
          <div className="w">
            <label>Composição do blend</label>
            <input value={f.composicao} onChange={set('composicao')} placeholder="Ex.: Cerrado 60%, Mogiana 40%" />
          </div>
        ) : (
          <div className="w">
            <label>Origem ou variedade</label>
            <input value={f.origem} onChange={set('origem')} placeholder="Ex.: Sul de Minas, Catuaí" />
          </div>
        )}
        <div>
          <label>{blend ? 'Total de cafés usados (kg)' : 'Café verde usado (kg)'}</label>
          <input type="number" min="0.1" step="0.1" value={f.entrada} onChange={set('entrada')} required />
        </div>
        <div>
          <label>Café produzido (kg)</label>
          <input type="number" min="0.1" step="0.1" value={f.saida} onChange={set('saida')} required />
        </div>
        <div>
          <label>Responsável</label>
          <input value={f.resp} onChange={set('resp')} required />
        </div>
        <div>
          <label>Status</label>
          <select value={f.status} onChange={set('status')}>
            <option value="producao">Em produção</option>
            <option value="concluido">Concluído</option>
            <option value="embalado">Embalado</option>
          </select>
        </div>
        <div className="w">
          <label>Observações</label>
          <textarea rows="2" value={f.obs} onChange={set('obs')} />
        </div>
      </div>
      <div className="foot">
        <button type="button" className="btn" onClick={onCancelar}>Cancelar</button>
        <button className="btn pri">Salvar lote</button>
      </div>
    </form>
  )
}
