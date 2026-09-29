import { useState } from 'react'
import MenuLateral from '../components/MenuLateral.jsx'
import { apiFetch, apiFetchArquivo } from '../api.js'

const HOJE = new Date().toISOString().slice(0, 10)

const VALORES_INICIAIS = {
  data: HOJE,
  turno: '',
  produto: '',
  tipoTorra: '',
  tipoMoagem: '',
  quantidadeKg: '',
  codigoBarras: '',
  observacoes: ''
}

export default function Cadastro() {
  const [form, setForm] = useState(VALORES_INICIAIS)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [lendoCodigo, setLendoCodigo] = useState(false)

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  // Recebe a foto tirada pela câmera do celular (input capture="environment"),
  // envia pro backend e o Java (ZXing) decodifica o código de barras.
  async function aoTirarFoto(evento) {
    const arquivo = evento.target.files[0]
    if (!arquivo) return

    setErro('')
    setLendoCodigo(true)
    try {
      const formData = new FormData()
      formData.append('imagem', arquivo)
      const resultado = await apiFetchArquivo('/codigo-barras/ler', formData)
      atualizarCampo('codigoBarras', resultado.codigo)
    } catch (e) {
      setErro(e.message)
    } finally {
      setLendoCodigo(false)
      evento.target.value = '' // permite tirar outra foto em seguida, se precisar
    }
  }

  async function aoEnviar(evento) {
    evento.preventDefault()
    setErro('')
    setSucesso('')

    try {
      await apiFetch('/producoes', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          quantidadeKg: parseFloat(form.quantidadeKg),
          tipoTorra: form.tipoTorra || null,
          tipoMoagem: form.tipoMoagem || null,
          codigoBarras: form.codigoBarras || null,
          observacoes: form.observacoes || null
        })
      })
      setSucesso('Registro salvo com sucesso!')
      setForm(VALORES_INICIAIS)
    } catch (e) {
      setErro(e.message)
    }
  }

  return (
    <div className="app-layout">
      <MenuLateral />
      <main className="conteudo">
        <h1>Cadastrar Produção</h1>

        <div className="painel">
          <form onSubmit={aoEnviar}>
            <div className="formulario-grade">
              <div>
                <label htmlFor="data">Data</label>
                <input id="data" type="date" required value={form.data} onChange={(e) => atualizarCampo('data', e.target.value)} />
              </div>
              <div>
                <label htmlFor="turno">Turno</label>
                <select id="turno" required value={form.turno} onChange={(e) => atualizarCampo('turno', e.target.value)}>
                  <option value="">Selecione</option>
                  <option>Manhã</option>
                  <option>Tarde</option>
                  <option>Noite</option>
                </select>
              </div>
              <div>
                <label htmlFor="produto">Produto</label>
                <select id="produto" required value={form.produto} onChange={(e) => atualizarCampo('produto', e.target.value)}>
                  <option value="">Selecione</option>
                  <option>Café Torrado</option>
                  <option>Café Moído</option>
                  <option>Blend</option>
                </select>
              </div>
              <div>
                <label htmlFor="quantidade">Quantidade produzida (kg)</label>
                <input id="quantidade" type="number" min="0.1" step="0.1" required value={form.quantidadeKg} onChange={(e) => atualizarCampo('quantidadeKg', e.target.value)} />
              </div>
              <div>
                <label htmlFor="tipoTorra">Tipo de torra</label>
                <select id="tipoTorra" value={form.tipoTorra} onChange={(e) => atualizarCampo('tipoTorra', e.target.value)}>
                  <option value="">Não se aplica</option>
                  <option>Claro</option>
                  <option>Médio</option>
                  <option>Escuro</option>
                </select>
              </div>
              <div>
                <label htmlFor="tipoMoagem">Tipo de moagem</label>
                <select id="tipoMoagem" value={form.tipoMoagem} onChange={(e) => atualizarCampo('tipoMoagem', e.target.value)}>
                  <option value="">Não se aplica</option>
                  <option>Grossa</option>
                  <option>Média</option>
                  <option>Fina</option>
                </select>
              </div>
              <div>
                <label htmlFor="codigoBarras">Código de barras</label>
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <input
                    id="codigoBarras"
                    type="text"
                    placeholder="Opcional"
                    value={form.codigoBarras}
                    onChange={(e) => atualizarCampo('codigoBarras', e.target.value)}
                  />
                  <label
                    htmlFor="foto-codigo-barras"
                    className="botao-primario"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0, whiteSpace: 'nowrap', cursor: 'pointer' }}
                  >
                    {lendoCodigo ? 'Lendo...' : '📷 Ler'}
                  </label>
                  {/* capture="environment" abre direto a câmera traseira do celular, sem precisar instalar app */}
                  <input
                    id="foto-codigo-barras"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: 'none' }}
                    onChange={aoTirarFoto}
                    disabled={lendoCodigo}
                  />
                </div>
              </div>
            </div>

            <label htmlFor="observacoes">Observações</label>
            <textarea id="observacoes" rows={3} placeholder="Opcional" value={form.observacoes} onChange={(e) => atualizarCampo('observacoes', e.target.value)} />

            <button type="submit" className="botao-primario" style={{ maxWidth: 220 }}>Salvar registro</button>
            <div className="mensagem-erro">{erro}</div>
            <div className="mensagem-sucesso">{sucesso}</div>
          </form>
        </div>
      </main>
    </div>
  )
}
