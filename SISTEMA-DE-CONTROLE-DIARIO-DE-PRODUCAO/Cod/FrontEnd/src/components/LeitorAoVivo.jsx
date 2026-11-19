import { useCallback, useEffect, useRef, useState } from 'react'
import { apiFetchArquivo } from '../api.js'

// Leitor de código de barras com a câmera ao vivo.
//
// A tela preta de câmera acontece quando a "stream" fica presa: o Chrome tira a câmera da página
// (aba em segundo plano, tela bloqueada, outro app usando a câmera, StrictMode abrindo duas vezes)
// e o <video> continua mostrando um quadro parado/preto, sem dar erro. Por isso este componente:
//   1. é o único dono da stream e SEMPRE para todas as faixas (tracks) ao fechar, ao esconder a aba e ao reiniciar;
//   2. descarta uma stream que chegou atrasada (o getUserMedia resolveu depois do componente fechar);
//   3. reabre a câmera sozinho ao voltar para a aba/app e quando a faixa termina (onended) ou fica muda (onmute);
//   4. tem um "vigia" que reinicia a câmera se o vídeo parar de andar.

const INTERVALO_LEITURA_MS = 700
const LARGURA_MAXIMA = 960
const VIGIA_MS = 1500

export function cameraAoVivoDisponivel() {
  return typeof navigator !== 'undefined' && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

function mensagemDeErro(e) {
  switch (e && e.name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return 'A permissão da câmera foi negada. Clique no cadeado ao lado do endereço, libere a câmera e toque em "Reiniciar câmera".'
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return 'Nenhuma câmera foi encontrada neste aparelho.'
    case 'NotReadableError':
    case 'TrackStartError':
      return 'A câmera está sendo usada por outro app ou aba. Feche-o e toque em "Reiniciar câmera".'
    default:
      return 'Não foi possível abrir a câmera. Toque em "Reiniciar câmera".'
  }
}

export default function LeitorAoVivo({ aoLer, aoFechar }) {
  const refVideo = useRef(null)
  const refCanvas = useRef(null)
  const refStream = useRef(null)
  const refGeracao = useRef(0)      // cada (re)início ganha um número; respostas de tentativas antigas são ignoradas
  const refAberto = useRef(false)
  const refEnviando = useRef(false) // há um quadro sendo lido agora
  const refEncontrou = useRef(false)
  const refVigia = useRef({ tempo: -1, paradoVezes: 0 })
  const refMudo = useRef(null)
  const refReiniciar = useRef(() => {})
  const refDetector = useRef(undefined)
  const [estado, setEstado] = useState('iniciando') // iniciando | ativa | pausada | erro
  const [mensagem, setMensagem] = useState('')

  const pararCamera = useCallback(() => {
    refGeracao.current += 1
    clearTimeout(refMudo.current)
    const stream = refStream.current
    refStream.current = null
    if (stream) {
      stream.getTracks().forEach((faixa) => {
        faixa.onended = null
        faixa.onmute = null
        faixa.onunmute = null
        faixa.stop()
      })
    }
    const video = refVideo.current
    if (video) {
      video.pause()
      video.srcObject = null
    }
    refVigia.current = { tempo: -1, paradoVezes: 0 }
  }, [])

  const iniciarCamera = useCallback(async () => {
    pararCamera()
    const minhaGeracao = refGeracao.current
    setEstado('iniciando')
    setMensagem('')

    if (!window.isSecureContext || !cameraAoVivoDisponivel()) {
      setEstado('erro')
      setMensagem('O Chrome só libera a câmera ao vivo em HTTPS ou em localhost. Pelo IP da rede (http://192.168...) use o botão "Tirar foto".')
      return
    }

    try {
      let stream
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        })
      } catch (e) {
        if (e && e.name === 'OverconstrainedError') {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        } else {
          throw e
        }
      }

      // Fechou (ou reiniciou) enquanto o navegador pedia a câmera: solta na hora, senão ela fica presa.
      if (!refAberto.current || minhaGeracao !== refGeracao.current) {
        stream.getTracks().forEach((faixa) => faixa.stop())
        return
      }

      refStream.current = stream
      const faixa = stream.getVideoTracks()[0]
      faixa.onended = () => {
        if (refStream.current === stream) refReiniciar.current()
      }
      faixa.onmute = () => {
        // faixa "muda" = o navegador parou de entregar imagem; se não voltar logo, reinicia
        clearTimeout(refMudo.current)
        refMudo.current = setTimeout(() => {
          if (refStream.current === stream && faixa.muted) refReiniciar.current()
        }, 1500)
      }
      faixa.onunmute = () => clearTimeout(refMudo.current)

      const video = refVideo.current
      video.srcObject = stream
      try {
        await video.play()
      } catch (e) {
        if (e && e.name !== 'AbortError') throw e
      }
      if (minhaGeracao !== refGeracao.current) return
      setEstado('ativa')
    } catch (e) {
      if (minhaGeracao !== refGeracao.current) return
      setEstado('erro')
      setMensagem(mensagemDeErro(e))
    }
  }, [pararCamera])

  // guarda a versão mais nova de "reiniciar" para os eventos da faixa usarem
  useEffect(() => {
    refReiniciar.current = () => {
      if (refAberto.current && document.visibilityState !== 'hidden') iniciarCamera()
    }
  }, [iniciarCamera])

  // abre a câmera ao montar e solta ao desmontar
  useEffect(() => {
    refAberto.current = true
    refEncontrou.current = false
    iniciarCamera()
    return () => {
      refAberto.current = false
      pararCamera()
    }
  }, [iniciarCamera, pararCamera])

  // segundo plano: solta a câmera; ao voltar, abre de novo
  useEffect(() => {
    function aoMudarVisibilidade() {
      if (document.visibilityState === 'hidden') {
        pararCamera()
        setEstado('pausada')
      } else if (refAberto.current) {
        iniciarCamera()
      }
    }
    function aoEsconderPagina() {
      pararCamera()
      setEstado('pausada')
    }
    function aoMostrarPagina(e) {
      if (e.persisted && refAberto.current) iniciarCamera()
    }
    function aoTrocarDispositivo() {
      // câmera conectada/desconectada: se a atual sumiu, a faixa termina e o onended reinicia
      if (refAberto.current && !refStream.current && document.visibilityState !== 'hidden') iniciarCamera()
    }
    function aoTeclar(e) {
      if (e.key === 'Escape') aoFechar()
    }
    document.addEventListener('visibilitychange', aoMudarVisibilidade)
    window.addEventListener('pagehide', aoEsconderPagina)
    window.addEventListener('pageshow', aoMostrarPagina)
    document.addEventListener('keydown', aoTeclar)
    if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
      navigator.mediaDevices.addEventListener('devicechange', aoTrocarDispositivo)
    }
    return () => {
      document.removeEventListener('visibilitychange', aoMudarVisibilidade)
      window.removeEventListener('pagehide', aoEsconderPagina)
      window.removeEventListener('pageshow', aoMostrarPagina)
      document.removeEventListener('keydown', aoTeclar)
      if (navigator.mediaDevices && navigator.mediaDevices.removeEventListener) {
        navigator.mediaDevices.removeEventListener('devicechange', aoTrocarDispositivo)
      }
    }
  }, [iniciarCamera, pararCamera, aoFechar])

  // vigia: se o vídeo parar de andar com a aba visível, reinicia a câmera
  useEffect(() => {
    const id = setInterval(() => {
      const video = refVideo.current
      const stream = refStream.current
      if (!video || !stream || document.visibilityState === 'hidden') return

      const faixa = stream.getVideoTracks()[0]
      if (!faixa || faixa.readyState === 'ended') {
        refReiniciar.current()
        return
      }
      if (video.paused && !video.ended) video.play().catch(() => {})

      const vigia = refVigia.current
      if (video.currentTime === vigia.tempo) {
        vigia.paradoVezes += 1
        if (vigia.paradoVezes >= 2) {
          vigia.paradoVezes = 0
          refReiniciar.current()
        }
      } else {
        vigia.tempo = video.currentTime
        vigia.paradoVezes = 0
      }
    }, VIGIA_MS)
    return () => clearInterval(id)
  }, [])

  // leitura: a cada ~0,7 s pega um quadro reduzido e procura o código
  useEffect(() => {
    async function lerQuadro() {
      const video = refVideo.current
      if (estado !== 'ativa' || !video || refEnviando.current || refEncontrou.current) return
      if (document.visibilityState === 'hidden' || video.readyState < 2 || !video.videoWidth) return

      refEnviando.current = true
      const minhaGeracao = refGeracao.current
      try {
        const escala = Math.min(1, LARGURA_MAXIMA / video.videoWidth)
        const canvas = refCanvas.current
        canvas.width = Math.round(video.videoWidth * escala)
        canvas.height = Math.round(video.videoHeight * escala)
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)

        let codigo = null

        // 1º tenta o leitor do próprio Chrome (rápido, onde existir)
        if (refDetector.current === undefined) {
          try {
            refDetector.current = 'BarcodeDetector' in window ? new window.BarcodeDetector() : null
          } catch {
            refDetector.current = null
          }
        }
        if (refDetector.current) {
          try {
            const achados = await refDetector.current.detect(canvas)
            if (achados.length) codigo = achados[0].rawValue
          } catch {
            refDetector.current = null // este Chrome não sabe ler: passa a usar o back-end
          }
        }

        // 2º usa o ZXing do back-end (o mesmo do botão "Tirar foto")
        if (!codigo && !refDetector.current) {
          const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.8))
          if (blob) {
            const dados = new FormData()
            dados.append('imagem', blob, 'quadro.jpg')
            try {
              const resposta = await apiFetchArquivo('/codigo-barras/ler', dados)
              codigo = resposta && resposta.codigo
            } catch {
              // "não foi possível ler" é normal a cada quadro sem código: segue tentando
            }
          }
        }

        if (codigo && !refEncontrou.current && minhaGeracao === refGeracao.current) {
          refEncontrou.current = true
          aoLer(codigo)
        }
      } finally {
        refEnviando.current = false
      }
    }
    const id = setInterval(lerQuadro, INTERVALO_LEITURA_MS)
    return () => clearInterval(id)
  }, [estado, aoLer])

  const textoAviso =
    estado === 'iniciando' ? 'Abrindo a câmera...' :
    estado === 'pausada' ? 'Câmera em pausa. Ela volta sozinha quando você retornar ao app.' :
    mensagem

  return (
    <div className="leitor-fundo" role="dialog" aria-modal="true" aria-label="Leitor de código de barras">
      <div className="leitor-caixa">
        <div className="leitor-topo">
          <strong>Aponte para o código de barras</strong>
          <button type="button" className="botao-texto" onClick={aoFechar}>Fechar</button>
        </div>

        <div className="leitor-video">
          <video ref={refVideo} playsInline muted autoPlay />
          {estado === 'ativa' && <div className="leitor-linha" aria-hidden="true" />}
          {estado !== 'ativa' && <div className="leitor-aviso">{textoAviso}</div>}
        </div>
        <canvas ref={refCanvas} hidden />

        <p className="leitor-status" role="status">
          {estado === 'ativa' ? 'Mantenha o código dentro da moldura, bem iluminado.' : ''}
        </p>
        <button type="button" className="botao-ler" onClick={iniciarCamera}>Reiniciar câmera</button>
      </div>
    </div>
  )
}
