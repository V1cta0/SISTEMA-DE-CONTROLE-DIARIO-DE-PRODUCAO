/* ===== Camada de dados =====
   Para integrar o backend, troque só o corpo destes 4 métodos por fetch('/api/lotes'...).
   Modelo do lote:
   {id, lote, tipo:'torrado|moido|blend', origem, composicao, data:'AAAA-MM-DD',
    entrada:kg, saida:kg, resp, status:'producao|concluido|embalado', obs} */
const KEY='torraviva.simples.v1';let mem=null;
const store={get(){try{const v=localStorage.getItem(KEY);if(v)return JSON.parse(v)}catch(e){}return mem},
  set(a){mem=a;try{localStorage.setItem(KEY,JSON.stringify(a))}catch(e){}}};
const api={
  async list(){let a=store.get();if(!a){a=seed();store.set(a)}return a},
  async create(r){const a=await this.list();r.id=Date.now();a.unshift(r);store.set(a);return r},
  async update(id,p){const a=await this.list();Object.assign(a.find(x=>x.id===id),p);store.set(a)},
  async remove(id){store.set((await this.list()).filter(x=>x.id!==id))}
};

const iso=d=>new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
const ago=n=>{const d=new Date();d.setDate(d.getDate()-n);return iso(d)};
function seed(){let s=11;const R=()=>(s=s*16807%2147483647)/2147483647,T=['torrado','moido','blend'],
  O=['Sul de Minas','Cerrado Mineiro','Mogiana','Espírito Santo'],C=['Cerrado 60%, Mogiana 40%','Sul de Minas 70%, Robusta 30%'],N=['Ana','Carlos','Marina','Paulo'],cnt={torrado:0,moido:0,blend:0},out=[];
  for(let i=29;i>=0;i--){const tipo=T[Math.floor(R()*3)],d=Math.floor(i*.9),ent=Math.round(20+R()*80),k={torrado:.84,moido:.985,blend:.975}[tipo],p={torrado:'T',moido:'M',blend:'B'}[tipo];
    out.push({id:30-i,lote:p+'-'+String(++cnt[tipo]).padStart(3,'0'),tipo,origem:tipo==='blend'?'':O[Math.floor(R()*4)],composicao:tipo==='blend'?C[Math.floor(R()*2)]:'',
    data:ago(d),entrada:ent,saida:+(ent*(k+(R()-.5)*.03)).toFixed(1),resp:N[Math.floor(R()*4)],status:d<1?'producao':d<3?'concluido':'embalado',obs:''})}
  return out.reverse()}
