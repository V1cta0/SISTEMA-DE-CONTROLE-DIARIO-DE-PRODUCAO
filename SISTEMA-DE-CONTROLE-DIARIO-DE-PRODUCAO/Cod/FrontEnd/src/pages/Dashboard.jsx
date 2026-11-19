import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Cabecalho from '../components/Cabecalho.jsx'
import FraseCafe from '../components/FraseCafe.jsx'
import { apiFetch, obterUsuario } from '../api.js'

const CORES = ['#b8671f', '#7a4a2b', '#dcaa64']
const DICA = { background: '#fffaf1', border: '1px solid #e2cfae', borderRadius: 8, color: '#3a2316' }

function Numero({ valor, casas = 1 }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(valor); return }
    const ini = performance.now()
    let raf
    const passo = (t) => {
      const p = Math.min((t - ini) / 1000, 1)
      setV(valor * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(passo)
    }
    raf = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(raf)
  }, [valor])
  return v.toFixed(casas)
}

const formatarDia = (chave) => chave.slice(8, 10) + '/' + chave.slice(5, 7)
const maior = (lista) => lista.reduce((m, x) => (m === null || x.total > m.total ? x : m), null)

function saudacao() {
  const h = new Date().getHours()
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'
}

function dataPorExtenso() {
  const texto = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export default function Dashboard() {
  const [resumo, setResumo] = useState(null)
  const [erro, setErro] = useState('')
  const usuario = obterUsuario()
  const primeiroNome = usuario && usuario.nome ? usuario.nome.split(' ')[0] : ''
  const titulo = primeiroNome ? `${saudacao()}, ${primeiroNome}` : saudacao()
  const cabecalho = <Cabecalho titulo={titulo} subtitulo={`${dataPorExtenso()} · veja como está a produção`} />

  useEffect(() => {
    apiFetch('/dashboard/resumo')
      .then(setResumo)
      .catch((e) => setErro(e.message))
  }, [])

  if (erro) return <>{cabecalho}<p className="mensagem-erro">{erro}</p></>
  if (!resumo) return <>{cabecalho}<p className="vazio">Passando o café... carregando a produção.</p></>

  const dadosDias = resumo.ultimosDias.map((d) => ({ dia: formatarDia(d.chave), total: d.total }))

  const mediaDia = resumo.ultimosDias.length
    ? resumo.ultimosDias.reduce((s, d) => s + d.total, 0) / resumo.ultimosDias.length
    : 0
  const melhorDia = maior(resumo.ultimosDias)
  const totalProdutos = resumo.porProduto.reduce((s, p) => s + p.total, 0)
  const liderProduto = maior(resumo.porProduto)
  const liderTurno = maior(resumo.porTurno)
  const variacao = mediaDia > 0 ? ((resumo.producaoHoje - mediaDia) / mediaDia) * 100 : null

  return (
    <>
      {cabecalho}

      <div className="cartoes">
        <div className="cartao destaque">
          <div className="valor"><Numero valor={resumo.producaoHoje} /></div>
          <div className="rotulo">Produção de hoje (kg)</div>
          {variacao !== null && (
            <span className={'variacao ' + (variacao >= 0 ? 'sobe' : 'desce')}>
              {variacao >= 0 ? '▲' : '▼'} {Math.abs(variacao).toFixed(0)}% {variacao >= 0 ? 'acima' : 'abaixo'} da média diária
            </span>
          )}
        </div>
        <div className="cartao">
          <div className="valor"><Numero valor={resumo.producaoMes} /></div>
          <div className="rotulo">Produção do mês (kg)</div>
        </div>
      </div>

      <div className="cartoes-mini">
        <div className="mini">
          <div className="mini-valor"><Numero valor={mediaDia} /> kg</div>
          <div className="rotulo">Média por dia (14 dias)</div>
        </div>
        <div className="mini">
          <div className="mini-valor">{melhorDia && melhorDia.total > 0 ? formatarDia(melhorDia.chave) : '—'}</div>
          <div className="rotulo">
            Melhor dia{melhorDia && melhorDia.total > 0 ? ` · ${melhorDia.total.toFixed(1)} kg` : ''}
          </div>
        </div>
        <div className="mini">
          <div className="mini-valor">{liderProduto ? liderProduto.chave : '—'}</div>
          <div className="rotulo">
            Produto líder{liderProduto && totalProdutos > 0 ? ` · ${((liderProduto.total / totalProdutos) * 100).toFixed(0)}% do mês` : ''}
          </div>
        </div>
        <div className="mini">
          <div className="mini-valor">{liderTurno ? liderTurno.chave : '—'}</div>
          <div className="rotulo">Turno que mais produz</div>
        </div>
      </div>

      <div className="grade-graficos">
        <div className="painel">
          <h3>Produção por produto (mês atual)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart margin={{ top: 18, right: 10, bottom: 0, left: 10 }}>
              <Pie data={resumo.porProduto} dataKey="total" nameKey="chave" innerRadius={55} outerRadius={90} stroke="#fffaf1" strokeWidth={3} label>
                {resumo.porProduto.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
              </Pie>
              <Tooltip contentStyle={DICA} itemStyle={{ color: '#3a2316' }} />
              <Legend formatter={(v) => <span style={{ color: '#3a2316' }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="painel">
          <h3>Produção por turno (mês atual)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart margin={{ top: 18, right: 10, bottom: 0, left: 10 }}>
              <Pie data={resumo.porTurno} dataKey="total" nameKey="chave" innerRadius={55} outerRadius={90} stroke="#fffaf1" strokeWidth={3} label>
                {resumo.porTurno.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
              </Pie>
              <Tooltip contentStyle={DICA} itemStyle={{ color: '#3a2316' }} />
              <Legend formatter={(v) => <span style={{ color: '#3a2316' }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="painel">
        <h3>Últimos 14 dias</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={dadosDias}>
            <defs>
              <linearGradient id="gradProducao" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c27a2c" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#c27a2c" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2cfae" />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip contentStyle={DICA} itemStyle={{ color: '#3a2316' }} />
            <Area type="monotone" dataKey="total" name="Produção (kg)" stroke="#6b3a1e" strokeWidth={3} fill="url(#gradProducao)" dot={{ r: 3, fill: '#6b3a1e' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <FraseCafe />
    </>
  )
}
