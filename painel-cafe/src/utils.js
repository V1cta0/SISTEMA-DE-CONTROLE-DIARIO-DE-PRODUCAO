export const TIPOS = { torrado: 'Torrado', moido: 'Moído', blend: 'Blend' }
export const STATUS = { producao: 'Em produção', concluido: 'Concluído', embalado: 'Embalado' }

export const rendimento = (l) => (l.entrada > 0 ? (l.saida / l.entrada) * 100 : 0)
export const fmtData = (iso) => iso.split('-').reverse().join('/')
export const fmtKg = (n) => Number(n).toLocaleString('pt-BR', { maximumFractionDigits: 1 })
export const hoje = () => new Date().toISOString().slice(0, 10)
export const origemOuComposicao = (l) => (l.tipo === 'blend' ? l.composicao : l.origem) || '—'
