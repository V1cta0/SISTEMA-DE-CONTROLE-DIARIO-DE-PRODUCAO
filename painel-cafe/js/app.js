/* ===== Interface ===== */
const $=s=>document.querySelector(s),TN={torrado:'Torrado',moido:'Moído',blend:'Blend'},TC={torrado:'var(--t)',moido:'var(--m)',blend:'var(--b)'},
SN={producao:'Em produção',concluido:'Concluído',embalado:'Embalado'};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=n=>n.toLocaleString('pt-BR',{maximumFractionDigits:1}),dt=s=>s.split('-').reverse().join('/');
const pct=r=>((r.saida/r.entrada)*100).toFixed(1).replace('.',',')+'%',sum=a=>a.reduce((t,r)=>t+r.saida,0);
let data=[];
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('on'),2200)}

function renderSummary(){
  const from=ago(29),a=data.filter(r=>r.data>=from),tot=sum(a);
  $('#total').textContent=fmt(tot);
  $('#sub').textContent=a.length+' lotes nos últimos 30 dias, '+data.filter(r=>r.status==='producao').length+' em produção agora';
  const by={};Object.keys(TN).forEach(t=>by[t]=sum(a.filter(r=>r.tipo===t)));
  $('#strip').innerHTML=Object.keys(by).map(t=>`<i style="flex:${Math.max(by[t],.01)};background:${TC[t]}" title="${TN[t]}"></i>`).join('');
  $('#legend').innerHTML=Object.keys(by).map(t=>`<span><span class="dot" style="background:${TC[t]}"></span>${TN[t]} <b>${fmt(by[t])} kg</b> (${tot?Math.round(by[t]/tot*100):0}%)</span>`).join('');
}
function renderTable(){
  const q=$('#q').value.toLowerCase(),t=$('#ft').value,st=$('#fs').value;
  const a=data.filter(r=>(!t||r.tipo===t)&&(!st||r.status===st)&&(!q||[r.lote,r.origem,r.composicao,r.resp].join(' ').toLowerCase().includes(q)))
    .sort((x,y)=>y.data.localeCompare(x.data)||y.id-x.id);
  $('#empty').hidden=a.length>0;
  $('#rows').innerHTML=a.map(r=>`<tr tabindex="0" data-id="${r.id}"><td><b>${esc(r.lote)}</b></td><td><span class="pill" style="--c:${TC[r.tipo]}">${TN[r.tipo]}</span></td>
  <td>${esc(r.tipo==='blend'?r.composicao:r.origem)||'–'}</td><td>${dt(r.data)}</td><td class="r">${fmt(r.saida)} kg</td><td class="r">${pct(r)}</td><td><span class="st ${r.status}">${SN[r.status]}</span></td></tr>`).join('');
}
const refresh=async()=>{data=await api.list();renderSummary();renderTable()};

function openView(id){
  const r=data.find(x=>x.id===id);if(!r)return;
  $('#view').innerHTML=`<h2>${esc(r.lote)} <span class="pill" style="--c:${TC[r.tipo]};font-size:13px;vertical-align:middle">${TN[r.tipo]}</span></h2>
  <dl class="dl"><dt>Data</dt><dd>${dt(r.data)}</dd><dt>${r.tipo==='blend'?'Composição':'Origem'}</dt><dd>${esc(r.tipo==='blend'?r.composicao:r.origem)||'–'}</dd>
  <dt>Entrada</dt><dd>${fmt(r.entrada)} kg</dd><dt>Saída</dt><dd>${fmt(r.saida)} kg</dd><dt>Rendimento</dt><dd>${pct(r)}</dd>
  <dt>Responsável</dt><dd>${esc(r.resp)}</dd><dt>Observações</dt><dd>${esc(r.obs)||'–'}</dd></dl>
  <div class="f"><div class="w"><label for="vSt">Status do lote</label><select id="vSt">${Object.entries(SN).map(([k,v])=>`<option value="${k}"${k===r.status?' selected':''}>${v}</option>`).join('')}</select></div></div>
  <div class="foot"><button class="btn dng" id="vDel">Excluir lote</button><button class="btn" id="vClose">Fechar</button></div>`;
  $('#dlgView').showModal();
  $('#vClose').onclick=()=>$('#dlgView').close();
  $('#vSt').onchange=async e=>{await api.update(id,{status:e.target.value});await refresh();toast('Status atualizado')};
  $('#vDel').onclick=async()=>{if(confirm('Excluir o lote '+r.lote+'? Essa ação não pode ser desfeita.')){await api.remove(id);$('#dlgView').close();await refresh();toast('Lote excluído')}};
}
function syncForm(){const t=$('#fTipo').value,b=t==='blend';$('#wComp').hidden=!b;$('#wOrig').hidden=b;
  $('#lIn').textContent=t==='moido'?'Café torrado usado (kg)':b?'Cafés misturados (kg)':'Café verde usado (kg)'}
$('#new').onclick=()=>{$('#form').reset();$('#fData').value=iso(new Date());syncForm();$('#dlgForm').showModal()};
$('#fTipo').onchange=syncForm;
$('#cancel').onclick=()=>$('#dlgForm').close();
$('#form').addEventListener('submit',async e=>{
  if(e.submitter?.value!=='ok')return;
  const f=Object.fromEntries(new FormData(e.target)),p={torrado:'T',moido:'M',blend:'B'}[f.tipo],n=data.filter(r=>r.tipo===f.tipo).length+1;
  await api.create({lote:p+'-'+String(n).padStart(3,'0'),tipo:f.tipo,origem:f.origem||'',composicao:f.composicao||'',data:f.data,entrada:+f.entrada,saida:+f.saida,resp:f.resp,status:f.status,obs:f.obs||''});
  await refresh();toast('Lote registrado');
});
$('#rows').onclick=e=>{const tr=e.target.closest('tr');if(tr)openView(+tr.dataset.id)};
$('#rows').onkeydown=e=>{if(e.key==='Enter'){const tr=e.target.closest('tr');if(tr)openView(+tr.dataset.id)}};
['#q','#ft','#fs'].forEach(s=>$(s).addEventListener('input',renderTable));
refresh();
