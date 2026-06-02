// ============================================================
// js/db.js — BANCO DE DADOS (Firebase Firestore — nuvem)
// Todos os computadores compartilham os mesmos dados
// ============================================================

// ── Usuários fixos (sempre existem, em qualquer dispositivo)
const USUARIOS_FIXOS = {
  "matheus_gmail": {
    id:"matheus_gmail", nome:"Matheus Rogério",
    email:"matheusrogerio150410@gmail.com", senha:"Matheus.1",
    cargo:"admin-geral", foto:null, telefone:"", localizacao:"",
    emergenciaNome:"", emergenciaTel:"", emergencia:"",
    progresso:0, treinamentos:{}, unidadeId:null, unidadeNome:null,
    criadoEm:"2025-01-01T00:00:00.000Z"
  },
  "matheus_outlook": {
    id:"matheus_outlook", nome:"Matheus Rogério",
    email:"matheus051007@outlook.com", senha:"Matheus.1",
    cargo:"admin-geral", foto:null, telefone:"", localizacao:"",
    emergenciaNome:"", emergenciaTel:"", emergencia:"",
    progresso:0, treinamentos:{}, unidadeId:null, unidadeNome:null,
    criadoEm:"2025-01-01T00:00:00.000Z"
  },
};

// ── Cache local (evita leituras repetidas ao Firebase)
let _cache = { users:{}, unidades:{}, treinamentos:{}, tema:null, ready:false };
let _db = null; // instância Firestore

// ============================================================
// DB — API principal
// ============================================================
const DB = {

  // ----------------------------------------------------------
  // INIT — conecta Firebase e carrega dados
  // ----------------------------------------------------------
  async init() {
    try {
      const { initializeApp }   = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
      const { getFirestore, doc, setDoc, getDoc,
              collection, getDocs, deleteDoc }
        = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");

      const app = initializeApp(FIREBASE_CONFIG);
      _db = getFirestore(app);
      this._fs = { doc, setDoc, getDoc, collection, getDocs, deleteDoc };

      // Carrega todos os dados do Firestore
      await this._loadAll();

      // Garante usuários fixos no Firestore (cria se não existir)
      for (const [id, u] of Object.entries(USUARIOS_FIXOS)) {
        if (!_cache.users[id]) {
          await this._fs.setDoc(this._fs.doc(_db, "users", id), u);
          _cache.users[id] = u;
        }
      }

      // Garante tema padrão
      if (!_cache.tema) {
        await this._fs.setDoc(this._fs.doc(_db, "config", "tema"), TEMA_PADRAO);
        _cache.tema = TEMA_PADRAO;
      }

      _cache.ready = true;
      console.log("Firebase conectado ✓");
      toast("Banco de dados em nuvem conectado ✓", "ok");

    } catch(e) {
      console.error("Firebase erro:", e);
      // Fallback para localStorage se Firebase falhar
      this._initLocal();
      toast("Modo offline ativado — Firebase indisponível", "err");
    }
  },

  // ----------------------------------------------------------
  // CARREGA TODOS OS DADOS DO FIRESTORE
  // ----------------------------------------------------------
  async _loadAll() {
    const { collection, getDocs, getDoc, doc } = this._fs;
    const [uSnap, unSnap, trSnap, temaSnap] = await Promise.all([
      getDocs(collection(_db, "users")),
      getDocs(collection(_db, "unidades")),
      getDocs(collection(_db, "treinamentos")),
      getDoc(doc(_db, "config", "tema")),
    ]);
    uSnap.forEach(d  => _cache.users[d.id]        = d.data());
    unSnap.forEach(d => _cache.unidades[d.id]      = d.data());
    trSnap.forEach(d => _cache.treinamentos[d.id]  = d.data());
    if (temaSnap.exists()) _cache.tema = temaSnap.data();
  },

  // ----------------------------------------------------------
  // FALLBACK LOCAL (se Firebase falhar)
  // ----------------------------------------------------------
  _initLocal() {
    const stored = JSON.parse(localStorage.getItem("gc_users")||"{}");
    _cache.users = { ...USUARIOS_FIXOS, ...stored };
    _cache.unidades    = JSON.parse(localStorage.getItem("gc_unidades")||"{}");
    _cache.treinamentos= JSON.parse(localStorage.getItem("gc_treinamentos")||"{}");
    _cache.tema        = JSON.parse(localStorage.getItem("gc_tema")||"null") || TEMA_PADRAO;
    _cache.ready = true;
  },
  _localSet(col, id, data) {
    const key = "gc_"+col;
    const all = JSON.parse(localStorage.getItem(key)||"{}");
    all[id] = data;
    localStorage.setItem(key, JSON.stringify(all));
  },
  _localDel(col, id) {
    const key = "gc_"+col;
    const all = JSON.parse(localStorage.getItem(key)||"{}");
    delete all[id];
    localStorage.setItem(key, JSON.stringify(all));
  },

  // ----------------------------------------------------------
  // SALVA em Firestore (ou local se offline)
  // ----------------------------------------------------------
  async _save(col, id, data) {
    _cache[col][id] = data;
    if (_db) {
      try {
        await this._fs.setDoc(this._fs.doc(_db, col, id), data);
      } catch(e) { this._localSet(col, id, data); }
    } else { this._localSet(col, id, data); }
  },
  async _del(col, id) {
    delete _cache[col][id];
    if (_db) {
      try { await this._fs.deleteDoc(this._fs.doc(_db, col, id)); }
      catch(e) { this._localDel(col, id); }
    } else { this._localDel(col, id); }
  },

  // ----------------------------------------------------------
  // ID único
  // ----------------------------------------------------------
  uid() { return "id_"+Date.now().toString(36)+Math.random().toString(36).substr(2,5); },

  // ----------------------------------------------------------
  // USUÁRIOS
  // ----------------------------------------------------------
  users()    { return Object.values(_cache.users); },
  user(id)   { return _cache.users[id] || null; },
  byEmail(e) {
    // Primeiro verifica cache (inclui usuários fixos)
    const u = Object.values(_cache.users).find(u => u.email === e);
    if (u) return u;
    // Fallback direto nos fixos
    return Object.values(USUARIOS_FIXOS).find(u => u.email === e) || null;
  },
  saveUser(u)    { return this._save("users", u.id, u); },
  deleteUser(id) {
    if (USUARIOS_FIXOS[id]) { toast("Usuários principais não podem ser removidos.", "err"); return; }
    return this._del("users", id);
  },

  // ----------------------------------------------------------
  // UNIDADES
  // ----------------------------------------------------------
  unidades()     { return Object.values(_cache.unidades); },
  unidade(id)    { return _cache.unidades[id] || null; },
  saveUnidade(u)    { return this._save("unidades", u.id, u); },
  deleteUnidade(id) { return this._del("unidades", id); },

  // ----------------------------------------------------------
  // TREINAMENTOS
  // ----------------------------------------------------------
  treinamentos()   { return Object.values(_cache.treinamentos); },
  treinamento(id)  { return _cache.treinamentos[id] || null; },
  saveTreinamento(t)    { return this._save("treinamentos", t.id, t); },
  deleteTreinamento(id) { return this._del("treinamentos", id); },

  // ----------------------------------------------------------
  // TEMA
  // ----------------------------------------------------------
  getTema()   { return _cache.tema || TEMA_PADRAO; },
  async saveTema(t) {
    _cache.tema = t;
    if (_db) {
      try { await this._fs.setDoc(this._fs.doc(_db, "config", "tema"), t); }
      catch(e) { localStorage.setItem("gc_tema", JSON.stringify(t)); }
    } else { localStorage.setItem("gc_tema", JSON.stringify(t)); }
  },
  resetTema() { return this.saveTema(TEMA_PADRAO); },

  // ----------------------------------------------------------
  // LIMPAR (mantém usuários fixos)
  // ----------------------------------------------------------
  async clearAll() {
    // Apaga unidades e treinamentos do Firestore
    if (_db) {
      const { collection, getDocs, deleteDoc } = this._fs;
      const dels = [];
      for (const col of ["unidades","treinamentos"]) {
        const snap = await getDocs(collection(_db, col));
        snap.forEach(d => dels.push(deleteDoc(d.ref)));
      }
      await Promise.all(dels);
    }
    _cache.unidades = {};
    _cache.treinamentos = {};
    toast("Dados limpos!", "ok");
  },

  // ----------------------------------------------------------
  // HELPERS
  // ----------------------------------------------------------
  countFuncsInUnit(uid) { return this.users().filter(u => u.unidadeId === uid).length; },
  avgProgressUnit(uid)  {
    const us = this.users().filter(u => u.unidadeId === uid);
    return us.length ? Math.round(us.reduce((a,u)=>a+(u.progresso||0),0)/us.length) : 0;
  },
  avgProgressAll(users) {
    const us = users || this.users();
    return us.length ? Math.round(us.reduce((a,u)=>a+(u.progresso||0),0)/us.length) : 0;
  },
};
