import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, salvarSessao } from '../api.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const navegar = useNavigate()

  async function aoEnviar(evento) {
    evento.preventDefault()
    setErro('')
    try {
      const dados = await login(email, senha)
      salvarSessao(dados.token, dados.usuario)
      navegar('/dashboard')
    } catch (e) {
      setErro(e.message)
    }
  }

  return (
    <div className="tela-login">
      <form className="card-login" onSubmit={aoEnviar}>
        <h1>☕ CICAL</h1>
        <p className="subtitulo">Controle Diário de Produção</p>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          placeholder="seu.email@cical.com.br"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          type="password"
          required
          placeholder="••••••••"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button type="submit" className="botao-primario">Entrar</button>
        <div className="mensagem-erro">{erro}</div>

        <p style={{ fontSize: '.75rem', color: '#999', marginTop: '1.5rem' }}>
          Acesso padrão inicial: admin@cical.com.br / admin123
        </p>
      </form>
    </div>
  )
}
