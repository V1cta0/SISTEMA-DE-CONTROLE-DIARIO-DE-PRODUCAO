// Peças decorativas do tema café: grão, xícara animada e grãos flutuando no fundo.

export function Grao({ tamanho = 28, cor = '#c27a2c', sulco = '#3a2316', className = '', style }) {
  return (
    <svg className={className} style={style} width={tamanho} height={tamanho} viewBox="0 0 32 32" aria-hidden="true">
      <ellipse cx="16" cy="16" rx="10" ry="13" transform="rotate(25 16 16)" fill={cor} />
      <path d="M10 6c5 4 1 8 6 11s2 7 6 9" fill="none" stroke={sulco} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

// Xícara com vapor subindo e a crema do café se mexendo.
export function XicaraCafe({ tamanho = 160, className = '', titulo = 'Xícara de café fumegante', servindo = false }) {
  return (
    <svg
      className={'xicara ' + className}
      width={tamanho}
      height={Math.round(tamanho * 0.95)}
      viewBox="0 0 200 190"
      role="img"
      aria-label={titulo}
    >
      <g className="vapor" fill="none" strokeLinecap="round">
        <path className="fio fio1" d="M78 62 C66 50 90 42 78 28 C70 18 82 12 80 4" />
        <path className="fio fio2" d="M100 60 C88 46 112 38 100 24 C92 14 104 8 102 0" />
        <path className="fio fio3" d="M122 62 C110 50 134 42 122 28 C114 18 126 12 124 6" />
      </g>

      {/* pires */}
      <ellipse cx="100" cy="170" rx="88" ry="13" fill="var(--xic-sombra)" />
      <ellipse cx="100" cy="165" rx="88" ry="13" fill="var(--xic-porcelana)" stroke="var(--xic-linha)" strokeWidth="3" />
      <ellipse cx="100" cy="164" rx="54" ry="7" fill="none" stroke="var(--xic-linha)" strokeWidth="2" opacity=".3" />

      {/* alça */}
      <path d="M154 90 C188 88 188 134 150 136" fill="none" stroke="var(--xic-linha)" strokeWidth="13" strokeLinecap="round" />
      <path d="M154 90 C188 88 188 134 150 136" fill="none" stroke="var(--xic-porcelana)" strokeWidth="6" strokeLinecap="round" />

      {/* corpo */}
      <path d="M42 80 H158 V118 C158 148 134 162 100 162 C66 162 42 148 42 118 Z" fill="var(--xic-porcelana)" stroke="var(--xic-linha)" strokeWidth="3" strokeLinejoin="round" />
      <path d="M43 104 H157" stroke="var(--caramelo)" strokeWidth="5" opacity=".75" />
      <g transform="translate(86 112) scale(.85)">
        <ellipse cx="16" cy="16" rx="10" ry="13" transform="rotate(25 16 16)" fill="var(--cafe)" />
        <path d="M10 6c5 4 1 8 6 11s2 7 6 9" fill="none" stroke="var(--xic-porcelana)" strokeWidth="2.2" strokeLinecap="round" />
      </g>

      {/* boca da xícara e café */}
      <ellipse cx="100" cy="80" rx="58" ry="12" fill="var(--xic-porcelana)" stroke="var(--xic-linha)" strokeWidth="3" />
      <ellipse cx="100" cy="81" rx="50" ry="9" fill="var(--xic-cafe)" />
      <ellipse className="crema" cx="100" cy="81" rx="30" ry="4.5" fill="var(--caramelo)" opacity=".55" />

      {servindo && (
        <g aria-hidden="true">
          <rect className="jorro" x="96" y="-150" width="8" height="231" rx="4" fill="var(--xic-cafe)" />
          <ellipse className="onda-cafe" cx="100" cy="81" rx="34" ry="6" fill="none" stroke="var(--caramelo)" strokeWidth="2" />
          <ellipse className="onda-cafe onda-cafe2" cx="100" cy="81" rx="34" ry="6" fill="none" stroke="var(--caramelo)" strokeWidth="2" />
        </g>
      )}
    </svg>
  )
}

const POSICOES = [
  { x: '4%', y: '10%', t: 26, r: 15, dur: 19, atraso: 0 },
  { x: '22%', y: '78%', t: 34, r: -30, dur: 23, atraso: -6 },
  { x: '38%', y: '6%', t: 20, r: 70, dur: 17, atraso: -3 },
  { x: '55%', y: '88%', t: 28, r: 110, dur: 21, atraso: -9 },
  { x: '71%', y: '14%', t: 36, r: -50, dur: 25, atraso: -12 },
  { x: '86%', y: '70%', t: 24, r: 30, dur: 18, atraso: -4 },
  { x: '94%', y: '32%', t: 30, r: -100, dur: 22, atraso: -8 },
  { x: '12%', y: '45%', t: 18, r: 140, dur: 20, atraso: -14 }
]

export function GraosFlutuantes() {
  return (
    <div className="graos-flutuantes" aria-hidden="true">
      {POSICOES.map((p, i) => (
        <Grao
          key={i}
          tamanho={p.t}
          cor="#b9824a"
          className="grao-flutua"
          style={{ left: p.x, top: p.y, '--rot': p.r + 'deg', animationDuration: p.dur + 's', animationDelay: p.atraso + 's' }}
        />
      ))}
    </div>
  )
}

// Linha com um grão no meio, usada embaixo dos títulos.
export function DivisorGraos() {
  return (
    <div className="divisor" aria-hidden="true">
      <span /><Grao tamanho={14} cor="#c27a2c" /><span />
    </div>
  )
}
