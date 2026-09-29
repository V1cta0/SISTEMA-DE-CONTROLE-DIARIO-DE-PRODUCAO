import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import MenuLateral from '../components/MenuLateral.jsx'
import { apiFetch } from '../api.js'

const CORES = ['#5b3a29', '#a9744f', '#d9b48f']

export default function Dashboard() {
  const [resumo, setResumo] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    apiFetch('/dashboard/resumo')
      .then(setResumo)
      .catch((e) => setErro(e.message))
  }, [])

  if (erro) return <Layout><p className="mensagem-erro">{erro}</p></Layout>
  if (!resumo) return <Layout><p>Carregando...</p></Layout>

  const dadosDias = resumo.ultimosDias.map((d) => ({ dia: d.chave.slice(5), total: d.total }))

  return (
    <Layout>
      <div className="cartoes">
        <div className="cartao">
          <div className="valor">{resumo.producaoHoje.toFixed(1)}</div>
          <div className="rotulo">Produção de hoje (kg)</div>
        </div>
        <div className="cartao">
          <div className="valor">{resumo.producaoMes.toFixed(1)}</div>
          <div className="rotulo">Produção do mês (kg)</div>
        </div>
      </div>

      <div className="grade-graficos">
        <div className="painel">
          <h3>Produção por produto (mês atual)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={resumo.porProduto} dataKey="total" nameKey="chave" outerRadius={90} label>
                {resumo.porProduto.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="painel">
          <h3>Produção por turno (mês atual)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={resumo.porTurno} dataKey="total" nameKey="chave" outerRadius={90} label>
                {resumo.porTurno.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="painel">
        <h3>Últimos 14 dias</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={dadosDias}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" name="Produção (kg)" stroke="#5b3a29" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Layout>
  )
}

function Layout({ children }) {
  return (
    <div className="app-layout">
      <MenuLateral />
      <main className="conteudo">
        <h1>Dashboard</h1>
        {children}
      </main>
    </div>
  )
}
