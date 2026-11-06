import { useEffect, useRef } from 'react'

export default function Modal({ aberto, onClose, children }) {
  const ref = useRef(null)

  useEffect(() => {
    const d = ref.current
    if (aberto && !d.open) d.showModal()
    if (!aberto && d.open) d.close()
  }, [aberto])

  return (
    <dialog ref={ref} onClose={onClose}>
      {aberto && children}
    </dialog>
  )
}
