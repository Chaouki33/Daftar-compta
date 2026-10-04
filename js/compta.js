/* ===== Daftar — logique comptable (PCM marocain) ===== */
const PCM_RAW = `1111|Capital social
1117|Capital individuel
1119|Actionnaires, capital souscrit non appelé
1140|Réserve légale
1151|Réserves statutaires ou contractuelles
1152|Réserves facultatives
1161|Report à nouveau (solde créditeur)
1169|Report à nouveau (solde débiteur)
1181|Résultats nets en instance d'affectation (solde créditeur)
1191|Résultat net de l'exercice (solde créditeur)
1199|Résultat net de l'exercice (solde débiteur)
1311|Subventions d'équipement reçues
1481|Emprunts auprès des établissements de crédit
1482|Avances de l'État
1486|Fournisseurs d'immobilisations
1488|Dettes de financement diverses
1511|Provisions pour litiges
1518|Autres provisions pour risques
2111|Frais de constitution
2112|Frais préalables au démarrage
2113|Frais d'augmentation du capital
2210|Immobilisations en recherche et développement
2220|Brevets, marques, droits et valeurs similaires
2230|Fonds commercial
2311|Terrains nus
2321|Bâtiments
2327|Agencements et aménagements des constructions
2332|Matériel et outillage
2340|Matériel de transport
2351|Mobilier de bureau
2352|Matériel de bureau
2355|Matériel informatique
2356|Agencements, installations et aménagements divers
2410|Prêts immobilisés
2486|Dépôts et cautionnements versés
2510|Titres de participation
2811|Amortissements des frais préliminaires
2822|Amortissements des brevets, marques et droits
2832|Amortissements des constructions
2833|Amortissements des installations techniques, matériel et outillage
2834|Amortissements du matériel de transport
2835|Amortissements du mobilier, matériel de bureau et aménagements divers
3111|Marchandises
3121|Matières premières
3122|Matières et fournitures consommables
3131|Biens en cours
3151|Produits finis
3411|Fournisseurs – avances et acomptes versés
3421|Clients
3424|Clients douteux ou litigieux
3425|Clients – effets à recevoir
3431|Avances et acomptes au personnel
3453|Acomptes sur impôts sur les résultats
34551|État – TVA récupérable sur immobilisations
34552|État – TVA récupérable sur charges
3456|État – crédit de TVA
3463|Comptes courants des associés débiteurs
3481|Créances sur cessions d'immobilisations
3491|Charges constatées d'avance
3500|Titres et valeurs de placement
3942|Provisions pour dépréciation des clients
4411|Fournisseurs
4415|Fournisseurs – effets à payer
4421|Clients – avances et acomptes reçus
4432|Rémunérations dues au personnel
4441|Caisse nationale de sécurité sociale (CNSS)
4443|Caisses de retraite
4452|État – impôts, taxes et assimilés
4453|État – impôts sur les résultats
4455|État – TVA facturée
4456|État – TVA due (suivant déclarations)
4457|État – impôts et taxes à payer
4463|Comptes courants des associés créditeurs
4465|Associés – dividendes à payer
4481|Dettes sur acquisitions d'immobilisations
4491|Produits constatés d'avance
4501|Provisions pour litiges (court terme)
5111|Chèques à encaisser
5141|Banques (soldes débiteurs)
5146|Chèques postaux
5161|Caisse
5530|Crédits de trésorerie
5541|Banques (soldes créditeurs)
6111|Achats de marchandises
6114|Variation de stocks de marchandises
6119|Rabais, remises et ristournes obtenus sur achats de marchandises
6121|Achats de matières premières
6122|Achats de matières et fournitures consommables
6123|Achats d'emballages
6124|Variation des stocks de matières et fournitures
6125|Achats non stockés de matières et fournitures
6126|Achats de travaux, études et prestations de service
6131|Locations et charges locatives
6132|Redevances de crédit-bail
6133|Entretien et réparations
6134|Primes d'assurances
6135|Rémunérations du personnel extérieur à l'entreprise
6136|Rémunérations d'intermédiaires et honoraires
6141|Études, recherches et documentation
6142|Transports
6143|Déplacements, missions et réceptions
6144|Publicité, publications et relations publiques
6145|Frais postaux et frais de télécommunications
6147|Services bancaires
6148|Cotisations et dons
6161|Impôts et taxes directs
6165|Impôts et taxes indirects
6167|Impôts, taxes et droits assimilés
6171|Rémunérations du personnel
6174|Charges sociales
6176|Charges sociales diverses
6182|Pertes sur créances irrécouvrables
6191|Dotations d'exploitation aux amortissements de l'immobilisation en non-valeurs
6192|Dotations d'exploitation aux amortissements des immobilisations incorporelles
6193|Dotations d'exploitation aux amortissements des immobilisations corporelles
6196|Dotations d'exploitation aux provisions pour dépréciation de l'actif circulant
6311|Intérêts des emprunts et dettes
6331|Pertes de change
6386|Escomptes accordés
6513|Valeurs nettes d'amortissements des immobilisations corporelles cédées
6583|Pénalités et amendes fiscales et pénales
6586|Dons, libéralités et lots
6588|Autres charges non courantes
6701|Impôts sur les bénéfices
7111|Ventes de marchandises au Maroc
7113|Ventes de marchandises à l'étranger
7119|Rabais, remises et ristournes accordés
7121|Ventes de biens produits au Maroc
7124|Ventes de services produits au Maroc
7127|Ventes et produits accessoires
7129|Rabais, remises et ristournes accordés (biens et services)
7131|Variation des stocks de produits en cours
7132|Variation des stocks de biens produits
7140|Immobilisations produites par l'entreprise pour elle-même
7161|Subventions d'exploitation reçues
7180|Autres produits d'exploitation
7196|Reprises sur provisions pour dépréciation de l'actif circulant
7197|Transferts de charges d'exploitation
7321|Revenus des titres de participation
7331|Gains de change
7381|Intérêts et produits assimilés
7386|Escomptes obtenus
7513|Produits des cessions des immobilisations corporelles
7577|Reprises sur subventions d'investissement
7588|Autres produits non courants`;

const PCM = PCM_RAW.split('\n').map(l => { const [n, t] = l.split('|'); return { n, t }; });
const CLASSES = {
  1: 'Comptes de financement permanent',
  2: "Comptes d'actif immobilisé",
  3: "Comptes d'actif circulant (hors trésorerie)",
  4: 'Comptes de passif circulant (hors trésorerie)',
  5: 'Comptes de trésorerie',
  6: 'Comptes de charges',
  7: 'Comptes de produits'
};
const JOURNALS = { VTE: 'Ventes', ACH: 'Achats', BQ: 'Banque', CAI: 'Caisse', OD: 'Opérations diverses' };
const TVA_RATES = [20, 14, 10, 7, 0];

const r2 = x => Math.round((x + Number.EPSILON) * 100) / 100;
const uid = () => Math.random().toString(36).slice(2, 10);

function emptyState() {
  const y = new Date().getFullYear();
  return { v: 1, demo: false, company: { name: '', ice: '', year: y, sector: '' }, accounts: [], invoices: [], entries: [] };
}

function allAccounts(S) {
  return PCM.concat(S.accounts).slice().sort((a, b) => a.n.localeCompare(b.n));
}
function accExists(S, n) { return PCM.some(a => a.n === n) || S.accounts.some(a => a.n === n); }
function accLabel(S, n) {
  const a = PCM.find(x => x.n === n) || S.accounts.find(x => x.n === n);
  return a ? a.t : 'Compte ' + n;
}
const isImmo = n => /^2[123]/.test(n);

/* --- Factures --- */
function invTotals(inv) {
  const t = { ht: 0, tva: 0, ttc: 0, htImmo: 0, tvaImmo: 0, htCh: 0, tvaCh: 0 };
  inv.lines.forEach(l => {
    const ht = r2(+l.ht || 0), tva = r2(ht * (+l.rate || 0) / 100);
    t.ht += ht; t.tva += tva;
    if (inv.type === 'achat' && isImmo(l.account)) { t.htImmo += ht; t.tvaImmo += tva; }
    else { t.htCh += ht; t.tvaCh += tva; }
  });
  for (const k in t) t[k] = r2(t[k]);
  t.ttc = r2(t.ht + t.tva);
  return t;
}

function invoiceEntry(S, inv) {
  const t = invTotals(inv), lines = [], byAcc = {};
  inv.lines.forEach(l => { if (+l.ht) byAcc[l.account] = r2((byAcc[l.account] || 0) + (+l.ht)); });
  if (inv.type === 'vente') {
    lines.push({ account: '3421', label: 'Client ' + inv.tiers, debit: t.ttc, credit: 0 });
    for (const a in byAcc) lines.push({ account: a, label: accLabel(S, a), debit: 0, credit: byAcc[a] });
    if (t.tva) lines.push({ account: '4455', label: 'TVA facturée', debit: 0, credit: t.tva });
  } else {
    for (const a in byAcc) lines.push({ account: a, label: accLabel(S, a), debit: byAcc[a], credit: 0 });
    if (t.tvaImmo) lines.push({ account: '34551', label: 'TVA récupérable sur immobilisations', debit: t.tvaImmo, credit: 0 });
    if (t.tvaCh) lines.push({ account: '34552', label: 'TVA récupérable sur charges', debit: t.tvaCh, credit: 0 });
    const ttcCh = r2(t.htCh + t.tvaCh), ttcIm = r2(t.htImmo + t.tvaImmo);
    if (ttcCh) lines.push({ account: '4411', label: 'Fournisseur ' + inv.tiers, debit: 0, credit: ttcCh });
    if (ttcIm) lines.push({ account: '4481', label: "Fournisseur d'immobilisation " + inv.tiers, debit: 0, credit: ttcIm });
  }
  return {
    date: inv.date, journal: inv.type === 'vente' ? 'VTE' : 'ACH', ref: inv.num,
    label: (inv.type === 'vente' ? 'Facture client ' : 'Facture fournisseur ') + inv.num + ' – ' + inv.tiers,
    lines, src: { kind: 'inv', id: inv.id }
  };
}

function paymentEntry(S, inv, date, mode) {
  const t = invTotals(inv), treso = mode === 'caisse' ? '5161' : '5141', lines = [];
  if (inv.type === 'vente') {
    lines.push({ account: treso, label: accLabel(S, treso), debit: t.ttc, credit: 0 });
    lines.push({ account: '3421', label: 'Client ' + inv.tiers, debit: 0, credit: t.ttc });
  } else {
    const ttcCh = r2(t.htCh + t.tvaCh), ttcIm = r2(t.htImmo + t.tvaImmo);
    if (ttcCh) lines.push({ account: '4411', label: 'Fournisseur ' + inv.tiers, debit: ttcCh, credit: 0 });
    if (ttcIm) lines.push({ account: '4481', label: "Fournisseur d'immobilisation " + inv.tiers, debit: ttcIm, credit: 0 });
    lines.push({ account: treso, label: accLabel(S, treso), debit: 0, credit: t.ttc });
  }
  return {
    date, journal: mode === 'caisse' ? 'CAI' : 'BQ', ref: inv.num,
    label: (inv.type === 'vente' ? 'Encaissement ' : 'Règlement ') + inv.num + ' – ' + inv.tiers,
    lines, src: { kind: 'pay', id: inv.id }
  };
}

function addInvoice(S, inv, payNow) {
  inv.id = inv.id || uid();
  inv.paid = null;
  S.invoices.push(inv);
  S.entries.push(Object.assign({ id: uid() }, invoiceEntry(S, inv)));
  if (payNow) payInvoice(S, inv.id, inv.date, payNow);
  return inv;
}
function payInvoice(S, id, date, mode) {
  const inv = S.invoices.find(i => i.id === id);
  if (!inv || inv.paid) return;
  inv.paid = { date, mode };
  S.entries.push(Object.assign({ id: uid() }, paymentEntry(S, inv, date, mode)));
}
function deleteInvoice(S, id) {
  S.invoices = S.invoices.filter(i => i.id !== id);
  S.entries = S.entries.filter(e => !(e.src && e.src.id === id));
}
function addOD(S, e) {
  e.id = uid(); e.src = { kind: 'od' };
  e.lines = e.lines.map(l => ({ account: l.account, label: l.label || accLabel(S, l.account), debit: r2(+l.debit || 0), credit: r2(+l.credit || 0) }));
  S.entries.push(e);
  return e;
}

/* --- Calculs --- */
const inPeriod = (d, from, to) => (!from || d >= from) && (!to || d <= to);
function balances(S, from, to) {
  const m = {};
  S.entries.forEach(e => {
    if (!inPeriod(e.date, from, to)) return;
    e.lines.forEach(l => {
      const b = m[l.account] || (m[l.account] = { d: 0, c: 0 });
      b.d = r2(b.d + l.debit); b.c = r2(b.c + l.credit);
    });
  });
  return m;
}
/* Somme (débit − crédit) des comptes commençant par un des préfixes, hors exclusions */
function sp(m, pfx, excl = []) {
  let s = 0;
  for (const a in m) {
    if (pfx.some(p => a.startsWith(p)) && !excl.some(p => a.startsWith(p))) s += m[a].d - m[a].c;
  }
  return r2(s);
}

function cpc(m) {
  const P = (p, e) => -sp(m, p, e), C = (p, e) => sp(m, p, e);
  const pe = [
    ["Ventes de marchandises (en l'état)", P(['711'])],
    ['Ventes de biens et services produits', P(['712'])],
    ['Variation de stocks de produits (±)', P(['713'])],
    ["Immobilisations produites par l'entreprise pour elle-même", P(['714'])],
    ["Subventions d'exploitation", P(['716'])],
    ["Autres produits d'exploitation", P(['71'], ['711', '712', '713', '714', '716', '719'])],
    ["Reprises d'exploitation ; transferts de charges", P(['719'])]
  ];
  const ce = [
    ['Achats revendus de marchandises', C(['611'])],
    ['Achats consommés de matières et fournitures', C(['612'])],
    ['Autres charges externes', C(['613', '614'])],
    ['Impôts et taxes', C(['616'])],
    ['Charges de personnel', C(['617'])],
    ["Autres charges d'exploitation", C(['61'], ['611', '612', '613', '614', '616', '617', '619'])],
    ["Dotations d'exploitation", C(['619'])]
  ];
  const pf = [['Produits financiers', P(['73'])]];
  const cf = [['Charges financières', C(['63'])]];
  const pnc = [['Produits non courants', P(['75'])]];
  const cnc = [['Charges non courantes', C(['65'])]];
  const is = C(['67']);
  const sum = a => r2(a.reduce((s, x) => s + x[1], 0));
  const r = {};
  r.pe = pe; r.ce = ce; r.pf = pf; r.cf = cf; r.pnc = pnc; r.cnc = cnc;
  r.I = sum(pe); r.II = sum(ce); r.III = r2(r.I - r.II);
  r.IV = sum(pf); r.V = sum(cf); r.VI = r2(r.IV - r.V);
  r.VII = r2(r.III + r.VI);
  r.VIII = sum(pnc); r.IX = sum(cnc); r.X = r2(r.VIII - r.IX);
  r.XI = r2(r.VII + r.X); r.XII = is; r.XIII = r2(r.XI - r.XII);
  r.ca = r2(pe[0][1] + pe[1][1]);
  // contrôle : toutes classes 6 et 7 couvertes
  r.check = r2(-sp(m, ['7']) - sp(m, ['6']));
  return r;
}

function bilan(m) {
  const res = cpc(m).XIII;
  const row = (t, b, a) => ({ t, brut: r2(b), amort: r2(a), net: r2(b - a) });
  let tresoA = 0, tresoP = 0;
  for (const a in m) if (a[0] === '5') { const s = r2(m[a].d - m[a].c); if (s > 0) tresoA += s; else tresoP -= s; }
  const actif = {
    immo: [
      row('Immobilisations en non-valeurs', sp(m, ['21']), -sp(m, ['281'])),
      row('Immobilisations incorporelles', sp(m, ['22']), -sp(m, ['282'])),
      row('Immobilisations corporelles', sp(m, ['23']), -sp(m, ['283'])),
      row('Immobilisations financières', sp(m, ['2'], ['21', '22', '23', '28', '29']), -sp(m, ['29']))
    ],
    circ: [
      row('Stocks', sp(m, ['31']), -sp(m, ['391'])),
      row("Créances de l'actif circulant", sp(m, ['3'], ['31', '35', '39']), -sp(m, ['39'], ['391', '395'])),
      row('Titres et valeurs de placement', sp(m, ['35']), -sp(m, ['395']))
    ],
    treso: [row('Trésorerie – actif', tresoA, 0)]
  };
  const P = (p, e) => -sp(m, p, e);
  const passif = {
    cp: [
      ['Capital social ou personnel', P(['111'])],
      ['Réserves', P(['114', '115'])],
      ['Report à nouveau', P(['116'])],
      ["Résultats nets en instance d'affectation", P(['118'])],
      ["Résultat net de l'exercice", r2(P(['119']) + res)],
      ['Autres capitaux propres', P(['11'], ['111', '114', '115', '116', '118', '119'])]
    ],
    fin: [
      ['Capitaux propres assimilés', P(['13'])],
      ['Dettes de financement', P(['14'])],
      ['Provisions durables pour risques et charges', P(['15'])],
      ['Autres financements permanents', P(['1'], ['11', '13', '14', '15'])]
    ],
    circ: [
      ['Dettes du passif circulant', P(['4'], ['45'])],
      ['Autres provisions pour risques et charges', P(['45'])]
    ],
    treso: [['Trésorerie – passif', r2(tresoP)]]
  };
  const sN = a => r2(a.reduce((s, x) => s + x.net, 0));
  const sV = a => r2(a.reduce((s, x) => s + x[1], 0));
  const tot = {
    immo: sN(actif.immo), circ: sN(actif.circ), tresoA: sN(actif.treso),
    cp: sV(passif.cp), fin: sV(passif.fin), circP: sV(passif.circ), tresoP: sV(passif.treso)
  };
  tot.actif = r2(tot.immo + tot.circ + tot.tresoA);
  tot.passif = r2(tot.cp + tot.fin + tot.circP + tot.tresoP);
  return { actif, passif, tot, res };
}

/* --- Données d'exemple --- */
function sampleState() {
  const S = emptyState();
  const y = 2026;
  S.demo = true;
  S.company = { name: 'Atlas Distribution SARL', ice: '', year: y, sector: 'commerce' };
  const d = (mm, dd) => `${y}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
  const L = (account, label, debit, credit) => ({ account, label, debit, credit });
  const inv = (type, num, date, tiers, lines) => ({ type, num, date, tiers, lines });
  const ln = (label, account, ht, rate = 20) => ({ label, account, ht, rate });

  addOD(S, { date: d(1, 2), journal: 'BQ', ref: 'STAT', label: 'Apport en capital des associés', lines: [L('5141', '', 100000, 0), L('1111', '', 0, 100000)] });
  addOD(S, { date: d(1, 3), journal: 'BQ', ref: 'EMP-01', label: 'Déblocage emprunt bancaire', lines: [L('5141', '', 50000, 0), L('1481', '', 0, 50000)] });
  addInvoice(S, inv('achat', 'FA-2026-001', d(1, 5), 'InfoTech Casablanca', [ln('Ordinateurs et imprimante', '2355', 15000)]));
  addInvoice(S, inv('achat', 'FA-2026-002', d(1, 10), 'Sud Import', [ln('Lot de marchandises', '6111', 40000)]));
  addInvoice(S, inv('vente', 'FV-2026-001', d(1, 15), 'Hôtel Mogador', [ln('Vente de marchandises', '7111', 30000)]));
  addInvoice(S, inv('achat', 'FA-2026-003', d(1, 20), 'Immobilière Anfa', [ln('Loyer janvier', '6131', 5000)]), 'banque');
  addInvoice(S, inv('achat', 'FA-2026-004', d(1, 25), 'Opérateur télécom', [ln('Abonnement internet et téléphone', '6145', 800)]), 'banque');
  addOD(S, { date: d(1, 31), journal: 'OD', ref: 'PAIE-01', label: 'Salaires de janvier', lines: [L('6171', '', 12000, 0), L('6174', '', 2500, 0), L('4432', '', 0, 12000), L('4441', '', 0, 2500)] });
  addOD(S, { date: d(2, 2), journal: 'BQ', ref: 'VIR-PAIE', label: 'Virement des salaires de janvier', lines: [L('4432', '', 12000, 0), L('5141', '', 0, 12000)] });
  addOD(S, { date: d(2, 5), journal: 'CAI', ref: 'RET-01', label: 'Retrait banque pour alimenter la caisse', lines: [L('5161', '', 3000, 0), L('5141', '', 0, 3000)] });
  addInvoice(S, inv('vente', 'FV-2026-002', d(2, 12), 'Groupe Souss Hôtels', [ln('Vente de marchandises', '7111', 45000)]), 'banque');
  payInvoice(S, S.invoices.find(i => i.num === 'FV-2026-001').id, d(2, 15), 'banque');
  payInvoice(S, S.invoices.find(i => i.num === 'FA-2026-002').id, d(2, 20), 'banque');
  addInvoice(S, inv('achat', 'FA-2026-005', d(2, 22), 'Sud Import', [ln('Lot de marchandises', '6111', 20000)]));
  addInvoice(S, inv('vente', 'FV-2026-003', d(2, 26), 'Riad Essaouira', [ln('Vente de marchandises', '7111', 25000), ln('Livraison et installation', '7124', 2000)]));
  addInvoice(S, inv('achat', 'FA-2026-006', d(3, 4), 'Papeterie Agdal', [ln('Fournitures de bureau', '6125', 1500)]), 'caisse');
  addInvoice(S, inv('vente', 'FV-2026-004', d(3, 18), 'Café Atlas', [ln('Vente de marchandises', '7111', 28000)]));
  [2, 3].forEach(mm => {
    const M = ['', '', 'février', 'mars'][mm];
    addInvoice(S, inv('achat', `FA-2026-L${mm}`, d(mm, 3), 'Immobilière Anfa', [ln('Loyer ' + M, '6131', 5000)]), 'banque');
    addInvoice(S, inv('achat', `FA-2026-T${mm}`, d(mm, 25), 'Opérateur télécom', [ln('Abonnement internet et téléphone', '6145', 800)]), 'banque');
    addOD(S, { date: d(mm, 28), journal: 'OD', ref: 'PAIE-0' + mm, label: 'Salaires de ' + M, lines: [L('6171', '', 12000, 0), L('6174', '', 2500, 0), L('4432', '', 0, 12000), L('4441', '', 0, 2500)] });
  });
  addOD(S, { date: d(3, 2), journal: 'BQ', ref: 'VIR-PAIE2', label: 'Virement des salaires de février', lines: [L('4432', '', 12000, 0), L('5141', '', 0, 12000)] });
  addOD(S, { date: d(3, 31), journal: 'BQ', ref: 'ECH-01', label: "Intérêts de l'emprunt (T1)", lines: [L('6311', '', 450, 0), L('5141', '', 0, 450)] });
  addOD(S, { date: d(3, 31), journal: 'OD', ref: 'AMORT-T1', label: 'Dotation aux amortissements du matériel informatique (T1)', lines: [L('6193', '', 750, 0), L('2835', '', 0, 750)] });
  return S;
}


/* --- Secteurs d'activité et indicateurs --- */
const SECTORS = {
  commerce:   { label: 'Commerce / distribution', desc: "Achat et revente de marchandises en l'état", vente: '7111', achat: '6111' },
  production: { label: 'Industrie / production', desc: 'Transformation de matières en produits finis', vente: '7121', achat: '6121' },
  services:   { label: 'Services / conseil', desc: 'Prestations intellectuelles, techniques ou commerciales', vente: '7124', achat: '6126' },
  hotellerie: { label: 'Hôtellerie / restauration', desc: 'Hébergement, restauration, cafés', vente: '7124', achat: '6122' },
  agricole:   { label: 'Agriculture / élevage', desc: 'Cultures, élevage, exploitation agricole', vente: '7121', achat: '6122' },
  btp:        { label: 'BTP / construction', desc: 'Travaux, chantiers, génie civil', vente: '7124', achat: '6121' }
};
/* Repères indicatifs : good = seuil « bon », warn = seuil « à surveiller » ; dir 'min' (plus haut = mieux) ou 'max' */
const KPI_DEFS = {
  tauxMarque: { label: 'Taux de marque', f: i => i.ventesM ? i.marge / i.ventesM : null, dir: 'min',
    help: 'Marge commerciale ÷ ventes de marchandises',
    act: 'Renégocier les prix d’achat avec les fournisseurs, revoir la politique de remises et mettre en avant les produits les plus margés.' },
  txVA: { label: 'Taux de valeur ajoutée', f: i => i.ca ? i.va / i.ca : null, dir: 'min',
    help: 'Valeur ajoutée ÷ chiffre d’affaires',
    act: 'Réduire les consommations externes (sous-traitance, énergie, services) et augmenter la part de travail réalisé en interne.' },
  txEBE: { label: 'Taux d’EBE', f: i => i.ca ? i.ebe / i.ca : null, dir: 'min',
    help: 'Excédent brut d’exploitation ÷ chiffre d’affaires',
    act: 'Agir sur les deux leviers de l’exploitation : prix de vente et charges fixes (loyer, personnel, frais généraux).' },
  txRN: { label: 'Rentabilité nette', f: i => i.ca ? i.rn / i.ca : null, dir: 'min',
    help: 'Résultat net ÷ chiffre d’affaires',
    act: 'Identifier les charges non indispensables et vérifier que chaque activité couvre ses coûts complets.' },
  txPerso: { label: 'Poids de la masse salariale', f: i => i.ca ? i.perso / i.ca : null, dir: 'max',
    help: 'Charges de personnel ÷ chiffre d’affaires',
    act: 'Mesurer la productivité par salarié, ajuster les plannings à l’activité réelle et éviter les heures non facturées.' },
  txMatiere: { label: 'Coût matières', f: i => i.ca ? (i.achatsM + i.matieres) / i.ca : null, dir: 'max',
    help: '(Achats revendus + achats consommés) ÷ chiffre d’affaires',
    act: 'Standardiser les quantités (fiches techniques), lutter contre le gaspillage et mettre les fournisseurs en concurrence.' },
  dso: { label: 'Délai de paiement clients', f: i => i.dso, dir: 'max', unit: 'j',
    help: 'Créances clients ÷ ventes TTC × nombre de jours',
    act: 'Relancer les factures échues, demander des acomptes et appliquer les pénalités de retard prévues par la loi 69-21.' }
};
const SECTOR_KPIS = {
  commerce:   [['tauxMarque', .25, .15], ['txRN', .05, 0], ['txPerso', .15, .25], ['dso', 60, 120]],
  production: [['txVA', .30, .20], ['txMatiere', .50, .65], ['txEBE', .12, .05], ['dso', 60, 120]],
  services:   [['txPerso', .45, .60], ['txVA', .50, .35], ['txEBE', .15, .07], ['dso', 60, 120]],
  hotellerie: [['txMatiere', .30, .38], ['txPerso', .35, .45], ['txEBE', .25, .12], ['dso', 60, 120]],
  agricole:   [['txMatiere', .40, .55], ['txEBE', .20, .10], ['txRN', .08, .03], ['dso', 60, 120]],
  btp:        [['txMatiere', .55, .70], ['txPerso', .35, .45], ['txRN', .05, .02], ['dso', 60, 120]]
};

function indicators(S, from, to) {
  const m = balances(S, from, to), r = cpc(m);
  const P = p => -sp(m, p), C = p => sp(m, p);
  const i = { cpc: r };
  i.ventesM = P(['711']); i.achatsM = C(['611']); i.marge = r2(i.ventesM - i.achatsM);
  i.production = P(['712', '713', '714']); i.matieres = C(['612']);
  i.conso = C(['612', '613', '614']);
  i.va = r2(i.marge + i.production - i.conso);
  i.perso = C(['617']); i.impots = C(['616']);
  i.ebe = r2(i.va + P(['716']) - i.impots - i.perso);
  i.rex = r.III; i.rn = r.XIII; i.ca = r.ca;
  i.treso = sp(m, ['5']);
  i.clients = sp(m, ['342']); i.fourn = -sp(m, ['441', '4481']);
  i.tva = r2(-sp(m, ['4455']) - sp(m, ['3455']));
  // jours écoulés dans la période (jusqu'à la dernière écriture)
  const dates = S.entries.map(e => e.date).filter(d => inPeriod(d, from, to)).sort();
  const last = dates.length ? dates[dates.length - 1] : to;
  i.days = Math.max(1, Math.round((new Date(last) - new Date(from)) / 864e5) + 1);
  const ventesTTC = S.invoices.filter(v => v.type === 'vente' && inPeriod(v.date, from, to)).reduce((s, v) => s + invTotals(v).ttc, 0);
  i.dso = ventesTTC ? Math.round(i.clients / ventesTTC * i.days) : null;
  return i;
}

function monthly(S, year) {
  const months = [];
  let lastM = 0;
  S.entries.forEach(e => { if (e.date.startsWith(year + '-')) lastM = Math.max(lastM, +e.date.slice(5, 7)); });
  for (let k = 1; k <= Math.max(lastM, 1); k++) months.push({ m: k, ca: 0, ch: 0, pr: 0, treso: 0 });
  let treso = 0;
  const sorted = S.entries.slice().sort((a, b) => a.date.localeCompare(b.date));
  sorted.forEach(e => {
    const y = +e.date.slice(0, 4), mo = +e.date.slice(5, 7);
    e.lines.forEach(l => {
      const s = l.debit - l.credit;
      if (l.account[0] === '5' && (y < year || (y === year))) {
        if (y < year) treso += s; else months[mo - 1] && (months[mo - 1].dt = (months[mo - 1].dt || 0) + s);
      }
      if (y !== year || !months[mo - 1]) return;
      const M = months[mo - 1];
      if (/^71[12]/.test(l.account)) M.ca -= s;
      if (l.account[0] === '6') M.ch += s;
      if (l.account[0] === '7') M.pr -= s;
    });
  });
  months.forEach(M => { treso += M.dt || 0; M.treso = r2(treso); M.ca = r2(M.ca); M.ch = r2(M.ch); M.res = r2(M.pr - M.ch); delete M.dt; });
  return months;
}

function kpiStatus(v, good, warn, dir) {
  if (v === null || v === undefined || !isFinite(v)) return 'na';
  if (dir === 'min') return v >= good ? 'good' : v >= warn ? 'warn' : 'bad';
  return v <= good ? 'good' : v <= warn ? 'warn' : 'bad';
}

const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

function analysis(S, i, months) {
  const out = [], sec = S.company.sector;
  const pct = x => (Math.round(x * 1000) / 10).toLocaleString('fr-FR') + ' %';
  const num = x => Math.round(x).toLocaleString('fr-FR');
  if (!i.ca) { out.push({ s: 'na', t: 'Pas encore de chiffre d’affaires', d: 'Saisissez vos premières factures de vente pour obtenir une analyse.' }); return out; }
  (SECTOR_KPIS[sec] || []).forEach(([k, good, warn]) => {
    const def = KPI_DEFS[k], v = def.f(i), st = kpiStatus(v, good, warn, def.dir);
    if (st === 'na') return;
    const val = def.unit === 'j' ? v + ' jours' : pct(v), rep = def.unit === 'j' ? good + ' jours' : pct(good);
    const cmp = def.dir === 'min' ? '≥ ' : '≤ ';
    if (st === 'good') out.push({ s: 'good', t: `${def.label} : ${val}`, d: `Conforme au repère du secteur (${cmp}${rep}).` });
    else out.push({ s: st, t: `${def.label} : ${val}`, d: `Repère du secteur : ${cmp}${rep}.`, a: def.act });
  });
  // Tendance du CA
  const act = months.filter(M => M.ca);
  if (act.length >= 2) {
    const a = act[act.length - 1], b = act[act.length - 2], ev = b.ca ? (a.ca - b.ca) / b.ca : 0;
    out.push({ s: ev >= 0 ? 'good' : (ev > -.15 ? 'warn' : 'bad'),
      t: `CA de ${MOIS[a.m - 1]} : ${ev >= 0 ? '+' : ''}${pct(ev)} par rapport à ${MOIS[b.m - 1]}`,
      d: `${num(a.ca)} MAD contre ${num(b.ca)} MAD.`,
      a: ev < 0 ? 'Analyser la baisse par client et par produit, et relancer les clients habituels qui n’ont pas commandé.' : undefined });
  }
  // Mois en perte
  const loss = months.filter(M => M.res < 0 && (M.ca || M.ch));
  if (loss.length) out.push({ s: loss.length > 1 ? 'bad' : 'warn', t: `${loss.length} mois en perte : ${loss.map(M => MOIS[M.m - 1]).join(', ')}`,
    d: 'Les charges de ces mois ont dépassé les produits.', a: 'Vérifier si ces pertes viennent de charges ponctuelles (investissements, régularisations) ou d’un CA insuffisant pour couvrir les charges fixes.' });
  // Trésorerie
  if (i.treso < 0) out.push({ s: 'bad', t: `Trésorerie négative : ${num(i.treso)} MAD`, d: 'L’entreprise fonctionne à découvert.', a: 'Établir un plan de trésorerie sur 3 mois, accélérer les encaissements et négocier une ligne de crédit adaptée.' });
  else if (months.length >= 2) {
    const first = months[0].treso, last = months[months.length - 1].treso;
    const fall = last < first;
    out.push({ s: fall ? 'warn' : 'good', t: `Trésorerie de fin de période : ${num(last)} MAD`,
      d: fall ? `En baisse depuis ${MOIS[months[0].m - 1]} (${num(first)} MAD).` : `En hausse depuis ${MOIS[months[0].m - 1]} (${num(first)} MAD).`,
      a: fall ? 'Comparer les encaissements et les décaissements mois par mois pour repérer ce qui consomme la trésorerie.' : undefined });
  }
  // Poste de charges dominant
  const ce = i.cpc.ce.filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]);
  if (ce.length) out.push({ s: 'na', t: `Premier poste de charges : ${ce[0][0].toLowerCase()}`, d: `${num(ce[0][1])} MAD, soit ${pct(ce[0][1] / i.ca)} du chiffre d’affaires.` });
  if (i.tva > 0) out.push({ s: 'na', t: `TVA à déclarer : ${num(i.tva)} MAD`, d: 'Montant de TVA facturée non couvert par la TVA récupérable. Pensez à la déclaration et au paiement dans les délais.' });
  return out;
}

if (typeof module !== 'undefined') module.exports = { indicators, monthly, analysis, SECTORS, PCM, sampleState, balances, cpc, bilan, invTotals, sp, r2 };

