import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Cabecalho from '../components/Cabecalho.jsx'
import { XicaraCafe } from '../components/Decoracao.jsx'
import { apiFetch } from '../api.js'

const formatarData = (iso) => (iso ? iso.split('-').reverse().join('/') : '')

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

  const totalKg = registros.reduce((s, r) => s + (r.quantidadeKg || 0), 0)
  const mediaKg = registros.length ? totalKg / registros.length : 0
  const porProduto = {}
  registros.forEach((r) => { porProduto[r.produto] = (porProduto[r.produto] || 0) + (r.quantidadeKg || 0) })
  const lider = Object.entries(porProduto).sort((a, b) => b[1] - a[1])[0]

  return (
    <>
      <Cabecalho titulo="Histórico de Produção" subtitulo="Filtre por período, produto ou turno" />

      <div className="filtros">
        <div>
          <label htmlFor="f-inicio">De</label>
          <input id="f-inicio" type="date" value={filtros.dataInicio} onChange={(e) => atualizarFiltro('dataInicio', e.target.value)} />
        </div>
        <div>
          <label htmlFor="f-fim">Até</label>
          <input id="f-fim" type="date" value={filtros.dataFim} onChange={(e) => atualizarFiltro('dataFim', e.target.value)} />
        </div>
        <div>
          <label htmlFor="f-produto">Produto</label>
          <select id="f-produto" value={filtros.produto} onChange={(e) => atualizarFiltro('produto', e.target.value)}>
            <option value="">Todos</option>
            <option>Café Torrado</option>
            <option>Café Moído</option>
            <option>Blend</option>
          </select>
        </div>
        <div>
          <label htmlFor="f-turno">Turno</label>
          <select id="f-turno" value={filtros.turno} onChange={(e) => atualizarFiltro('turno', e.target.value)}>
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

      {registros.length > 0 && (
        <div className="resumo-faixa">
          <div className="mini"><div className="mini-valor">{registros.length}</div><div className="rotulo">Registros encontrados</div></div>
          <div className="mini"><div className="mini-valor">{totalKg.toFixed(1)} kg</div><div className="rotulo">Total produzido</div></div>
          <div className="mini"><div className="mini-valor">{mediaKg.toFixed(1)} kg</div><div className="rotulo">Média por registro</div></div>
          <div className="mini"><div className="mini-valor">{lider ? lider[0] : '—'}</div><div className="rotulo">Produto com mais kg</div></div>
        </div>
      )}

      <div className="painel tabela-rolagem">
        <table>
          <thead>
            <tr>
              <th>Data</th><th>Turno</th><th>Produto</th><th>Torra</th>
              <th>Moagem</th><th>Cód. Barras</th><th>Qtd (kg)</th><th>Responsável</th><th>Observações</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((r) => (
              <tr key={r.id}>
                <td>{formatarData(r.data)}</td>
                <td>{r.turno}</td>
                <td><span className={'pilula ' + (r.produto === 'Blend' ? 'blend' : r.produto === 'Café Moído' ? 'moido' : 'torrado')}>{r.produto}</span></td>
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

        {registros.length === 0 && !erro && (
          <div className="estado-vazio">
            <XicaraCafe tamanho={110} titulo="Xícara vazia" />
            <p>Nenhum registro encontrado. Ajuste os filtros ou <Link to="/cadastro">cadastre uma produção</Link>.</p>
          </div>
        )}
      </div>
    </>
  )
}
