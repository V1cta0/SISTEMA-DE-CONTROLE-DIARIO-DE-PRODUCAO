// Dados de demonstração salvos no navegador (localStorage).
// Serve só enquanto não há backend. Ative/desative em .env (VITE_USE_MOCK).
const KEY = 'torraviva:lotes'

const diasAtras = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

const demo = () => [
  { id: 1, codigo: '7891000100011', tipo: 'torrado', data: diasAtras(1), origem: 'Sul de Minas, Catuaí', composicao: '', entrada: 120, saida: 101, resp: 'Carlos', status: 'producao', obs: '' },
  { id: 2, codigo: '7891000100028', tipo: 'moido', data: diasAtras(3), origem: 'Cerrado Mineiro, Mundo Novo', composicao: '', entrada: 80, saida: 66, resp: 'Ana', status: 'concluido', obs: 'Moagem média' },
  { id: 3, codigo: '7891000100035', tipo: 'blend', data: diasAtras(6), origem: '', composicao: 'Cerrado 60%, Mogiana 40%', entrada: 150, saida: 126, resp: 'Carlos', status: 'embalado', obs: '' },
  { id: 4, codigo: '7891000100042', tipo: 'torrado', data: diasAtras(10), origem: 'Mogiana, Bourbon Amarelo', composicao: '', entrada: 100, saida: 84, resp: 'Marcos', status: 'embalado', obs: '' },
  { id: 5, codigo: '7891000100059', tipo: 'moido', data: diasAtras(18), origem: 'Sul de Minas, Catuaí', composicao: '', entrada: 60, saida: 50, resp: 'Ana', status: 'embalado', obs: '' },
  { id: 6, codigo: '7891000100066', tipo: 'blend', data: diasAtras(40), origem: '', composicao: 'Sul de Minas 50%, Cerrado 50%', entrada: 200, saida: 168, resp: 'Marcos', status: 'embalado', obs: '' },
]

const ler = () => {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignora e recria */
  }
  const inicial = demo()
  localStorage.setItem(KEY, JSON.stringify(inicial))
  return inicial
}

const gravar = (lista) => localStorage.setItem(KEY, JSON.stringify(lista))

export const mockApi = {
  async list() {
    return ler()
  },
  async create(dados) {
    const lista = ler()
    const novo = { ...dados, id: Date.now() }
    gravar([novo, ...lista])
    return novo
  },
  async update(id, dados) {
    const lista = ler().map((l) => (l.id === id ? { ...l, ...dados } : l))
    gravar(lista)
    return lista.find((l) => l.id === id)
  },
  async remove(id) {
    gravar(ler().filter((l) => l.id !== id))
  },
  async findByCode(codigo) {
    return ler().find((l) => l.codigo === codigo) || null
  },
}
