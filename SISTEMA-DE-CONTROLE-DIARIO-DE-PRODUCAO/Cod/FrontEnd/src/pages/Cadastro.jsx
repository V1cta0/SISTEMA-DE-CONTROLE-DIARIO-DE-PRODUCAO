import { useEffect, useRef, useState } from 'react'
import Cabecalho from '../components/Cabecalho.jsx'
import FraseCafe from '../components/FraseCafe.jsx'
import { XicaraCafe } from '../components/Decoracao.jsx'
import LeitorAoVivo, { cameraAoVivoDisponivel } from '../components/LeitorAoVivo.jsx'
import { apiFetch, apiFetchArquivo } from '../api.js'

// Data de HOJE no fuso do computador. (toISOString() usa UTC e, depois das 21h no Brasil,
// devolvia o dia seguinte, o que gravava produção do turno da noite com a data errada.)
function hojeLocal() {
  const d = new Date()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}

function valoresIniciais(manter = {}) {
  return {
    data: hojeLocal(),
    turno: '',
    produto: '',
    tipoTorra: '',
    tipoMoagem: '',
    quantidadeKg: '',
    codigoBarras: '',
    observacoes: '',
    ...manter
  }
}

// Remove espaços e caracteres de controle que alguns leitores enviam junto com o código.
const limparCodigo = (valor) => valor.replace(/[\u0000-\u001f\u007f\s]/g, '').slice(0, 50)

// Foto de celular chega com 5 a 10 MB; reduzir deixa o envio e a leitura muito mais rápidos.
async function reduzirImagem(arquivo, ladoMaximo = 1600) {
  try {
    const bitmap = await createImageBitmap(arquivo)
    const escala = Math.min(1, ladoMaximo / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * escala)
    canvas.height = Math.round(bitmap.height * escala)
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85))
    return blob || arquivo
  } catch {
    return arquivo // formato que o navegador não abre: manda o original
  }
}

export default function Cadastro() {
  const [form, setForm] = useState(() => valoresIniciais())
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [lendoCodigo, setLendoCodigo] = useState(false)
  const [statusCodigo, setStatusCodigo] = useState('')
  const [leitorAberto, setLeitorAberto] = useState(false)
  const refCodigo = useRef(null)

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  // Modo leitor: a página já abre com o cursor no código de barras e, se o cursor estiver fora de
  // um campo de texto, qualquer tecla (o leitor USB "digita" o código) volta para esse campo.
  useEffect(() => {
    if (refCodigo.current) refCodigo.current.focus()

    function capturar(evento) {
      if (evento.ctrlKey || evento.metaKey || evento.altKey || evento.key.length !== 1) return
      const ativo = document.activeElement
      const emCampoDeTexto = ativo && (ativo.tagName === 'INPUT' || ativo.tagName === 'TEXTAREA')
      if (!emCampoDeTexto && refCodigo.current) refCodigo.current.focus()
    }
    document.addEventListener('keydown', capturar)
    return () => document.removeEventListener('keydown', capturar)
  }, [])

  // Se o código já foi registrado antes, preenche produto, torra e moagem.
  async function consultarCodigo(codigo) {
    if (!codigo) return
    try {
      const dados = await apiFetch('/codigo-barras/' + encodeURIComponent(codigo))
      if (dados) {
        setForm((atual) => ({
          ...atual,
          produto: dados.produto || atual.produto,
          tipoTorra: dados.tipoTorra || '',
          tipoMoagem: dados.tipoMoagem || ''
        }))
        setStatusCodigo(`Código ${codigo} reconhecido: ${dados.produto}.`)
      } else {
        setStatusCodigo(`Código ${codigo} lido. É novo: escolha o produto.`)
      }
    } catch {
      setStatusCodigo(`Código ${codigo} lido.`)
    }
  }

  // Leitores USB terminam o código com Enter. Sem isso, o Enter enviava o formulário na hora.
  async function aoTeclarCodigo(evento) {
    if (evento.key !== 'Enter') return
    evento.preventDefault()
    const codigo = limparCodigo(evento.currentTarget.value)
    atualizarCampo('codigoBarras', codigo)
    await consultarCodigo(codigo)
    irParaProximoCampo()
  }

  function irParaProximoCampo() {
    setTimeout(() => {
      const proximo = ['turno', 'produto', 'quantidade'].find((id) => {
        const campo = document.getElementById(id)
        return campo && !campo.value
      })
      const alvo = document.getElementById(proximo || 'quantidade')
      if (alvo) alvo.focus()
    }, 50)
  }

  // Código lido pela câmera ao vivo
  async function aoLerAoVivo(codigoLido) {
    const codigo = limparCodigo(codigoLido)
    setLeitorAberto(false)
    atualizarCampo('codigoBarras', codigo)
    await consultarCodigo(codigo)
    irParaProximoCampo()
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
      formData.append('imagem', await reduzirImagem(arquivo), 'foto.jpg')
      const resultado = await apiFetchArquivo('/codigo-barras/ler', formData)
      const codigo = limparCodigo(resultado.codigo)
      atualizarCampo('codigoBarras', codigo)
      await consultarCodigo(codigo)
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
      // mantém data e turno para o próximo pacote e devolve o cursor ao código de barras
      setForm(valoresIniciais({ data: form.data, turno: form.turno }))
      setStatusCodigo('')
      setTimeout(() => { if (refCodigo.current) refCodigo.current.focus() }, 0)
    } catch (e) {
      setErro(e.message)
    }
  }

  return (
    <>
      <Cabecalho titulo="Cadastrar Produção" subtitulo="Registre o que saiu da linha neste turno" />

      <div className="cadastro-grade">
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
                <input id="quantidade" type="number" min="0.1" max="100000" step="0.1" required value={form.quantidadeKg} onChange={(e) => atualizarCampo('quantidadeKg', e.target.value)} />
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
                <div className={'campo-leitura' + (lendoCodigo ? ' lendo' : '')}>
                  <input
                    id="codigoBarras"
                    ref={refCodigo}
                    type="text"
                    autoComplete="off"
                    maxLength={50}
                    placeholder="Escaneie ou digite"
                    value={form.codigoBarras}
                    onChange={(e) => atualizarCampo('codigoBarras', limparCodigo(e.target.value))}
                    onKeyDown={aoTeclarCodigo}
                  />
                  <label
                    htmlFor="foto-codigo-barras"
                    className="botao-ler"
                  >
                    {lendoCodigo ? 'Lendo código...' : 'Tirar foto'}
                  </label>
                  {cameraAoVivoDisponivel() && (
                    <button type="button" className="botao-ler" onClick={() => setLeitorAberto(true)}>
                      Câmera ao vivo
                    </button>
                  )}
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
                <p className={'dica-leitor' + (statusCodigo ? ' ok' : '')} role="status">
                  {statusCodigo || 'Leitor pronto: com o cursor aqui, é só escanear.'}
                </p>
              </div>
            </div>

            <label htmlFor="observacoes">Observações</label>
            <textarea id="observacoes" rows={3} placeholder="Opcional" value={form.observacoes} onChange={(e) => atualizarCampo('observacoes', e.target.value)} />

            <button type="submit" className="botao-primario botao-salvar">Salvar registro</button>
            <div className="mensagem-erro" role="alert">{erro}</div>
            {sucesso && (
              <div className="mensagem-sucesso" role="status">
                <XicaraCafe tamanho={34} titulo="Café servido" /> {sucesso}
              </div>
            )}
          </form>
        </div>

        <aside className="lateral-cadastro">
          <div className="painel resumo-vivo">
            <h3>Você está registrando</h3>
            <p className="resumo-linha">
              <strong>{form.quantidadeKg ? form.quantidadeKg + ' kg' : '— kg'}</strong> de{' '}
              <strong>{form.produto || 'produto a escolher'}</strong>
            </p>
            <p className="resumo-detalhe">
              Turno: {form.turno || '—'}
              {form.tipoTorra ? ` · Torra ${form.tipoTorra.toLowerCase()}` : ''}
              {form.tipoMoagem ? ` · Moagem ${form.tipoMoagem.toLowerCase()}` : ''}
            </p>
            <p className="resumo-detalhe">Código de barras: {form.codigoBarras || 'não informado'}</p>
          </div>

          <div className="painel dicas">
            <h3>Usando o leitor</h3>
            <ul>
              <li>Escaneie com o cursor no campo do código. O Enter do leitor não salva o registro.</li>
              <li>Se o código já foi registrado antes, produto, torra e moagem vêm preenchidos.</li>
              <li>Depois de salvar, data e turno ficam, e o cursor volta para o código.</li>
              <li>Sem leitor USB: "Câmera ao vivo" lê o código em tempo real (precisa de HTTPS ou localhost) e "Tirar foto" funciona em qualquer endereço.</li>
            </ul>
          </div>

          <FraseCafe />
        </aside>
      </div>

      {leitorAberto && <LeitorAoVivo aoLer={aoLerAoVivo} aoFechar={() => setLeitorAberto(false)} />}
    </>
  )
}
