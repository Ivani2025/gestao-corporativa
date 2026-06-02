// ============================================================
// js/nav.js — NAVEGAÇÃO, SIDEBAR, BOTTOM NAV
// ============================================================

const PAGE_TITLES = {
  "dashboard":"Dashboard", "unidades":"Gestão de Unidades",
  "funcionarios":"Funcionários", "treinamentos":"Treinamentos",
  "meu-treinamento":"Meus Treinamentos", "perfil":"Meu Perfil",
  "configuracoes":"Configurações", "personalizacao":"Personalizar Tema",
};

// Constrói sidebar e bottom nav conforme o cargo
function buildNav() {
  const u = S.user;
  setAvatar("sb-av", u);
  setAvatar("hd-av", u);
  $("sb-name").textContent = u.nome;
  $("sb-badge").innerHTML  = badgeHTML(u.cargo);

  const items = isAdmin() ? [
    {p:"dashboard",      i:"dashboard",      l:"Dashboard"},
    {p:"unidades",       i:"corporate_fare", l:"Unidades"},
    {p:"funcionarios",   i:"group",          l:"Funcionários"},
    {p:"treinamentos",   i:"school",         l:"Treinamentos"},
    {p:"configuracoes",  i:"settings",       l:"Configurações"},
    {p:"personalizacao", i:"palette",        l:"Tema & Cores"},
    {p:"perfil",         i:"person",         l:"Meu Perfil"},
  ] : isMgr() ? [
    {p:"dashboard",      i:"dashboard",      l:"Dashboard"},
    {p:"funcionarios",   i:"group",          l:"Minha Equipe"},
    {p:"meu-treinamento",i:"school",         l:"Treinamentos"},
    {p:"perfil",         i:"person",         l:"Meu Perfil"},
  ] : [
    {p:"dashboard",      i:"dashboard",      l:"Início"},
    {p:"meu-treinamento",i:"school",         l:"Treinamentos"},
    {p:"perfil",         i:"person",         l:"Meu Perfil"},
  ];

  $("sb-nav").innerHTML = items.map(it =>
    `<div class="nav-i" id="nav-${it.p}" data-p="${it.p}" onclick="nav('${it.p}')" style="margin-bottom:3px;">
      <span class="ms" style="font-size:19px;">${it.i}</span>${it.l}
    </div>`
  ).join("");

  $("bnav").innerHTML = items.slice(0,4).map(it =>
    `<div class="bnav-i" id="bn-${it.p}" data-p="${it.p}" onclick="nav('${it.p}')">
      <span class="ms" style="font-size:22px;">${it.i}</span>
      <span>${it.l.split(" ")[0]}</span>
    </div>`
  ).join("");
}

// Navegar para uma página
function nav(p) {
  S.page = p;
  $("page-title").textContent = PAGE_TITLES[p] || p;
  document.querySelectorAll(".nav-i,.bnav-i").forEach(el => el.classList.toggle("on", el.dataset.p===p));
  $("page").innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:200px;">
    <span class="ms anim-spin" style="font-size:36px;color:#c5c6cf;">progress_activity</span></div>`;
  setTimeout(() => renderPage(p), 80);
}

// Roteador de páginas
function renderPage(p) {
  const el = $("page"); if(!el) return;
  ({
    "dashboard":       () => renderDashboard(el),
    "unidades":        () => renderUnidades(el),
    "funcionarios":    () => renderFuncionarios(el),
    "treinamentos":    () => renderTreinamentos(el),
    "meu-treinamento": () => renderMeuTreinamento(el),
    "perfil":          () => renderPerfil(el),
    "configuracoes":   () => renderConfig(el),
    "personalizacao":  () => renderPersonalizacao(el),
  }[p] || (() => el.innerHTML = ""))();
}

// Seta avatar no elemento
function setAvatar(elId, u) {
  const el = $(elId); if(!el) return;
  el.innerHTML = u?.foto
    ? `<img src="${u.foto}" style="width:100%;height:100%;object-fit:cover;"/>`
    : (u?.nome||"U")[0].toUpperCase();
}
