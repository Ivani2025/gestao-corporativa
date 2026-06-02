// ============================================================
// js/utils.js — UTILITÁRIOS GLOBAIS
// ============================================================

// Atalho getElementById
const $ = id => document.getElementById(id);

// Escapar HTML (segurança XSS)
const esc = s => String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

// Calcular porcentagem
const pct  = (done, total) => total > 0 ? Math.round((done / total) * 100) : 0;

// Cor da barra de progresso
const pcol = v => v >= 70 ? "pg" : v >= 40 ? "py" : "pr";

// Média de progresso de uma lista de usuários
const avg  = us => us.length ? Math.round(us.reduce((a,u) => a+(u.progresso||0), 0) / us.length) : 0;

// TOAST — notificação flutuante
function toast(msg, type = "") {
  const el = $("toast");
  el.textContent = msg;
  el.style.background = type==="ok"?"#006b54" : type==="err"?"#ba1a1a" : "#0a1f44";
  el.classList.add("on");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("on"), 3200);
}

// MODAL — abre/fecha
function openModal(html) {
  $("modal-root").innerHTML =
    `<div class="overlay" onclick="if(event.target===this)closeModal()">
       <div class="mbox anim-slide">${html}</div>
     </div>`;
}
function closeModal() { $("modal-root").innerHTML = ""; }
document.addEventListener("keydown", e => { if (e.key==="Escape") closeModal(); });

// CARGOS (hierarquia e badges)
const CARGOS = {
  "admin-geral":    {l:"Admin Geral",    b:"b0", lv:10},
  "gerente":        {l:"Gerente",         b:"b1", lv:7},
  "sub-gerente":    {l:"Sub-gerente",     b:"b2", lv:6},
  "adm-junior":     {l:"Adm Júnior",     b:"b3", lv:5},
  "recruta":        {l:"Recruta",         b:"b4", lv:3},
  "funcionario":    {l:"Funcionário",     b:"b5", lv:2},
  "jovem-aprendiz": {l:"Jovem Aprendiz",  b:"b6", lv:1},
};
const cg = id => CARGOS[id] || CARGOS["funcionario"];
const badgeHTML = c => `<span class="badge ${cg(c).b}">${cg(c).l}</span>`;

// Minha equipe (baseado no cargo)
function myTeam()  { return isAdmin() ? DB.users() : DB.users().filter(u => u.unidadeId === S.user.unidadeId); }

// Meus treinamentos (filtrado pelo cargo)
function myTrens() {
  const r = S.user.cargo;
  return DB.treinamentos().filter(t => !t.cargos || !t.cargos.length || t.cargos.includes(r));
}

// Recalcula progresso do usuário logado
function recalcProg() {
  const mine = myTrens();
  S.user.progresso = pct(
    mine.filter(t => S.user.treinamentos?.[t.id]?.concluido).length,
    mine.length
  );
}
