import { useEffect, useState } from 'react'
import MenuLateral from '../components/MenuLateral.jsx'
import { apiFetch } from '../api.js'

export default function Historico() {
  const [filtros, setFiltros] = useState({ dataInicio: '', dataFim: '', produto: '', turno: '' })
  const [registros, setRegistros] = useState([])
  const [erro, setErro] = useState('')

  async function buscar() {
    setErro('')
    const parametros = new URLSearchParams()
    if (filtros.dataInicio) parametros.set('dataInicio', filtros.dataInicio)
    if (filtros.dataFim) parametros.set('dataFim', filtros.dataFim)
    if (filtros.produto) parametros.set('produto', filtros.produto)
    if (filtros.turno) parametros.set('turno', filtros.turno)

    try {
      const dados = await apiFetch('/producoes?' + parametros.toString())
      setRegistros(dados)
    } catch (e) {
      setErro(e.message)
    }
  }

  useEffect(() => { buscar() }, [])

  function atualizarFiltro(campo, valor) {
    setFiltros((atual) => ({ ...atual, [campo]: valor }))
  }

  return (
    <div className="app-layout">
      <MenuLateral />
      <main className="conteudo">
        <h1>Histórico de Produção</h1>

        <div className="filtros">
          <div>
            <label>De</label>
            <input type="date" value={filtros.dataInicio} onChange={(e) => atualizarFiltro('dataInicio', e.target.value)} />
          </div>
          <div>
            <label>Até</label>
            <input type="date" value={filtros.dataFim} onChange={(e) => atualizarFiltro('dataFim', e.target.value)} />
          </div>
          <div>
            <label>Produto</label>
            <select value={filtros.produto} onChange={(e) => atualizarFiltro('produto', e.target.value)}>
              <option value="">Todos</option>
              <option>Café Torrado</option>
              <option>Café Moído</option>
              <option>Blend</option>
            </select>
          </div>
          <div>
            <label>Turno</label>
            <select value={filtros.turno} onChange={(e) => atualizarFiltro('turno', e.target.value)}>
              <option value="">Todos</option>
              <option>Manhã</option>
              <option>Tarde</option>
              <option>Noite</option>
            </select>
          </div>
          <div>
            <button className="botao-primario" onClick={buscar}>Filtrar</button>
          </div>
        </div>

        {erro && <p className="mensagem-erro">{erro}</p>}

        <div className="painel">
          <table>
            <thead>
              <tr>
                <th>Data</th><th>Turno</th><th>Produto</th><th>Torra</th>
                <th>Moagem</th><th>Cód. Barras</th><th>Qtd (kg)</th><th>Responsável</th><th>Observações</th>
              </tr>
            </thead>
            <tbody>
              {registros.length === 0 && (
                <tr><td colSpan={9}>Nenhum registro encontrado.</td></tr>
              )}
              {registros.map((r) => (
                <tr key={r.id}>
                  <td>{r.data}</td>
                  <td>{r.turno}</td>
                  <td>{r.produto}</td>
                  <td>{r.tipoTorra || '-'}</td>
                  <td>{r.tipoMoagem || '-'}</td>
                  <td>{r.codigoBarras || '-'}</td>
                  <td>{r.quantidadeKg}</td>
                  <td>{r.usuarioNome}</td>
                  <td>{r.observacoes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
