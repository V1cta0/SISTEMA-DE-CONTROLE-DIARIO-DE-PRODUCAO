import { useState } from 'react'
import { login, salvarSessao } from '../api.js'
import Esteira from '../components/Esteira.jsx'
import { Grao, XicaraCafe, GraosFlutuantes } from '../components/Decoracao.jsx'
import { useTransicao } from '../components/Transicao.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const { ir } = useTransicao()

  async function aoEnviar(evento) {
    evento.preventDefault()
    setErro('')
    try {
      const dados = await login(email, senha)
      salvarSessao(dados.token, dados.usuario)
      ir('/dashboard', 'Dashboard')
    } catch (e) {
      setErro(e.message)
    }
  }

  return (
    <div className="tela-login">
      <GraosFlutuantes />
      <section className="login-hero">
        <div className="marca"><Grao tamanho={34} /><span>CICAL</span></div>
        <div className="login-destaque">
          <h1>Cada pacote que passa na esteira, lido e registrado.</h1>
          <XicaraCafe tamanho={190} className="xicara-login" />
        </div>
        <Esteira />
      </section>

      <form className="card-login" onSubmit={aoEnviar}>
        <h2>Entrar</h2>
        <p className="subtitulo">Controle diário de produção de café</p>

        <label htmlFor="email">Email</label>
        <input id="email" type="email" required placeholder="seu.email@cical.com.br" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="senha">Senha</label>
        <input id="senha" type="password" required placeholder="••••••••" value={senha} onChange={(e) => setSenha(e.target.value)} />

        <button type="submit" className="botao-primario">Entrar</button>
        <div className="mensagem-erro" role="alert">{erro}</div>

        <p className="dica">Acesso padrão inicial: admin@cical.com.br / admin123</p>
      </form>
    </div>
  )
}
