const API_BASE = 'http://localhost:8080/api'

export function obterToken() {
  return localStorage.getItem('cical_token')
}

export function obterUsuario() {
  const dados = localStorage.getItem('cical_usuario')
  return dados ? JSON.parse(dados) : null
}

export function salvarSessao(token, usuario) {
  localStorage.setItem('cical_token', token)
  localStorage.setItem('cical_usuario', JSON.stringify(usuario))
}

export function encerrarSessao() {
  localStorage.removeItem('cical_token')
  localStorage.removeItem('cical_usuario')
}

export async function apiFetch(caminho, opcoes = {}) {
  const token = obterToken()
  const headers = { 'Content-Type': 'application/json', ...(opcoes.headers || {}) }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const resposta = await fetch(API_BASE + caminho, { ...opcoes, headers })

  if (resposta.status === 401) {
    encerrarSessao()
    window.location.href = '/'
    throw new Error('Sessão expirada. Faça login novamente.')
  }

  const dados = resposta.status !== 204 ? await resposta.json().catch(() => ({})) : null

  if (!resposta.ok) {
    throw new Error((dados && dados.erro) || 'Erro ao comunicar com o servidor.')
  }

  return dados
}

// Login não usa apiFetch porque ainda não existe token
export async function login(email, senha) {
  const resposta = await fetch(API_BASE + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  })
  const dados = await resposta.json()
  if (!resposta.ok) {
    throw new Error(dados.erro || 'Não foi possível entrar.')
  }
  return dados
}

// Upload de arquivo (multipart/form-data) - não define Content-Type manualmente,
// o navegador define sozinho com o "boundary" correto.
export async function apiFetchArquivo(caminho, formData) {
  const token = obterToken()
  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`

  const resposta = await fetch(API_BASE + caminho, { method: 'POST', headers, body: formData })

  if (resposta.status === 401) {
    encerrarSessao()
    window.location.href = '/'
    throw new Error('Sessão expirada. Faça login novamente.')
  }

  const dados = await resposta.json().catch(() => ({}))

  if (!resposta.ok) {
    throw new Error(dados.erro || 'Erro ao comunicar com o servidor.')
  }

  return dados
}
