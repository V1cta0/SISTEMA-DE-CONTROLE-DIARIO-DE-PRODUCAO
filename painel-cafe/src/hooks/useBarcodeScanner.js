import { useEffect, useRef } from 'react'

// Leitores de código de barras USB funcionam como um teclado: digitam os caracteres
// bem rápido e terminam com Enter. Este hook escuta isso na página inteira.
// Quando o backend/leitor real estiver pronto, basta o onScan receber o código.
export function useBarcodeScanner(onScan, { minLength = 4, maxGapMs = 80 } = {}) {
  const buffer = useRef('')
  const ultimo = useRef(0)
  const callback = useRef(onScan)
  callback.current = onScan

  useEffect(() => {
    function onKeyDown(e) {
      const alvo = e.target
      const digitando = ['INPUT', 'TEXTAREA', 'SELECT'].includes(alvo.tagName)
      if (digitando) return // não captura enquanto o usuário preenche um campo

      const agora = Date.now()
      if (agora - ultimo.current > maxGapMs) buffer.current = ''
      ultimo.current = agora

      if (e.key === 'Enter') {
        if (buffer.current.length >= minLength) callback.current(buffer.current)
        buffer.current = ''
      } else if (e.key.length === 1) {
        buffer.current += e.key
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [minLength, maxGapMs])
}
