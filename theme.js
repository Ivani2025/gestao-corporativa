// ============================================================
// js/theme.js — PAINEL DE PERSONALIZAÇÃO DE TEMA
// ============================================================

// Aplica as variáveis CSS do tema salvo
function applyTheme() {
  const t = DB.getTema();
  const r = document.documentElement.style;
  r.setProperty("--cor-primaria",    t.primaria   || TEMA_PADRAO.primaria);
  r.setProperty("--cor-fundo",       t.fundo      || TEMA_PADRAO.fundo);
  r.setProperty("--cor-sucesso",     t.sucesso    || TEMA_PADRAO.sucesso);
  r.setProperty("--cor-destaque",    t.destaque   || TEMA_PADRAO.destaque);
  r.setProperty("--cor-erro",        t.erro       || TEMA_PADRAO.erro);
  r.setProperty("--cor-superficie",  t.superficie || TEMA_PADRAO.superficie);
  document.body.style.background = t.fundo || TEMA_PADRAO.fundo;

  // Aplica logo e nome do sistema globalmente
  if (t.nomeDoSistema) {
    document.querySelectorAll(".sys-nome").forEach(el => el.textContent = t.nomeDoSistema);
    document.title = t.nomeDoSistema;
    const loginTitle = document.getElementById("login-sys-title");
    if (loginTitle) loginTitle.textContent = t.nomeDoSistema;
  }
  // Atualiza empresa na sidebar
  const sbEmpresa = document.getElementById("sb-empresa");
  if (sbEmpresa) sbEmpresa.textContent = t.nomeEmpresa || "Sistema de Equipes";
  if (t.logoUrl) {
    document.querySelectorAll(".sys-logo").forEach(el => {
      el.innerHTML = `<img src="${t.logoUrl}" style="width:100%;height:100%;object-fit:contain;"/>`;
    });
    // Login logo
    const loginLogo = document.getElementById("login-logo-icon");
    if (loginLogo) loginLogo.innerHTML = `<img src="${t.logoUrl}" style="width:100%;height:100%;object-fit:contain;border-radius:8px;"/>`;
  }
  // Aplica tema de época se ativo
  if (t.epocaTema) applyEpocaCSS(t.epocaTema);
}

// Temas de época
const EPOCAS = {
  "nenhum":  { nome:"Nenhum",       emoji:"",  extra:"" },
  "natal":   { nome:"🎄 Natal",      emoji:"🎄", primaria:"#1a472a", destaque:"#c41e3a", fundo:"#f0f8f0",
    css:`
      .nav-i.on { background: linear-gradient(135deg,#1a472a,#c41e3a) !important; }
      .tonal-card::after { content:''; position:absolute; pointer-events:none; }
      @keyframes snow { 0%{transform:translateY(-10px) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(360deg);opacity:0} }
      .snowflake { position:fixed;top:-10px;color:#fff;font-size:1em;z-index:9998;animation:snow linear infinite; pointer-events:none; }
    `,
    script: `spawnSnow();`
  },
  "reveillon":{ nome:"🎆 Réveillon",  emoji:"🎆", primaria:"#1a0a3d", destaque:"#FFD700", fundo:"#0d0d1a",
    css:`
      body { background: #0d0d1a !important; }
      .tonal-card { background: rgba(26,10,61,0.9); color:#fff; }
      @keyframes sparkle { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(1.5)} }
    `,
    script:``
  },
  "festa-junina":{ nome:"🎪 Festa Junina", emoji:"🎪", primaria:"#8B1A1A", destaque:"#FFD700", fundo:"#FFF8DC",
    css:``,
    script:``
  },
  "halloween":{ nome:"🎃 Halloween",  emoji:"🎃", primaria:"#4a0e0e", destaque:"#FF6600", fundo:"#1a0a0a",
    css:`
      body { background: #1a0a0a !important; }
    `,
    script:``
  },
  "carnaval": { nome:"🎭 Carnaval",   emoji:"🎭", primaria:"#4a0080", destaque:"#FFD700", fundo:"#1a0040",
    css:``,
    script:``
  },
};

function applyEpocaCSS(epocaKey) {
  const ep = EPOCAS[epocaKey];
  if (!ep || epocaKey === "nenhum") {
    const old = document.getElementById("epoca-style");
    if (old) old.remove();
    return;
  }
  let styleEl = document.getElementById("epoca-style");
  if (!styleEl) { styleEl = document.createElement("style"); styleEl.id="epoca-style"; document.head.appendChild(styleEl); }
  styleEl.textContent = ep.css || "";
  if (ep.script) { try { eval(ep.script); } catch(e) {} }
}

function spawnSnow() {
  if (document.querySelector(".snowflake")) return; // já tem
  const flakes = ["❄","❅","❆","*","·"];
  for (let i=0;i<18;i++) {
    const s = document.createElement("span");
    s.className = "snowflake";
    s.textContent = flakes[Math.floor(Math.random()*flakes.length)];
    s.style.cssText = `left:${Math.random()*100}vw;font-size:${Math.random()*1.5+0.5}em;animation-duration:${Math.random()*6+4}s;animation-delay:${Math.random()*5}s;opacity:${Math.random()*.8+.2};color:rgba(255,255,255,${Math.random()*.8+.2});`;
    document.body.appendChild(s);
  }
}

// ══ PÁGINA: PERSONALIZAR TEMA ════════════════════════════
function renderPersonalizacao(el) {
  const t = DB.getTema();

  el.innerHTML = `<div class="anim-fade" style="max-width:800px;margin:0 auto;">
    <!-- Título -->
    <div style="margin-bottom:24px;">
      <h2 style="font-size:22px;font-weight:700;color:var(--cor-primaria);">Personalizar Tema</h2>
      <p style="color:#75777f;font-size:13px;margin-top:3px;">Altere cores, logo, nome e aparência em tempo real</p>
    </div>

    <!-- Preview em tempo real -->
    <div class="tonal-card" style="padding:20px;border-radius:var(--raio);margin-bottom:20px;">
      <h3 style="font-size:12px;font-weight:700;color:#44464e;text-transform:uppercase;letter-spacing:.06em;margin-bottom:14px;">Preview em Tempo Real</h3>
      <div style="border-radius:12px;overflow:hidden;border:1px solid var(--cor-borda);">
        <div style="background:var(--cor-primaria);padding:12px 18px;display:flex;align-items:center;gap:10px;">
          <div id="prev-logo" style="width:32px;height:32px;background:rgba(255,255,255,.15);border-radius:8px;display:flex;align-items:center;justify-content:center;">
            ${t.logoUrl?`<img src="${t.logoUrl}" style="width:100%;height:100%;object-fit:contain;border-radius:6px;"/>`:`<span class="ms" style="color:#fff;font-size:18px;">shield_person</span>`}
          </div>
          <span style="color:#fff;font-weight:700;font-size:14px;" id="prev-title">${t.nomeDoSistema||SYSTEM_CONFIG.nomeDoSistema}</span>
          <div style="flex:1;"></div>
          <div class="av" style="width:30px;height:30px;background:rgba(255,255,255,.2);color:#fff;font-size:12px;">A</div>
        </div>
        <div style="background:var(--cor-fundo);padding:16px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
          <div style="background:var(--cor-superficie);border-radius:10px;padding:14px;border-left:4px solid var(--cor-primaria);">
            <div style="font-size:20px;font-weight:800;color:var(--cor-primaria);">24</div>
            <div style="font-size:10px;font-weight:700;color:#75777f;text-transform:uppercase;letter-spacing:.05em;margin-top:2px;">Unidades</div>
          </div>
          <div style="background:var(--cor-superficie);border-radius:10px;padding:14px;border-left:4px solid var(--cor-sucesso);">
            <div style="font-size:20px;font-weight:800;color:var(--cor-sucesso);">82%</div>
            <div style="font-size:10px;font-weight:700;color:#75777f;text-transform:uppercase;letter-spacing:.05em;margin-top:2px;">Conclusão</div>
          </div>
          <div style="background:var(--cor-superficie);border-radius:10px;padding:14px;border-left:4px solid var(--cor-destaque);">
            <div style="font-size:20px;font-weight:800;color:var(--cor-destaque);">142</div>
            <div style="font-size:10px;font-weight:700;color:#75777f;text-transform:uppercase;letter-spacing:.05em;margin-top:2px;">Funcionários</div>
          </div>
        </div>
      </div>
    </div>

    <!-- IDENTIDADE DO SISTEMA -->
    <div class="tonal-card" style="padding:20px;border-radius:var(--raio);margin-bottom:20px;">
      <h3 style="font-size:12px;font-weight:700;color:#44464e;text-transform:uppercase;letter-spacing:.06em;margin-bottom:16px;">🏢 Identidade do Sistema</h3>
      <div style="display:grid;gap:14px;">

        <!-- Logo upload -->
        <div>
          <label class="lbl">Logo da Empresa</label>
          <div style="display:flex;align-items:center;gap:14px;padding:14px;background:#f5f3f7;border-radius:12px;">
            <div id="logo-prev" onclick="$('logo-inp').click()" style="width:72px;height:72px;border-radius:12px;background:#fff;border:2px dashed #c5c6cf;display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;flex-shrink:0;transition:all .2s;" onmouseover="this.style.borderColor='var(--cor-primaria)'" onmouseout="this.style.borderColor='#c5c6cf'">
              ${t.logoUrl
                ? `<img src="${t.logoUrl}" style="width:100%;height:100%;object-fit:contain;padding:4px;"/>`
                : `<span class="ms" style="color:#c5c6cf;font-size:28px;">image</span>`}
            </div>
            <input type="file" id="logo-inp" accept="image/*" style="display:none;" onchange="uploadLogo(this)"/>
            <div>
              <p style="font-size:14px;font-weight:600;color:var(--cor-primaria);">${t.logoUrl?"Logo carregada":"Adicionar Logo"}</p>
              <p style="font-size:12px;color:#75777f;margin-top:2px;">Clique na imagem para ${t.logoUrl?"trocar":"adicionar"}.<br>PNG transparente fica melhor.</p>
              ${t.logoUrl?`<button class="btn-w" style="font-size:12px;color:#ba1a1a;margin-top:4px;" onclick="removeLogo()"><span class="ms" style="font-size:14px;">delete</span>Remover logo</button>`:""}
            </div>
          </div>
        </div>

        <!-- Nome do sistema -->
        <div>
          <label class="lbl">Nome do Sistema</label>
          <div style="position:relative;">
            <span class="ms" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#75777f;font-size:17px;line-height:1;">shield_person</span>
            <input class="inp" id="sys-nome" value="${esc(t.nomeDoSistema||SYSTEM_CONFIG.nomeDoSistema)}" placeholder="Nome do sistema" style="padding-left:44px;" oninput="$('prev-title').textContent=this.value||'Sistema'"/>
          </div>
        </div>

        <!-- Subtítulo / empresa -->
        <div>
          <label class="lbl">Nome da Empresa / Subtítulo</label>
          <div style="position:relative;">
            <span class="ms" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#75777f;font-size:17px;line-height:1;">corporate_fare</span>
            <input class="inp" id="sys-empresa" value="${esc(t.nomeEmpresa||"")}" placeholder="Ex: Rede de Clínicas XYZ" style="padding-left:44px;"/>
          </div>
          <p style="font-size:11px;color:#75777f;margin-top:3px;">Aparece na sidebar e abaixo do nome do cargo do funcionário</p>
        </div>

      </div>
    </div>

    <!-- TEMAS DE ÉPOCA -->
    <div class="tonal-card" style="padding:20px;border-radius:var(--raio);margin-bottom:20px;">
      <h3 style="font-size:12px;font-weight:700;color:#44464e;text-transform:uppercase;letter-spacing:.06em;margin-bottom:14px;">🗓 Tema de Época / Evento</h3>
      <p style="font-size:12px;color:#75777f;margin-bottom:14px;">Ative temas sazonais com efeitos especiais para datas comemorativas</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;margin-bottom:14px;">
        ${Object.entries(EPOCAS).map(([key, ep]) => `
          <div class="theme-preset ${(t.epocaTema||"nenhum")===key?"ativo":""}" onclick="selectEpoca('${key}')" id="ep-${key}" style="padding:14px;text-align:center;">
            <div style="font-size:28px;margin-bottom:6px;">${ep.emoji||"○"}</div>
            <div style="font-size:12px;font-weight:600;color:#1b1b1e;">${ep.nome}</div>
          </div>`).join("")}
      </div>
      <div id="epoca-info" style="display:none;padding:12px;background:#d9e2ff;border-radius:10px;font-size:13px;color:var(--cor-primaria);"></div>
    </div>

    <!-- TEMAS PREDEFINIDOS -->
    <div class="tonal-card" style="padding:20px;border-radius:var(--raio);margin-bottom:20px;">
      <h3 style="font-size:12px;font-weight:700;color:#44464e;text-transform:uppercase;letter-spacing:.06em;margin-bottom:14px;">🎨 Temas Predefinidos</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;">
        ${TEMAS_PRESET.map((tp,i) => `
          <div class="theme-preset ${tp.primaria===t.primaria?"ativo":""}" onclick="applyPreset(${i})" id="tp-${i}">
            <div style="display:flex;justify-content:center;gap:5px;margin-bottom:8px;">
              <div style="width:22px;height:22px;border-radius:50%;background:${tp.primaria};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.2);"></div>
              <div style="width:22px;height:22px;border-radius:50%;background:${tp.sucesso};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.2);"></div>
              <div style="width:22px;height:22px;border-radius:50%;background:${tp.destaque};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.2);"></div>
            </div>
            <div style="font-size:12px;font-weight:600;color:#1b1b1e;">${tp.nome}</div>
          </div>`).join("")}
      </div>
    </div>

    <!-- CORES PERSONALIZADAS -->
    <div class="tonal-card" style="padding:20px;border-radius:var(--raio);margin-bottom:20px;">
      <h3 style="font-size:12px;font-weight:700;color:#44464e;text-transform:uppercase;letter-spacing:.06em;margin-bottom:16px;">🖌 Cores Personalizadas</h3>
      <div style="display:grid;gap:12px;">
        ${colorRow("cor-primaria","Cor Primária","Navbar, botões, destaques principais",t.primaria||TEMA_PADRAO.primaria,"tc-pri")}
        ${colorRow("cor-fundo","Cor do Fundo","Background da página",t.fundo||TEMA_PADRAO.fundo,"tc-bg")}
        ${colorRow("cor-sucesso","Cor de Sucesso","Progresso, aprovações, verde",t.sucesso||TEMA_PADRAO.sucesso,"tc-suc")}
        ${colorRow("cor-destaque","Cor de Destaque","Ouro, badges especiais",t.destaque||TEMA_PADRAO.destaque,"tc-dest")}
        ${colorRow("cor-erro","Cor de Erro","Alertas e exclusões",t.erro||TEMA_PADRAO.erro,"tc-err")}
        ${colorRow("cor-superficie","Cor dos Cards","Fundo de cards e modais",t.superficie||TEMA_PADRAO.superficie,"tc-surf")}
      </div>
    </div>

    <!-- Botões de ação -->
    <div style="display:flex;gap:12px;flex-wrap:wrap;">
      <button class="btn btn-p" style="flex:1;justify-content:center;" onclick="saveTheme()">
        <span class="ms">save</span>Salvar Todas as Alterações
      </button>
      <button class="btn btn-s" style="justify-content:center;" onclick="resetTheme()">
        <span class="ms">refresh</span>Restaurar Padrão
      </button>
    </div>
  </div>`;
}

// Upload de logo
function uploadLogo(inp) {
  const f = inp.files[0]; if(!f) return;
  const r = new FileReader();
  r.onload = e => {
    const url = e.target.result;
    // Preview
    const prev = $("logo-prev"); if(prev) prev.innerHTML=`<img src="${url}" style="width:100%;height:100%;object-fit:contain;padding:4px;"/>`;
    const prevLogo = $("prev-logo"); if(prevLogo) prevLogo.innerHTML=`<img src="${url}" style="width:100%;height:100%;object-fit:contain;border-radius:6px;"/>`;
    // Salva temporariamente na sessão
    window._logoTemp = url;
    toast("Logo carregada! Clique em Salvar para confirmar.","ok");
  };
  r.readAsDataURL(f);
}

function removeLogo() {
  window._logoTemp = null;
  window._logoRemoved = true;
  toast("Logo removida. Salve para confirmar.","ok");
  renderPersonalizacao($("page"));
}

// Selecionar época
function selectEpoca(key) {
  const ep = EPOCAS[key];
  document.querySelectorAll("[id^='ep-']").forEach(el => el.classList.remove("ativo"));
  document.getElementById("ep-"+key)?.classList.add("ativo");
  window._epocaTemp = key;
  // Aplica CSS da época imediatamente
  applyEpocaCSS(key);
  if (key === "natal") spawnSnow();
  else document.querySelectorAll(".snowflake").forEach(el=>el.remove());
  const info = $("epoca-info");
  if(info) {
    if(key==="nenhum") { info.style.display="none"; }
    else { info.style.display="block"; info.textContent=`Tema "${ep.nome}" ativo! Salve para manter após recarregar.`; }
  }
  // Se a época tem cores próprias, aplica como sugestão
  if(ep.primaria) { document.documentElement.style.setProperty("--cor-primaria", ep.primaria); }
  if(ep.destaque) { document.documentElement.style.setProperty("--cor-destaque", ep.destaque); }
  if(ep.fundo)    { document.documentElement.style.setProperty("--cor-fundo",    ep.fundo); document.body.style.background = ep.fundo; }
}

// Linha de cor com swatch + input hex
function colorRow(varName, label, desc, value, inputId) {
  return `<div style="display:flex;align-items:center;gap:14px;padding:12px;background:#f5f3f7;border-radius:12px;">
    <div class="color-swatch" style="background:${value};" title="Clique para escolher a cor">
      <input type="color" value="${value}" oninput="liveColor('${varName}','${inputId}',this.value)"/>
    </div>
    <div style="flex:1;">
      <div style="font-size:14px;font-weight:600;color:#1b1b1e;">${label}</div>
      <div style="font-size:11px;color:#75777f;margin-top:1px;">${desc}</div>
    </div>
    <input class="inp" id="${inputId}" value="${value.toUpperCase()}" style="width:100px;font-family:monospace;font-size:12px;text-transform:uppercase;text-align:center;padding:8px;" maxlength="7"
      oninput="if(/^#[0-9A-Fa-f]{6}$/.test(this.value)){liveColor('${varName}','${inputId}',this.value);}" placeholder="#000000"/>
  </div>`;
}

// Aplica cor em tempo real
function liveColor(varName, inputId, hex) {
  document.documentElement.style.setProperty("--"+varName, hex);
  const el = document.getElementById(inputId);
  if (el) el.value = hex.toUpperCase();
  const swatch = el?.previousElementSibling;
  if (swatch) swatch.style.background = hex;
  if (varName==="cor-fundo") document.body.style.background = hex;
}

// Aplica tema predefinido
function applyPreset(i) {
  const tp = TEMAS_PRESET[i]; if(!tp) return;
  document.documentElement.style.setProperty("--cor-primaria",   tp.primaria);
  document.documentElement.style.setProperty("--cor-fundo",      tp.fundo);
  document.documentElement.style.setProperty("--cor-sucesso",    tp.sucesso);
  document.documentElement.style.setProperty("--cor-destaque",   tp.destaque);
  document.documentElement.style.setProperty("--cor-erro",       tp.erro);
  document.documentElement.style.setProperty("--cor-superficie", tp.superficie);
  document.body.style.background = tp.fundo;
  document.querySelectorAll(".theme-preset").forEach((el,j) => el.classList.toggle("ativo", j===i));
  renderPersonalizacao($("page"));
  toast("Tema "+tp.nome+" aplicado!","ok");
}

// Salva tema completo
function saveTheme() {
  const getVar = v => getComputedStyle(document.documentElement).getPropertyValue("--"+v).trim();
  const tema = {
    nome:          "Personalizado",
    primaria:      getVar("cor-primaria"),
    fundo:         getVar("cor-fundo"),
    sucesso:       getVar("cor-sucesso"),
    destaque:      getVar("cor-destaque"),
    erro:          getVar("cor-erro"),
    superficie:    getVar("cor-superficie"),
    nomeDoSistema: $("sys-nome")?.value.trim()    || SYSTEM_CONFIG.nomeDoSistema,
    nomeEmpresa:   $("sys-empresa")?.value.trim() || "",
    logoUrl:       window._logoRemoved ? null : (window._logoTemp || DB.getTema().logoUrl || null),
    epocaTema:     window._epocaTemp  || DB.getTema().epocaTema || "nenhum",
  };
  DB.saveTema(tema);
  SYSTEM_CONFIG.nomeDoSistema = tema.nomeDoSistema;
  window._logoTemp = null;
  window._logoRemoved = false;
  window._epocaTemp = null;
  applyTheme();
  toast("Tema salvo com sucesso! ✓","ok");
}

// Restaura padrão
function resetTheme() {
  document.querySelectorAll(".snowflake").forEach(el=>el.remove());
  applyEpocaCSS("nenhum");
  DB.resetTema();
  window._logoTemp = null;
  window._logoRemoved = false;
  window._epocaTemp = null;
  applyTheme();
  renderPersonalizacao($("page"));
  toast("Tema padrão restaurado!","ok");
}
