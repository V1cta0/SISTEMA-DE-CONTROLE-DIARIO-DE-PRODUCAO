import { useEffect, useState } from 'react'

const CURIOSIDADES = [
  'O Brasil é o maior produtor de café do mundo há mais de 150 anos.',
  'O grão de café é a semente de uma fruta chamada cereja.',
  'Um pé de café leva de três a quatro anos para dar os primeiros frutos.',
  'Quanto mais escura a torra, mais água e massa o grão perde durante o processo.',
  'A moagem fina extrai o café mais rápido. É a escolha típica do espresso.',
  'Depois de moído, o café perde aroma bem mais rápido do que o grão inteiro.',
  'Café recém-torrado libera gás carbônico. Por isso muitas embalagens têm válvula.'
]

export default function FraseCafe() {
  const [i, setI] = useState(() => Math.floor(Math.random() * CURIOSIDADES.length))

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % CURIOSIDADES.length), 12000)
    return () => clearInterval(t)
  }, [])

  return (
    <aside className="frase-cafe">
      <strong>Você sabia?</strong>
      <p key={i}>{CURIOSIDADES[i]}</p>
      <button type="button" className="botao-texto" onClick={() => setI((x) => (x + 1) % CURIOSIDADES.length)}>
        Outra curiosidade
      </button>
    </aside>
  )
}
