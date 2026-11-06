// ÚNICO ponto de contato com os dados. Os componentes só importam `api` daqui.
// Para ligar o backend: coloque VITE_USE_MOCK=false no .env e ajuste os endpoints abaixo.
import { mockApi } from './mock.js'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const BASE = import.meta.env.VITE_API_URL || '/api'

async function http(caminho, opcoes = {}) {
  const resp = await fetch(BASE + caminho, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes,
  })
  if (resp.status === 404) return null
  if (!resp.ok) throw new Error(`Erro ${resp.status} em ${caminho}`)
  return resp.status === 204 ? null : resp.json()
}

const httpApi = {
  list: () => http('/lotes'),
  create: (dados) => http('/lotes', { method: 'POST', body: JSON.stringify(dados) }),
  update: (id, dados) => http(`/lotes/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
  remove: (id) => http(`/lotes/${id}`, { method: 'DELETE' }),
  // Busca o lote pelo código de barras lido (retorna null se não existir).
  findByCode: (codigo) => http(`/lotes/codigo/${encodeURIComponent(codigo)}`),
}

export const api = USE_MOCK ? mockApi : httpApi
