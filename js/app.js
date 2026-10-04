/* ===== Interface ===== */
const KEY = 'daftar-compta-v1';
function load(){ try{ const s = localStorage.getItem(KEY); if(s) return JSON.parse(s); }catch(e){} return null; }
let S = load() || sampleState();
if(S.company && S.company.sector === undefined) S.company.sector = S.demo ? 'commerce' : '';
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }

const ui = { view:'accueil', invTab:'vente', jf:'', q:'', cls:'', from:'', to:'' };
try{ const h = location.hash.slice(1); if(h) ui.view = h; }catch(e){}
function period(){ const y = S.company.year; return { from: ui.from || `${y}-01-01`, to: ui.to || `${y}-12-31` }; }

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = n => (Math.abs(n) < 0.005 ? 0 : n).toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2});
const fz = n => Math.abs(n) < 0.005 ? '' : fmt(n);
const mad = n => fmt(n) + ' MAD';
const fdate = d => d ? d.split('-').reverse().join('/') : '';
const today = () => new Date().toISOString().slice(0,10);
function toast(msg){ document.querySelectorAll('.toast').forEach(x=>x.remove()); const t = document.createElement('div'); t.className='toast'; t.textContent=msg; document.body.appendChild(t); setTimeout(()=>t.remove(),2200); }

const NAV = [
  ['Saisie', [['accueil','Tableau de bord','◇'],['factures','Factures','FAC'],['journal','Journal','JNL']]],
  ['Référentiel', [['plan','Plan comptable','PCM']]],
  ['États de synthèse', [['balance','Balance','BAL'],['cpc','CPC','CPC'],['bilan','Bilan','BIL']]],
  ['Société', [['parametres','Paramètres','⚙']]]
];
function renderNav(){
  $('#nav').innerHTML = NAV.map(([g,items]) => `<div class="ngroup"><small>${g}</small>${items.map(([k,l,c]) =>
    `<button data-go="${k}" aria-current="${ui.view===k}"><span class="code">${c}</span>${l}</button>`).join('')}</div>`).join('');
}
function fillAccList(){ $('#accList').innerHTML = allAccounts(S).map(a => `<option value="${a.n} — ${esc(a.t)}"></option>`).join(''); }

function demoBanner(){
  if(!S.demo) return '';
  return `<div class="demo"><p><b>Données d'exemple</b> : société fictive « ${esc(S.company.name)} », 1er trimestre ${S.company.year}. Explorez librement, puis démarrez avec votre propre société.</p>
  <button class="btn primary sm" data-act="start-own">Commencer avec ma société</button></div>`;
}
function head(title, sub, actions=''){
  return `<header class="ph"><div><h1>${title}</h1>${sub?`<p class="sub">${sub}</p>`:''}</div><div class="row">${actions}</div></header>`;
}
function periodFilters(extra=''){
  const p = period();
  return `<div class="filters"><label class="f">Du<input type="date" id="pFrom" value="${p.from}"></label>
  <label class="f">Au<input type="date" id="pTo" value="${p.to}"></label>${extra}</div>`;
}
const coName = () => esc(S.company.name || 'Ma société');

/* ---------- Vues ---------- */
const V = {};
const MO = ['Janv.','Févr.','Mars','Avr.','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'];
const ST = { good:['✓','Bon'], warn:['!','À surveiller'], bad:['✕','Critique'], na:['i','Info'] };
const stChip = s => `<span class="st ${s}"><span aria-hidden="true">${ST[s][0]}</span>${ST[s][1]}</span>`;
function niceScale(min, max, ticks=4){
  if(max === min) max = min + 1;
  const raw = (max - min) / ticks, p = Math.pow(10, Math.floor(Math.log10(raw)));
  const st = [1,2,2.5,5,10].map(x => x*p).find(x => x >= raw);
  const lo = Math.floor(min/st)*st, hi = Math.ceil(max/st)*st, t = [];
  for(let v = lo; v <= hi + 1e-9; v += st) t.push(r2(v));
  return { lo, hi, t };
}
const kfmt = v => Math.abs(v) >= 1000 ? (v/1000).toLocaleString('fr-FR',{maximumFractionDigits:1}) + ' k' : Math.round(v).toLocaleString('fr-FR');
function barPath(x, y0, w, y1, r=4){
  const h = y0 - y1; if(h <= 0.5) return '';
  const rr = Math.min(r, h, w/2);
  return `M${x},${y0}V${y1+rr}Q${x},${y1} ${x+rr},${y1}H${x+w-rr}Q${x+w},${y1} ${x+w},${y1+rr}V${y0}Z`;
}
function chartBars(months){
  const W=innerWidth<600?380:640, H=240, L=44, R=8, T=12, B=28, n=months.length;
  const sc = niceScale(0, Math.max(1, ...months.map(M => Math.max(M.ca, M.ch))));
  const y = v => T + (H-T-B) * (1 - (v - sc.lo)/(sc.hi - sc.lo));
  const gw = (W-L-R)/n, bw = Math.min(26, gw*0.3);
  let g = sc.t.map(v => `<line class="gl" x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}"/><text x="${L-8}" y="${y(v)+4}" text-anchor="end">${kfmt(v)}</text>`).join('');
  months.forEach((M,k) => {
    const cx = L + gw*k + gw/2, x0 = cx - bw - 1;
    g += `<path class="s1" d="${barPath(x0, y(0), bw, y(Math.max(0,M.ca)))}"/><path class="s2" d="${barPath(x0+bw+2, y(0), bw, y(Math.max(0,M.ch)))}"/>`;
    g += `<text x="${cx}" y="${H-8}" text-anchor="middle">${MO[M.m-1]}</text>`;
    g += `<rect class="hit" x="${L+gw*k}" y="${T}" width="${gw}" height="${H-T-B}" data-tip="${esc(`<b>${MO[M.m-1]} ${S.company.year}</b><br><i class=sw style=background:var(--s1)></i>CA : ${fmt(M.ca)}<br><i class=sw style=background:var(--s2)></i>Charges : ${fmt(M.ch)}<br>Résultat : ${fmt(M.res)}`)}"/>`;
  });
  g += `<line class="axis" x1="${L}" x2="${W-R}" y1="${y(0)}" y2="${y(0)}"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Chiffre d'affaires et charges par mois">${g}</svg>`;
}
function chartLine(months){
  const W=innerWidth<600?380:640, H=240, L=44, R=16, T=22, B=28, n=months.length;
  const vals = months.map(M => M.treso);
  const sc = niceScale(Math.min(0, ...vals), Math.max(1, ...vals));
  const y = v => T + (H-T-B) * (1 - (v - sc.lo)/(sc.hi - sc.lo));
  const x = k => n === 1 ? (L + W - R)/2 : L + 18 + (W - L - R - 36) * k/(n-1);
  let g = sc.t.map(v => `<line class="gl" x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}"/><text x="${L-8}" y="${y(v)+4}" text-anchor="end">${kfmt(v)}</text>`).join('');
  const pts = vals.map((v,k) => `${x(k)},${y(v)}`);
  if(n > 1) g += `<path class="area" d="M${x(0)},${y(Math.max(sc.lo,0))}L${pts.join('L')}L${x(n-1)},${y(Math.max(sc.lo,0))}Z"/><path class="ln" d="M${pts.join('L')}"/>`;
  if(sc.lo < 0) g += `<line class="axis" x1="${L}" x2="${W-R}" y1="${y(0)}" y2="${y(0)}"/>`;
  months.forEach((M,k) => {
    const last = k === n-1;
    g += `<circle class="dot${last?' end':''}" cx="${x(k)}" cy="${y(M.treso)}" r="${last?5:4}"/>`;
    g += `<text x="${x(k)}" y="${H-8}" text-anchor="middle">${MO[M.m-1]}</text>`;
    if(last) g += `<text class="lab" x="${x(k)}" y="${y(M.treso)-11}" text-anchor="${n>1?'end':'middle'}">${kfmt(M.treso)}</text>`;
    const hw = n === 1 ? (W-L-R) : (W-L-R-36)/(n-1);
    g += `<rect class="hit" x="${x(k)-hw/2}" y="${T}" width="${hw}" height="${H-T-B}" data-tip="${esc(`<b>Fin ${MO[M.m-1]} ${S.company.year}</b><br>Trésorerie : ${fmt(M.treso)} MAD`)}"/>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Évolution de la trésorerie en fin de mois">${g}</svg>`;
}
function chargeBars(i){
  const r = i.cpc;
  const rows = r.ce.concat([['Charges financières', r.V], ['Charges non courantes', r.IX], ['Impôts sur les résultats', r.XII]])
    .filter(x => x[1] > 0).sort((a,b) => b[1]-a[1]);
  if(!rows.length) return '<p class="empty">Aucune charge sur la période.</p>';
  const max = rows[0][1];
  return `<div class="hbars">${rows.map(([l,v]) => `<div class="hb" data-tip="${esc(`<b>${l}</b><br>${fmt(v)} MAD<br>${i.ca?(v/i.ca*100).toFixed(1).replace('.',',')+' % du CA':''}`)}">
    <span class="hl">${l}</span><span class="track"><span class="fill" style="width:${Math.max(1, v/max*100)}%"></span></span>
    <span class="hv">${kfmt(v)}${i.ca?` <small>${(v/i.ca*100).toFixed(1).replace('.',',')} %</small>`:''}</span></div>`).join('')}</div>`;
}
function sectorPicker(cur){
  return `<div class="secgrid">${Object.entries(SECTORS).map(([k,s]) => `<button type="button" class="secb" data-act="set-sector" data-sec="${k}" aria-pressed="${cur===k}"><b>${s.label}</b><span>${s.desc}</span></button>`).join('')}</div>`;
}
function dataTable(months){
  return `<details class="dt"><summary>Voir les données</summary><div class="tw"><table><thead><tr><th>Mois</th><th class="n">CA HT</th><th class="n">Charges</th><th class="n">Résultat</th><th class="n">Trésorerie fin de mois</th></tr></thead><tbody>
  ${months.map(M => `<tr><td>${MO[M.m-1]}</td><td class="n">${fmt(M.ca)}</td><td class="n">${fmt(M.ch)}</td><td class="n">${fmt(M.res)}</td><td class="n">${fmt(M.treso)}</td></tr>`).join('')}</tbody></table></div></details>`;
}

V.accueil = () => {
  const p = period(), i = indicators(S, p.from, p.to), r = i.cpc;
  const months = monthly(S, S.company.year), sk = S.company.sector, sec = SECTORS[sk];
  const unpaid = S.invoices.filter(v => !v.paid).sort((a,b)=>a.date.localeCompare(b.date));
  const tile = (l,v,s) => `<div class="tile"><small>${l}</small><b>${fmt(v)}</b><span>${s}</span></div>`;
  const pct = x => (Math.round(x*1000)/10).toLocaleString('fr-FR') + ' %';
  const kpis = (SECTOR_KPIS[sk] || []).map(([k,good,warn]) => {
    const d = KPI_DEFS[k], v = d.f(i), s = kpiStatus(v, good, warn, d.dir);
    const val = s === 'na' ? '—' : d.unit === 'j' ? v + ' j' : pct(v);
    const rep = (d.dir==='min'?'≥ ':'≤ ') + (d.unit==='j' ? good + ' j' : pct(good));
    return `<div class="kpi"><div class="kh"><small>${d.label}</small>${s==='na'?'':stChip(s)}</div><b>${val}</b><span>Repère : ${rep}</span><span class="kf">${d.help}</span></div>`;
  }).join('');
  const an = analysis(S, i, months);
  return head(coName(), `Exercice ${S.company.year} · montants en MAD${sec ? ` · <button class="linkbtn" data-go="parametres">${sec.label}</button>` : ''}`,
    `<button class="btn primary" data-act="new-inv" data-type="vente">Nouvelle facture de vente</button><button class="btn" data-act="new-inv" data-type="achat">Nouvelle facture d'achat</button>`)
  + (sec ? '' : `<section class="panel" style="margin-bottom:20px"><h2>Quelle est l'activité de votre entreprise ?</h2><p class="note" style="margin:0 0 12px">Le tableau de bord choisit les indicateurs clés et les repères adaptés à votre secteur.</p>${sectorPicker('')}</section>`)
  + `<div class="tiles">
    ${tile("Chiffre d'affaires HT", r.ca, 'Ventes de marchandises, biens et services')}
    ${tile('Valeur ajoutée', i.va, 'Richesse créée par l’activité')}
    ${tile('EBE', i.ebe, 'Excédent brut d’exploitation')}
    ${tile('Résultat net', r.XIII, r.XIII >= 0 ? 'Bénéfice de la période' : 'Perte de la période')}
    ${tile('Trésorerie nette', i.treso, 'Banque + caisse − découverts')}
    ${tile('Créances clients', i.clients, 'Factures de vente non encaissées (TTC)')}
    ${tile('Dettes fournisseurs', i.fourn, 'Factures d\'achat non réglées (TTC)')}
    ${tile(i.tva >= 0 ? 'TVA à payer' : 'Crédit de TVA', Math.abs(i.tva), 'TVA facturée − TVA récupérable')}
  </div>`
  + (sec ? `<section class="block"><div class="bh"><h2>Indicateurs clés · ${sec.label}</h2><button class="linkbtn" data-go="parametres">Changer de secteur</button></div><div class="kpis">${kpis}</div></section>` : '')
  + `<section class="block"><h2>Graphiques</h2><div class="charts">
      <figure class="panel chart"><figcaption><b>Chiffre d'affaires et charges par mois</b><span class="legend"><span><i class="sw" style="background:var(--s1)"></i>CA HT</span><span><i class="sw" style="background:var(--s2)"></i>Charges</span></span></figcaption>${chartBars(months)}</figure>
      <figure class="panel chart"><figcaption><b>Trésorerie en fin de mois</b><span class="legend">Banque + caisse, en MAD</span></figcaption>${chartLine(months)}</figure>
      <figure class="panel chart wide"><figcaption><b>Structure des charges</b><span class="legend">Montant et poids dans le chiffre d'affaires</span></figcaption>${chargeBars(i)}</figure>
    </div>${dataTable(months)}</section>`
  + `<section class="block"><h2>Analyse et actions proposées</h2><ul class="findings">${an.map(f => `<li class="fd ${f.s}">${stChip(f.s)}<div><b>${f.t}</b><p>${f.d}</p>${f.a ? `<p class="act"><b>Action proposée :</b> ${f.a}</p>` : ''}</div></li>`).join('')}</ul>
    <p class="note">Analyse générée automatiquement à partir de vos écritures. Les repères sectoriels sont indicatifs et doivent être adaptés à la taille et au contexte de votre entreprise.</p></section>`
  + `<div class="grid2">
    <section><h2>Factures à régler</h2>${unpaid.length ? `<div class="tw"><table><thead><tr><th>Date</th><th>N°</th><th>Tiers</th><th class="n">TTC</th><th></th></tr></thead><tbody>
      ${unpaid.map(v => `<tr><td>${fdate(v.date)}</td><td class="acc">${esc(v.num)}</td><td>${esc(v.tiers)} <span class="chip ${v.type==='vente'?'warn':'bad'}">${v.type==='vente'?'à encaisser':'à payer'}</span></td><td class="n">${fmt(invTotals(v).ttc)}</td><td><button class="btn sm" data-act="pay" data-id="${v.id}">Régler</button></td></tr>`).join('')}
      </tbody></table></div>` : `<div class="panel empty">Toutes les factures sont réglées.</div>`}</section>
    <section><h2>Dernières écritures</h2>${S.entries.length ? `<div class="tw"><table><thead><tr><th>Date</th><th>Jnl</th><th>Libellé</th><th class="n">Montant</th></tr></thead><tbody>
      ${S.entries.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,7).map(e => `<tr><td>${fdate(e.date)}</td><td><span class="chip j">${e.journal}</span></td><td>${esc(e.label)}</td><td class="n">${fmt(e.lines.reduce((s,l)=>s+l.debit,0))}</td></tr>`).join('')}
      </tbody></table></div>` : `<div class="panel empty">Aucune écriture. Commencez par saisir une facture ou une opération diverse.</div>`}</section>
  </div>`;
};

V.factures = () => {
  const list = S.invoices.filter(i => i.type === ui.invTab).sort((a,b)=>b.date.localeCompare(a.date));
  const tiersL = ui.invTab === 'vente' ? 'Client' : 'Fournisseur';
  return head('Factures', "Chaque facture génère automatiquement son écriture comptable selon le PCM.",
    `<button class="btn primary" data-act="new-inv" data-type="${ui.invTab}">Nouvelle facture ${ui.invTab==='vente'?'de vente':"d'achat"}</button>`)
  + `<div class="row" style="margin-bottom:14px"><div class="tabs" role="group">
      <button data-tab="vente" aria-pressed="${ui.invTab==='vente'}">Ventes</button><button data-tab="achat" aria-pressed="${ui.invTab==='achat'}">Achats</button></div></div>`
  + (list.length ? `<div class="tw"><table><thead><tr><th>Date</th><th>N°</th><th>${tiersL}</th><th class="n">HT</th><th class="n">TVA</th><th class="n">TTC</th><th>Statut</th><th></th></tr></thead><tbody>
    ${list.map(i => { const t = invTotals(i); return `<tr><td>${fdate(i.date)}</td><td class="acc">${esc(i.num)}</td><td>${esc(i.tiers)}</td>
      <td class="n">${fmt(t.ht)}</td><td class="n">${fmt(t.tva)}</td><td class="n">${fmt(t.ttc)}</td>
      <td>${i.paid ? `<span class="chip ok">Réglée le ${fdate(i.paid.date)} · ${i.paid.mode}</span>` : `<span class="chip warn">À régler</span>`}</td>
      <td class="row" style="flex-wrap:nowrap">${i.paid?'':`<button class="btn sm" data-act="pay" data-id="${i.id}">Régler</button>`}<button class="btn sm ghost" data-confirm="del-inv" data-id="${i.id}">Supprimer</button></td></tr>`; }).join('')}
    </tbody></table></div>` : `<div class="panel empty">Aucune facture ${ui.invTab==='vente'?'de vente':"d'achat"} pour l'instant.</div>`);
};

V.journal = () => {
  const q = ui.q.toLowerCase();
  const list = S.entries.filter(e => (!ui.jf || e.journal === ui.jf) &&
    (!q || (e.label+' '+e.ref+' '+e.lines.map(l=>l.account).join(' ')).toLowerCase().includes(q)))
    .sort((a,b)=>b.date.localeCompare(a.date));
  let td = 0, tc = 0;
  const rows = list.map(e => {
    const lines = e.lines.map(l => { td += l.debit; tc += l.credit; return `<tr class="click" data-gl="${l.account}"><td></td><td class="acc">${l.account}</td><td>${esc(l.label)}</td><td class="n">${fz(l.debit)}</td><td class="n">${fz(l.credit)}</td></tr>`; }).join('');
    const del = e.src && e.src.kind === 'od' ? `<button class="btn sm ghost" data-confirm="del-od" data-id="${e.id}">Supprimer</button>` : '';
    return `<tr class="ehead"><td>${fdate(e.date)}</td><td><span class="chip j">${e.journal}</span></td><td><b>${esc(e.label)}</b> <span class="code">${esc(e.ref||'')}</span></td><td colspan="2" style="text-align:right">${del}</td></tr>${lines}`;
  }).join('');
  return head('Journal', 'Toutes les écritures, dans le format débit / crédit. Cliquez sur une ligne pour voir le grand livre du compte.',
    `<button class="btn primary" data-act="new-od">Nouvelle opération diverse</button>`)
  + `<div class="filters"><label class="f">Journal<select id="jf"><option value="">Tous les journaux</option>${Object.entries(JOURNALS).map(([k,v])=>`<option value="${k}" ${ui.jf===k?'selected':''}>${k} — ${v}</option>`).join('')}</select></label>
    <label class="f">Rechercher<input id="jq" value="${esc(ui.q)}" placeholder="libellé, n° de pièce, compte"></label></div>`
  + (list.length ? `<div class="tw"><table><thead><tr><th>Date</th><th>Compte</th><th>Libellé</th><th class="n">Débit</th><th class="n">Crédit</th></tr></thead><tbody>${rows}
    <tr class="tot"><td colspan="3">Total (${list.length} écritures)</td><td class="n">${fmt(td)}</td><td class="n">${fmt(tc)}</td></tr></tbody></table></div>`
    : `<div class="panel empty">Aucune écriture ne correspond.</div>`);
};

V.plan = () => {
  const q = ui.q.toLowerCase(), m = balances(S);
  const accs = allAccounts(S).filter(a => (!ui.cls || a.n[0] === ui.cls) && (!q || (a.n+' '+a.t).toLowerCase().includes(q)));
  const custom = n => S.accounts.some(a => a.n === n);
  let cur = '';
  const rows = accs.map(a => {
    let h = '';
    if(a.n[0] !== cur){ cur = a.n[0]; h = `<tr class="sub"><td class="acc">Classe ${cur}</td><td colspan="3">${CLASSES[cur]||''}</td></tr>`; }
    const b = m[a.n], s = b ? r2(b.d - b.c) : 0;
    return h + `<tr class="${b?'click':''}" ${b?`data-gl="${a.n}"`:''}><td class="acc">${a.n}</td><td>${esc(a.t)} ${custom(a.n)?'<span class="chip j">ajouté</span>':''}</td>
      <td class="n">${s ? fmt(Math.abs(s)) + (s>0?' D':' C') : ''}</td><td>${custom(a.n) && !b ? `<button class="btn sm ghost" data-confirm="del-acc" data-id="${a.n}">Retirer</button>`:''}</td></tr>`;
  }).join('');
  return head('Plan comptable marocain', `${PCM.length} comptes du PCM intégrés${S.accounts.length?` + ${S.accounts.length} ajoutés par vous`:''}. Ajoutez des sous-comptes selon vos besoins (ex. 34211 Client Hôtel Mogador).`,
    `<button class="btn primary" data-act="new-acc">Ajouter un compte</button>`)
  + `<div class="filters"><label class="f">Classe<select id="cls"><option value="">Toutes les classes</option>${Object.entries(CLASSES).map(([k,v])=>`<option value="${k}" ${ui.cls===k?'selected':''}>${k} — ${v}</option>`).join('')}</select></label>
    <label class="f">Rechercher<input id="jq" value="${esc(ui.q)}" placeholder="numéro ou intitulé"></label></div>`
  + `<div class="tw"><table><thead><tr><th>N° de compte</th><th>Intitulé</th><th class="n">Solde</th><th></th></tr></thead><tbody>${rows || '<tr><td colspan="4" class="empty">Aucun compte trouvé.</td></tr>'}</tbody></table></div>`;
};

V.balance = () => {
  const p = period(), m = balances(S, p.from, p.to);
  const accs = Object.keys(m).filter(a => !ui.cls || a[0] === ui.cls).sort();
  const T = {md:0,mc:0,sd:0,sc:0}; let cur = '', C = null, out = '';
  const flush = () => { if(C) out += `<tr class="sub"><td colspan="2">Total classe ${cur}</td><td class="n">${fmt(C.md)}</td><td class="n">${fmt(C.mc)}</td><td class="n">${fmt(C.sd)}</td><td class="n">${fmt(C.sc)}</td></tr>`; };
  accs.forEach(a => {
    if(a[0] !== cur){ flush(); cur = a[0]; C = {md:0,mc:0,sd:0,sc:0}; }
    const b = m[a], s = r2(b.d - b.c), sd = s > 0 ? s : 0, sc = s < 0 ? -s : 0;
    [[ 'md',b.d ],[ 'mc',b.c ],[ 'sd',sd ],[ 'sc',sc ]].forEach(([k,v]) => { C[k] = r2(C[k]+v); T[k] = r2(T[k]+v); });
    out += `<tr class="click" data-gl="${a}"><td class="acc">${a}</td><td>${esc(accLabel(S,a))}</td><td class="n">${fz(b.d)}</td><td class="n">${fz(b.c)}</td><td class="n">${fz(sd)}</td><td class="n">${fz(sc)}</td></tr>`;
  });
  flush();
  const okM = Math.abs(T.md - T.mc) < .01, okS = Math.abs(T.sd - T.sc) < .01;
  return head('Balance générale', `${coName()} · du ${fdate(p.from)} au ${fdate(p.to)}`)
  + periodFilters(`<label class="f">Classe<select id="cls"><option value="">Toutes</option>${Object.keys(CLASSES).map(k=>`<option value="${k}" ${ui.cls===k?'selected':''}>Classe ${k}</option>`).join('')}</select></label>`)
  + (accs.length ? `<div class="tw"><table><thead><tr><th rowspan="2">Compte</th><th rowspan="2">Intitulé</th><th class="n" colspan="2">Mouvements</th><th class="n" colspan="2">Soldes</th></tr>
    <tr><th class="n">Débit</th><th class="n">Crédit</th><th class="n">Débiteur</th><th class="n">Créditeur</th></tr></thead><tbody>${out}
    <tr class="tot"><td colspan="2">Total général</td><td class="n">${fmt(T.md)}</td><td class="n">${fmt(T.mc)}</td><td class="n">${fmt(T.sd)}</td><td class="n">${fmt(T.sc)}</td></tr></tbody></table></div>
    ${ui.cls ? '' : `<p class="check">${okM && okS ? '<span class="chip ok">Balance équilibrée : total débit = total crédit</span>' : '<span class="chip bad">Balance déséquilibrée : vérifiez les écritures</span>'}</p>`}`
    : `<div class="panel empty">Aucun mouvement sur la période.</div>`);
};

V.cpc = () => {
  const p = period(), r = cpc(balances(S, p.from, p.to));
  const L = arr => arr.map(([t,v]) => `<tr><td></td><td>${t}</td><td class="n">${fz(v)}</td></tr>`).join('');
  const T = (n,t,v,cls='sub') => `<tr class="${cls}"><td class="roman">${n}</td><td>${t}</td><td class="n">${fmt(v)}</td></tr>`;
  return head('Compte de produits et charges', `Modèle normal simplifié · du ${fdate(p.from)} au ${fdate(p.to)}`) + periodFilters()
  + `<div class="doc"><div class="doc-h"><b>${coName()}</b><span>CPC (hors taxes) · exercice ${S.company.year} · en MAD</span></div>
  <div class="tw" style="border:none"><table><thead><tr><th></th><th>Désignation</th><th class="n">Montant</th></tr></thead><tbody>
  <tr><td class="roman"></td><td colspan="2"><b>EXPLOITATION</b></td></tr>
  ${T('I','Produits d\'exploitation',r.I)}${L(r.pe)}
  ${T('II','Charges d\'exploitation',r.II)}${L(r.ce)}
  ${T('III','Résultat d\'exploitation (I − II)',r.III,'tot')}
  <tr><td class="roman"></td><td colspan="2"><b>FINANCIER</b></td></tr>
  ${T('IV','Produits financiers',r.IV)}${T('V','Charges financières',r.V)}
  ${T('VI','Résultat financier (IV − V)',r.VI,'tot')}
  ${T('VII','Résultat courant (III + VI)',r.VII,'tot')}
  <tr><td class="roman"></td><td colspan="2"><b>NON COURANT</b></td></tr>
  ${T('VIII','Produits non courants',r.VIII)}${T('IX','Charges non courantes',r.IX)}
  ${T('X','Résultat non courant (VIII − IX)',r.X,'tot')}
  ${T('XI','Résultat avant impôts (VII + X)',r.XI)}
  ${T('XII','Impôts sur les résultats',r.XII)}
  ${T('XIII','Résultat net (XI − XII)',r.XIII,'tot')}
  </tbody></table></div>
  <p class="note">Les variations de stocks ne sont prises en compte que si vous les saisissez en opération diverse (comptes 6114, 6124, 713x). L'impôt sur les résultats (compte 6701) est à saisir de la même façon.</p></div>`;
};

V.bilan = () => {
  const p = period(), b = bilan(balances(S, p.from, p.to)), t = b.tot;
  const A = rows => rows.map(x => `<tr><td>${x.t}</td><td class="n">${fz(x.brut)}</td><td class="n">${fz(x.amort)}</td><td class="n">${fz(x.net)}</td></tr>`).join('');
  const AT = (l,rows) => { const s = k => r2(rows.reduce((a,x)=>a+x[k],0)); return `<tr class="sub"><td>${l}</td><td class="n">${fmt(s('brut'))}</td><td class="n">${fmt(s('amort'))}</td><td class="n">${fmt(s('net'))}</td></tr>`; };
  const P = rows => rows.filter(([l,v],i) => v || !/^Autres/.test(l)).map(([l,v]) => `<tr><td>${l}</td><td class="n">${fz(v)}</td></tr>`).join('');
  const PT = (l,v) => `<tr class="sub"><td>${l}</td><td class="n">${fmt(v)}</td></tr>`;
  const ok = Math.abs(t.actif - t.passif) < .01;
  return head('Bilan simplifié', `Situation au ${fdate(p.to)}`) + periodFilters()
  + `<div class="doc" style="max-width:none"><div class="doc-h"><b>${coName()}</b><span>Bilan au ${fdate(p.to)} · en MAD</span></div>
  <div class="grid2">
    <div class="tw"><table><thead><tr><th>Actif</th><th class="n">Brut</th><th class="n">Amort. & prov.</th><th class="n">Net</th></tr></thead><tbody>
      ${AT('Actif immobilisé',b.actif.immo)}${A(b.actif.immo)}
      ${AT('Actif circulant (hors trésorerie)',b.actif.circ)}${A(b.actif.circ)}
      ${AT('Trésorerie – actif',b.actif.treso)}
      <tr class="tot"><td colspan="3">Total actif</td><td class="n">${fmt(t.actif)}</td></tr></tbody></table></div>
    <div class="tw"><table><thead><tr><th>Passif</th><th class="n">Montant</th></tr></thead><tbody>
      ${PT('Capitaux propres',t.cp)}${P(b.passif.cp)}
      ${PT('Autres financements permanents',t.fin)}${P(b.passif.fin)}
      ${PT('Passif circulant (hors trésorerie)',t.circP)}${P(b.passif.circ)}
      ${PT('Trésorerie – passif',t.tresoP)}
      <tr class="tot"><td>Total passif</td><td class="n">${fmt(t.passif)}</td></tr></tbody></table></div>
  </div>
  <p class="check">${ok ? '<span class="chip ok">Bilan équilibré : total actif = total passif</span>' : `<span class="chip bad">Écart de ${fmt(t.actif - t.passif)} MAD : vérifiez les écritures</span>`}</p>
  <p class="note">Le résultat net de l'exercice (${fmt(b.res)} MAD) provient directement du CPC de la même période. Les soldes de trésorerie créditeurs (découverts) sont reclassés en trésorerie-passif.</p></div>`;
};

V.parametres = () => {
  const c = S.company;
  return head('Paramètres', 'Identité de la société, exercice et sauvegarde de vos données.')
  + `<div class="grid2"><section class="panel"><h2>Société</h2><form id="coForm" class="fgrid">
      <label class="f">Raison sociale<input id="coName" value="${esc(c.name)}" placeholder="ex. Ma Société SARL"></label>
      <label class="f">ICE (facultatif)<input id="coIce" value="${esc(c.ice)}" inputmode="numeric"></label>
      <label class="f">Exercice<input id="coYear" type="number" min="2000" max="2100" value="${c.year}"></label>
      <div class="row" style="align-items:flex-end"><button class="btn primary" type="submit">Enregistrer</button></div></form>
      <p class="note">Vos données restent dans ce navigateur, sur cet appareil. Pensez à faire une sauvegarde régulière.</p></section>
    <section class="panel" style="grid-column:1/-1"><h2>Secteur d'activité</h2><p class="note" style="margin:0 0 12px">Il détermine les indicateurs clés, les repères d'analyse du tableau de bord et les comptes proposés par défaut sur les factures.</p>${sectorPicker(c.sector)}</section>
    <section class="panel"><h2>Sauvegarde</h2>
      <div class="row"><button class="btn" data-act="copy-json">Copier la sauvegarde</button>
      <label class="btn" for="impFile">Restaurer depuis un fichier</label><input id="impFile" type="file" accept=".json,.txt,application/json" hidden></div>
      <label class="f" style="margin-top:12px">Ou collez une sauvegarde ici<textarea id="impTxt" rows="4" placeholder='{"v":1, ...}'></textarea></label>
      <div class="row" style="margin-top:8px"><button class="btn sm" data-act="imp-txt">Restaurer le texte collé</button></div>
      <p class="note">« Copier la sauvegarde » place toutes vos données dans le presse-papiers : collez-les dans un fichier texte pour les conserver.</p></section>
    <section class="panel"><h2>Réinitialiser</h2><div class="row">
      <button class="btn" data-confirm="reset-empty">Repartir de zéro</button>
      <button class="btn" data-confirm="reset-demo">Recharger l'exemple</button></div>
      <p class="note">Ces actions remplacent toutes les données actuelles.</p></section></div>`;
};

/* ---------- Rendu ---------- */
function render(){
  if(!V[ui.view]) ui.view = 'accueil';
  renderNav();
  $('#main').innerHTML = demoBanner() + V[ui.view]();
}
function commit(msg){ save(); fillAccList(); render(); if(msg) toast(msg); }

/* ---------- Modales ---------- */
function openModal(title, body){
  $('#modal').innerHTML = `<div class="ov" data-ov><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="mh"><h2>${title}</h2><button class="btn sm ghost" data-act="close">Fermer</button></div>${body}</div></div>`;
  const f = $('#modal input, #modal select'); if(f) f.focus();
}
function closeModal(){ $('#modal').innerHTML = ''; }

function accOptions(type, sel){
  const ok = type === 'vente'
    ? a => a.n.startsWith('71') && !/^71(3|4|6|9)/.test(a.n) && !/^71\d9/.test(a.n)
    : a => (/^61[1-4]/.test(a.n) && !/^61\d[49]/.test(a.n)) || /^2[123]/.test(a.n);
  const accs = allAccounts(S).filter(ok);
  const groups = type === 'vente' ? [['Produits (classe 7)', accs]] :
    [['Charges (classe 6)', accs.filter(a=>a.n[0]==='6')], ['Immobilisations (classe 2)', accs.filter(a=>a.n[0]==='2')]];
  return groups.map(([g,l]) => `<optgroup label="${g}">${l.map(a=>`<option value="${a.n}" ${a.n===sel?'selected':''}>${a.n} — ${esc(a.t)}</option>`).join('')}</optgroup>`).join('');
}
function nextNum(type){
  const pre = (type==='vente'?'FV-':'FA-') + S.company.year + '-';
  const n = S.invoices.filter(i => i.type===type && i.num.startsWith(pre)).length + 1;
  return pre + String(n).padStart(3,'0');
}
let INV = null;
function openInvoice(type){
  const SD = SECTORS[S.company.sector] || {};
  INV = { type, lines:[{ label:'', account: type==='vente' ? (SD.vente||'7111') : (SD.achat||'6111'), ht:'', rate:20 }] };
  openModal(type==='vente' ? 'Nouvelle facture de vente' : "Nouvelle facture d'achat", `<form id="invForm" novalidate>
    <div class="fgrid">
      <label class="f">Date<input type="date" id="iDate" value="${today()}" required></label>
      <label class="f">N° de facture<input id="iNum" value="${nextNum(type)}" required></label>
      <label class="f">${type==='vente'?'Client':'Fournisseur'}<input id="iTiers" required placeholder="${type==='vente'?'ex. Hôtel Mogador':'ex. Sud Import'}"></label>
      <label class="f">Règlement<select id="iPay"><option value="">À crédit (à régler plus tard)</option><option value="banque">Payée par banque</option><option value="caisse">Payée en espèces (caisse)</option></select></label>
    </div>
    <div class="tw" style="margin-top:14px"><table class="lines"><thead><tr><th>Désignation</th><th>Compte</th><th class="n">Montant HT</th><th>TVA</th><th></th></tr></thead><tbody id="iLines"></tbody></table></div>
    <div class="row" style="justify-content:space-between;margin-top:10px"><button type="button" class="btn sm" data-act="add-line">Ajouter une ligne</button><div class="totals" id="iTot"></div></div>
    <div class="preview" style="margin-top:14px"><h3>Écriture générée automatiquement</h3><div id="iPrev"></div></div>
    <p class="err" id="iErr"></p>
    <div class="row" style="justify-content:flex-end"><button type="button" class="btn" data-act="close">Annuler</button><button class="btn primary" type="submit">Enregistrer la facture</button></div>
  </form>`);
  drawInvLines();
}
function drawInvLines(){
  $('#iLines').innerHTML = INV.lines.map((l,i) => `<tr>
    <td style="min-width:160px"><input data-l="${i}" data-k="label" value="${esc(l.label)}" placeholder="ex. Lot de marchandises"></td>
    <td style="min-width:220px"><select data-l="${i}" data-k="account">${accOptions(INV.type,l.account)}</select></td>
    <td style="min-width:120px"><input class="num" data-l="${i}" data-k="ht" type="number" step="0.01" min="0" value="${l.ht}"></td>
    <td style="min-width:80px"><select data-l="${i}" data-k="rate">${TVA_RATES.map(r=>`<option value="${r}" ${+l.rate===r?'selected':''}>${r} %</option>`).join('')}</select></td>
    <td>${INV.lines.length>1?`<button type="button" class="btn sm ghost" data-act="rm-line" data-i="${i}" aria-label="Retirer la ligne">✕</button>`:''}</td></tr>`).join('');
  updInv();
}
function invFromForm(){
  return { type: INV.type, date: $('#iDate').value, num: $('#iNum').value.trim(), tiers: $('#iTiers').value.trim() || '…',
    lines: INV.lines.map(l => ({ label: l.label, account: l.account, ht: r2(+l.ht||0), rate: +l.rate })) };
}
function entryTable(lines){
  const d = r2(lines.reduce((s,l)=>s+l.debit,0)), c = r2(lines.reduce((s,l)=>s+l.credit,0));
  return `<div style="overflow-x:auto"><table><thead><tr><th>Compte</th><th>Intitulé</th><th class="n">Débit</th><th class="n">Crédit</th></tr></thead><tbody>
  ${lines.map(l=>`<tr><td class="acc">${l.account}</td><td>${esc(l.label)}</td><td class="n">${fz(l.debit)}</td><td class="n">${fz(l.credit)}</td></tr>`).join('')}
  <tr class="sub"><td colspan="2">Total</td><td class="n">${fmt(d)}</td><td class="n">${fmt(c)}</td></tr></tbody></table></div>`;
}
function updInv(){
  const inv = invFromForm(), t = invTotals(inv);
  $('#iTot').innerHTML = `<div><small>Total HT</small>${fmt(t.ht)}</div><div><small>TVA</small>${fmt(t.tva)}</div><div><small>Total TTC</small><b>${fmt(t.ttc)}</b></div>`;
  if(!t.ht){ $('#iPrev').innerHTML = '<p class="note" style="margin:0">Saisissez un montant HT pour voir l\'écriture.</p>'; return; }
  let lines = invoiceEntry(S, inv).lines;
  const pay = $('#iPay').value;
  if(pay) lines = lines.concat(paymentEntry(S, inv, inv.date, pay).lines);
  $('#iPrev').innerHTML = entryTable(lines) + (pay ? `<p class="note">Deux écritures : la facture (journal ${inv.type==='vente'?'VTE':'ACH'}) puis le règlement (journal ${pay==='caisse'?'CAI':'BQ'}).</p>` : '');
}

let OD = null;
const TEMPLATES = {
  '': ['', []],
  capital: ['Apport en capital (banque)', [['5141','D'],['1111','C']]],
  emprunt: ['Emprunt bancaire reçu', [['5141','D'],['1481','C']]],
  salaires: ['Salaires du mois', [['6171','D'],['6174','D'],['4432','C'],['4441','C']]],
  virpaie: ['Virement des salaires', [['4432','D'],['5141','C']]],
  amort: ['Dotation aux amortissements', [['6193','D'],['2835','C']]],
  interets: ['Intérêts bancaires', [['6311','D'],['5141','C']]],
  frais: ['Frais bancaires', [['6147','D'],['5141','C']]],
  retrait: ['Retrait banque vers caisse', [['5161','D'],['5141','C']]],
  tva: ['Paiement de la TVA due', [['4456','D'],['5141','C']]],
  stock: ['Variation de stock de marchandises', [['3111','D'],['6114','C']]],
  is: ['Impôt sur les sociétés', [['6701','D'],['4453','C']]]
};
function openOD(){
  OD = { lines:[{account:'',debit:'',credit:''},{account:'',debit:'',credit:''}] };
  openModal('Nouvelle opération diverse', `<form id="odForm" novalidate>
    <div class="fgrid">
      <label class="f">Modèle<select id="oTpl">${Object.entries(TEMPLATES).map(([k,[l]])=>`<option value="${k}">${k?l:'Saisie libre'}</option>`).join('')}</select></label>
      <label class="f">Date<input type="date" id="oDate" value="${today()}"></label>
      <label class="f">Journal<select id="oJnl">${['OD','BQ','CAI'].map(j=>`<option value="${j}">${j} — ${JOURNALS[j]}</option>`).join('')}</select></label>
      <label class="f">N° de pièce<input id="oRef" placeholder="facultatif"></label>
    </div>
    <label class="f" style="margin-top:12px">Libellé<input id="oLabel" placeholder="ex. Salaires de janvier"></label>
    <div class="tw" style="margin-top:14px"><table class="lines"><thead><tr><th>Compte</th><th class="n">Débit</th><th class="n">Crédit</th><th></th></tr></thead><tbody id="oLines"></tbody></table></div>
    <div class="row" style="justify-content:space-between;margin-top:10px"><button type="button" class="btn sm" data-act="add-odl">Ajouter une ligne</button><div class="totals" id="oTot"></div></div>
    <p class="err" id="oErr"></p>
    <div class="row" style="justify-content:flex-end"><button type="button" class="btn" data-act="close">Annuler</button><button class="btn primary" type="submit" id="oSave">Enregistrer l'écriture</button></div>
  </form>`);
  drawODLines();
}
const accDisp = n => n ? `${n} — ${accLabel(S,n)}` : '';
const parseAcc = v => (String(v).match(/^\s*(\d+)/)||[])[1] || '';
function drawODLines(){
  $('#oLines').innerHTML = OD.lines.map((l,i)=>`<tr>
    <td style="min-width:240px"><input list="accList" data-o="${i}" data-k="account" value="${esc(accDisp(l.account))}" placeholder="Tapez un n° ou un intitulé"></td>
    <td style="min-width:120px"><input class="num" type="number" step="0.01" min="0" data-o="${i}" data-k="debit" value="${l.debit}"></td>
    <td style="min-width:120px"><input class="num" type="number" step="0.01" min="0" data-o="${i}" data-k="credit" value="${l.credit}"></td>
    <td>${OD.lines.length>2?`<button type="button" class="btn sm ghost" data-act="rm-odl" data-i="${i}" aria-label="Retirer la ligne">✕</button>`:''}</td></tr>`).join('');
  updOD();
}
function odErrors(){
  const d = r2(OD.lines.reduce((s,l)=>s+(+l.debit||0),0)), c = r2(OD.lines.reduce((s,l)=>s+(+l.credit||0),0));
  const used = OD.lines.filter(l => l.account || +l.debit || +l.credit);
  let e = '';
  if(used.some(l => !accExists(S, l.account))) e = 'Un compte est inconnu : choisissez-le dans la liste (ou ajoutez-le dans le Plan comptable).';
  else if(used.some(l => (+l.debit||0) && (+l.credit||0))) e = 'Une ligne ne peut pas avoir à la fois un débit et un crédit.';
  else if(!d) e = 'Saisissez au moins un montant.';
  else if(Math.abs(d-c) >= .01) e = `L'écriture n'est pas équilibrée : écart de ${fmt(d-c)} MAD.`;
  return { d, c, e };
}
function updOD(){
  const { d, c, e } = odErrors();
  $('#oTot').innerHTML = `<div><small>Total débit</small>${fmt(d)}</div><div><small>Total crédit</small>${fmt(c)}</div><div><small>Écart</small>${Math.abs(d-c)<.01?'<span class="chip ok">Équilibrée</span>':fmt(d-c)}</div>`;
  $('#oErr').textContent = d ? e : '';
}

function openPay(id){
  const inv = S.invoices.find(i => i.id === id); if(!inv) return;
  const t = invTotals(inv);
  openModal(`Régler la facture ${esc(inv.num)}`, `<form id="payForm" data-id="${id}">
    <p style="margin:0">${inv.type==='vente'?'Encaissement du client':'Paiement au fournisseur'} <b>${esc(inv.tiers)}</b> : <b class="code" style="font-size:14px;color:var(--ink)">${mad(t.ttc)}</b></p>
    <div class="fgrid" style="margin-top:12px"><label class="f">Date du règlement<input type="date" id="pDate" value="${today() < inv.date ? inv.date : today()}"></label>
    <label class="f">Mode<select id="pMode"><option value="banque">Banque (5141)</option><option value="caisse">Caisse (5161)</option></select></label></div>
    <div class="preview" style="margin-top:14px"><h3>Écriture générée</h3><div id="pPrev"></div></div>
    <div class="row" style="justify-content:flex-end;margin-top:14px"><button type="button" class="btn" data-act="close">Annuler</button><button class="btn primary" type="submit">Enregistrer le règlement</button></div></form>`);
  const upd = () => { $('#pPrev').innerHTML = entryTable(paymentEntry(S, inv, $('#pDate').value, $('#pMode').value).lines); };
  $('#pMode').addEventListener('change', upd); upd();
}

function openAcc(){
  openModal('Ajouter un compte', `<form id="accForm">
    <div class="fgrid"><label class="f">Numéro<input id="aNum" inputmode="numeric" placeholder="ex. 34211"></label>
    <label class="f" style="grid-column:span 2">Intitulé<input id="aLab" placeholder="ex. Client Hôtel Mogador"></label></div>
    <p class="note">Le numéro doit commencer par le chiffre de sa classe (1 à 7). Pour un sous-compte, partez du compte parent : 3421 → 34211, 34212…</p>
    <p class="err" id="aErr"></p>
    <div class="row" style="justify-content:flex-end"><button type="button" class="btn" data-act="close">Annuler</button><button class="btn primary" type="submit">Ajouter</button></div></form>`);
}

function openGL(acc){
  const rows = []; let s = 0;
  S.entries.slice().sort((a,b)=>a.date.localeCompare(b.date)).forEach(e => e.lines.forEach(l => {
    if(l.account !== acc) return; s = r2(s + l.debit - l.credit);
    rows.push(`<tr><td>${fdate(e.date)}</td><td><span class="chip j">${e.journal}</span></td><td>${esc(e.label)}</td><td class="n">${fz(l.debit)}</td><td class="n">${fz(l.credit)}</td><td class="n">${fmt(Math.abs(s))} ${s>0?'D':s<0?'C':''}</td></tr>`);
  }));
  openModal(`Grand livre · ${acc} ${esc(accLabel(S,acc))}`, rows.length ? `<div class="tw"><table><thead><tr><th>Date</th><th>Jnl</th><th>Libellé</th><th class="n">Débit</th><th class="n">Crédit</th><th class="n">Solde</th></tr></thead><tbody>${rows.join('')}</tbody></table></div>` : '<p class="empty">Aucun mouvement sur ce compte.</p>');
}

/* ---------- Événements ---------- */
function confirmBtn(btn, run){
  if(btn.classList.contains('confirming')){ run(); return; }
  const txt = btn.textContent; btn.classList.add('confirming'); btn.textContent = 'Confirmer ?';
  setTimeout(()=>{ if(btn.isConnected){ btn.classList.remove('confirming'); btn.textContent = txt; } }, 3500);
}
document.addEventListener('click', ev => {
  const t = ev.target.closest('[data-go],[data-act],[data-tab],[data-confirm],[data-gl]');
  if(!t){ if(ev.target.matches('[data-ov]')) closeModal(); return; }
  if(t.dataset.go){ ui.view = t.dataset.go; ui.q=''; ui.cls=''; render(); try{history.replaceState(null,'','#'+ui.view)}catch(e){} window.scrollTo(0,0); return; }
  if(t.dataset.tab){ ui.invTab = t.dataset.tab; render(); return; }
  if(t.dataset.gl && !t.dataset.act){ openGL(t.dataset.gl); return; }
  const c = t.dataset.confirm, id = t.dataset.id;
  if(c) return confirmBtn(t, () => {
    if(c==='del-inv'){ deleteInvoice(S,id); commit('Facture et écritures supprimées'); }
    if(c==='del-od'){ S.entries = S.entries.filter(e=>e.id!==id); commit('Écriture supprimée'); }
    if(c==='del-acc'){ S.accounts = S.accounts.filter(a=>a.n!==id); commit('Compte retiré'); }
    if(c==='reset-empty'){ const y=S.company.year; S = emptyState(); S.company.year = y; ui.from=ui.to=''; commit('Données effacées'); }
    if(c==='reset-demo'){ S = sampleState(); ui.from=ui.to=''; commit("Exemple rechargé"); }
  });
  switch(t.dataset.act){
    case 'close': closeModal(); break;
    case 'set-sector': S.company.sector = t.dataset.sec; commit('Secteur : ' + SECTORS[t.dataset.sec].label); break;
    case 'new-inv': openInvoice(t.dataset.type); break;
    case 'new-od': openOD(); break;
    case 'new-acc': openAcc(); break;
    case 'pay': openPay(id); break;
    case 'add-line': INV.lines.push({label:'',account:INV.lines.at(-1).account,ht:'',rate:20}); drawInvLines(); break;
    case 'rm-line': INV.lines.splice(+t.dataset.i,1); drawInvLines(); break;
    case 'add-odl': OD.lines.push({account:'',debit:'',credit:''}); drawODLines(); break;
    case 'rm-odl': OD.lines.splice(+t.dataset.i,1); drawODLines(); break;
    case 'start-own': S = emptyState(); ui.view='parametres'; ui.from=ui.to=''; commit('Nouvelle comptabilité créée : renseignez votre société'); break;
    case 'copy-json': {
      const txt = JSON.stringify(S);
      navigator.clipboard.writeText(txt).then(()=>toast('Sauvegarde copiée')).catch(()=>{ const ta=$('#impTxt'); ta.value=txt; ta.select(); toast('Copiez le texte sélectionné'); });
      break; }
    case 'imp-txt': restore($('#impTxt').value); break;
  }
});
function restore(txt){
  try{ const o = JSON.parse(txt); if(!o || !Array.isArray(o.entries) || !o.company) throw 0; S = Object.assign(emptyState(), o); ui.from=ui.to=''; commit('Données restaurées'); }
  catch(e){ toast('Sauvegarde invalide'); }
}
document.addEventListener('input', ev => {
  const t = ev.target;
  if(t.dataset.l !== undefined){ INV.lines[+t.dataset.l][t.dataset.k] = t.value; updInv(); return; }
  if(t.dataset.o !== undefined){ const L = OD.lines[+t.dataset.o]; L[t.dataset.k] = t.dataset.k==='account' ? parseAcc(t.value) : t.value; updOD(); return; }
  if(t.id==='iDate' || t.id==='iTiers' || t.id==='iNum'){ updInv(); return; }
  if(t.id==='jq'){ ui.q = t.value; const pos = t.selectionStart; render(); const n=$('#jq'); n.focus(); n.setSelectionRange(pos,pos); }
});
document.addEventListener('change', ev => {
  const t = ev.target;
  if(t.id==='iPay'){ updInv(); return; }
  if(t.dataset.l !== undefined){ INV.lines[+t.dataset.l][t.dataset.k] = t.value; updInv(); return; }
  if(t.dataset.o !== undefined && t.dataset.k==='account'){ const n = parseAcc(t.value); if(accExists(S,n)) t.value = accDisp(n); return; }
  if(t.id==='jf'){ ui.jf = t.value; render(); }
  if(t.id==='cls'){ ui.cls = t.value; render(); }
  if(t.id==='pFrom'){ ui.from = t.value; render(); }
  if(t.id==='pTo'){ ui.to = t.value; render(); }
  if(t.id==='oTpl'){ const [lab, ls] = TEMPLATES[t.value]; if(!ls.length) return;
    OD.lines = ls.map(([a])=>({account:a,debit:'',credit:''})); $('#oLabel').value = lab;
    if(['capital','emprunt','virpaie','interets','frais','tva'].includes(t.value)) $('#oJnl').value='BQ';
    else if(t.value==='retrait') $('#oJnl').value='CAI'; else $('#oJnl').value='OD';
    drawODLines(); }
  if(t.id==='impFile' && t.files[0]){ const r = new FileReader(); r.onload = () => restore(r.result); r.readAsText(t.files[0]); }
});
function showTip(ev){
  const t = ev.target.closest && ev.target.closest('[data-tip]'), tip = $('#tip');
  if(!t){ tip.hidden = true; return; }
  tip.innerHTML = t.dataset.tip; tip.hidden = false;
  const w = tip.offsetWidth, h = tip.offsetHeight;
  let x = ev.clientX + 14, y = ev.clientY - h - 10;
  if(x + w > innerWidth - 8) x = ev.clientX - w - 14;
  if(y < 8) y = ev.clientY + 16;
  tip.style.left = Math.max(8,x) + 'px'; tip.style.top = y + 'px';
}
document.addEventListener('pointermove', showTip);
document.addEventListener('pointerdown', showTip);
document.addEventListener('scroll', () => { $('#tip').hidden = true; }, true);
document.addEventListener('keydown', ev => { if(ev.key==='Escape' && $('#modal').innerHTML) closeModal(); });
document.addEventListener('submit', ev => {
  ev.preventDefault(); const f = ev.target;
  if(f.id==='invForm'){
    const inv = invFromForm(), t = invTotals(inv);
    let e = '';
    if(!inv.date) e = 'Indiquez la date.'; else if(!inv.num) e = 'Indiquez le numéro de facture.';
    else if(!$('#iTiers').value.trim()) e = `Indiquez le ${inv.type==='vente'?'client':'fournisseur'}.`;
    else if(!t.ht) e = 'Saisissez au moins un montant HT.';
    else if(S.invoices.some(i=>i.type===inv.type && i.num===inv.num)) e = 'Ce numéro de facture existe déjà.';
    if(e){ $('#iErr').textContent = e; return; }
    inv.lines = inv.lines.filter(l => l.ht);
    addInvoice(S, inv, $('#iPay').value || null);
    closeModal(); commit('Facture enregistrée et comptabilisée');
  }
  if(f.id==='odForm'){
    const { e } = odErrors(); if(e){ $('#oErr').textContent = e; return; }
    const label = $('#oLabel').value.trim(); if(!label){ $('#oErr').textContent = 'Indiquez un libellé.'; return; }
    addOD(S, { date: $('#oDate').value || today(), journal: $('#oJnl').value, ref: $('#oRef').value.trim(), label,
      lines: OD.lines.filter(l => l.account && ((+l.debit||0) || (+l.credit||0))) });
    closeModal(); commit('Écriture enregistrée');
  }
  if(f.id==='payForm'){ payInvoice(S, f.dataset.id, $('#pDate').value || today(), $('#pMode').value); closeModal(); commit('Règlement comptabilisé'); }
  if(f.id==='accForm'){
    const n = $('#aNum').value.trim(), l = $('#aLab').value.trim();
    let e = '';
    if(!/^[1-7]\d{3,7}$/.test(n)) e = 'Le numéro doit compter 4 à 8 chiffres et commencer par 1 à 7.';
    else if(accExists(S,n)) e = 'Ce compte existe déjà.'; else if(!l) e = "Indiquez l'intitulé.";
    if(e){ $('#aErr').textContent = e; return; }
    S.accounts.push({ n, t: l }); closeModal(); commit('Compte ajouté');
  }
  if(f.id==='coForm'){
    S.company.name = $('#coName').value.trim(); S.company.ice = $('#coIce').value.trim();
    const y = parseInt($('#coYear').value,10); if(y>=2000 && y<=2100) S.company.year = y;
    ui.from = ui.to = ''; commit('Paramètres enregistrés');
  }
});

fillAccList();
render();
