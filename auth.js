// ============================================================
// js/auth.js — AUTENTICAÇÃO
// ============================================================

// Estado global da sessão
const S = { user: null, page: "dashboard" };

// LOGIN
function doLogin() {
  const email = $("l-email").value.trim();
  const pass  = $("l-pass").value;
  $("l-err").style.display = "none";

  if (!email || !pass) { showLoginError("Preencha e-mail e senha."); return; }

  const user = DB.byEmail(email);
  if (!user || user.senha !== pass) { showLoginError("E-mail ou senha incorretos."); return; }

  S.user = user;
  $("scr-login").classList.remove("on");
  $("scr-app").classList.add("on");
  applyTheme();
  buildNav();
  nav("dashboard");
}

// LOGOUT
function doLogout() {
  S.user = null;
  $("scr-app").classList.remove("on");
  $("scr-login").classList.add("on");
  $("l-pass").value = "";
  $("l-err").style.display = "none";
}

function showLoginError(msg) {
  const e = $("l-err");
  e.textContent = msg;
  e.style.display = "block";
}

// Permissões
function isAdmin() { return S.user?.cargo === "admin-geral"; }
function isMgr()   { return ["admin-geral","gerente","sub-gerente","adm-junior"].includes(S.user?.cargo); }

// Mostrar/ocultar senha
function tPass(id, btn) {
  const inp = $(id); if(!inp) return;
  inp.type = inp.type==="password" ? "text" : "password";
  btn.querySelector(".ms").textContent = inp.type==="password" ? "visibility" : "visibility_off";
}

// Enter nos campos de login
document.addEventListener("DOMContentLoaded", () => {
  [$("l-pass"), $("l-email")].forEach(el => {
    if (el) el.addEventListener("keydown", e => { if (e.key==="Enter") doLogin(); });
  });
});
