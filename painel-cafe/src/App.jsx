import { useEffect, useState, useCallback } from 'react'
import { api } from './services/api.js'
import { useBarcodeScanner } from './hooks/useBarcodeScanner.js'
import Resumo from './components/Resumo.jsx'
import LeituraPanel from './components/LeituraPanel.jsx'
import LotesTabela from './components/LotesTabela.jsx'
import LoteForm from './components/LoteForm.jsx'
import LoteDetalhe from './components/LoteDetalhe.jsx'
import Modal from './components/Modal.jsx'

export default function App() {
  const [lotes, setLotes] = useState([])
  const [filtros, setFiltros] = useState({ q: '', tipo: '', status: '' })
  const [leitura, setLeitura] = useState(null) // { codigo, lote }
  const [modal, setModal] = useState(null) // { tela: 'form' | 'detalhe', lote? }
  const [erro, setErro] = useState('')

  const carregar = useCallback(async () => {
    try {
      setLotes(await api.list())
      setErro('')
    } catch (e) {
      setErro('Não foi possível carregar os lotes.')
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  // Chamado quando o leitor bipa (ou pelo botão de simulação).
  const aoLer = useCallback(async (codigo) => {
    try {
      setLeitura({ codigo, lote: await api.findByCode(codigo) })
    } catch (e) {
      setErro('Falha ao consultar o código lido.')
    }
  }, [])

  useBarcodeScanner(aoLer)

  async function salvar(dados) {
    try {
      if (modal.lote) await api.update(modal.lote.id, dados)
      else await api.create(dados)
      setModal(null)
      carregar()
    } catch (e) {
      setErro('Não foi possível salvar o lote.')
    }
  }

  async function excluir(lote) {
    if (!window.confirm(`Excluir o lote ${lote.codigo}?`)) return
    try {
      await api.remove(lote.id)
      setModal(null)
      carregar()
    } catch (e) {
      setErro('Não foi possível excluir o lote.')
    }
  }

  return (
    <main>
      <header>
        <div>
          <h1>Produção de café</h1>
          <p>Leitura por código de barras</p>
        </div>
        <button className="btn pri" onClick={() => setModal({ tela: 'form' })}>Registrar lote</button>
      </header>

      {erro && <div className="alerta">{erro}</div>}

      <LeituraPanel leitura={leitura} onManual={aoLer} />
      <Resumo lotes={lotes} />
      <LotesTabela
        lotes={lotes}
        filtros={filtros}
        setFiltros={setFiltros}
        onAbrir={(lote) => setModal({ tela: 'detalhe', lote })}
      />

      <Modal aberto={!!modal} onClose={() => setModal(null)}>
        {modal?.tela === 'form' && (
          <LoteForm inicial={modal.lote} onSalvar={salvar} onCancelar={() => setModal(null)} />
        )}
        {modal?.tela === 'detalhe' && (
          <LoteDetalhe
            lote={modal.lote}
            onEditar={(lote) => setModal({ tela: 'form', lote })}
            onExcluir={excluir}
            onFechar={() => setModal(null)}
          />
        )}
      </Modal>
    </main>
  )
}
