// ============================================================
// js/components.js — COMPONENTES REUTILIZÁVEIS
// ============================================================

// Card de estatística (painel admin)
function statCard(icon, val, lbl, color, bg, sub="") {
  return `<div class="tonal-card" style="padding:20px;border-radius:var(--raio);border-left:4px solid ${color};">
    <span class="ms" style="color:${color};font-size:24px;background:${bg};padding:9px;border-radius:10px;display:inline-block;margin-bottom:12px;">${icon}</span>
    <div style="font-size:28px;font-weight:800;color:${color};margin-bottom:3px;">${val}</div>
    <div style="font-size:11px;font-weight:700;color:#75777f;text-transform:uppercase;letter-spacing:.06em;">${lbl}</div>
    ${sub?`<div style="font-size:11px;color:#c5c6cf;margin-top:2px;">${sub}</div>`:""}
  </div>`;
}

// Mini stat (usado em modais e detalhes)
function miniStat(icon, val, lbl) {
  return `<div style="background:#f5f3f7;border-radius:11px;padding:12px;text-align:center;">
    <span class="ms" style="color:var(--cor-primaria);font-size:19px;">${icon}</span>
    <div style="font-size:20px;font-weight:800;color:var(--cor-primaria);margin-top:3px;">${val}</div>
    <div style="font-size:10px;font-weight:700;color:#75777f;text-transform:uppercase;letter-spacing:.04em;">${lbl}</div>
  </div>`;
}

// Barra de progresso com porcentagem
function progBar(v, size="md") {
  return `<div style="display:flex;align-items:center;gap:8px;">
    <div class="pbar ${size}" style="flex:1;"><div class="pfill ${pcol(v||0)}" style="width:${v||0}%;"></div></div>
    <span style="font-size:12px;font-weight:700;color:#44464e;min-width:32px;">${v||0}%</span>
  </div>`;
}

// Avatar + nome + email
function avName(u, size=32) {
  return `<div style="display:flex;align-items:center;gap:10px;">
    <div class="av" style="width:${size}px;height:${size}px;background:#d9e2ff;color:var(--cor-primaria);font-size:${size===32?"12px":"14px"};border:2px solid #fff;box-shadow:0 0 0 1px #e4e2e5;">
      ${u.foto?`<img src="${u.foto}" style="width:100%;height:100%;object-fit:cover;"/>`:(u.nome||"U")[0].toUpperCase()}
    </div>
    <div>
      <div style="font-size:14px;font-weight:600;color:#1b1b1e;">${esc(u.nome)}</div>
      <div style="font-size:11px;color:#75777f;">${esc(u.email||"")}</div>
    </div>
  </div>`;
}

// Linha de informação (ícone + label + valor)
function infoRow(icon, lbl, val) {
  return `<div style="display:flex;align-items:center;gap:10px;padding:10px;background:#f5f3f7;border-radius:10px;">
    <span class="ms" style="color:var(--cor-primaria);font-size:18px;flex-shrink:0;">${icon}</span>
    <div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#75777f;">${lbl}</div>
      <div style="font-size:14px;color:#1b1b1e;">${esc(val)}</div>
    </div>
  </div>`;
}

// Card de membro da equipe
function memberCard(u) {
  const p = u.progresso || 0;
  return `<div class="tonal-card" style="padding:16px;border-radius:14px;border-left:4px solid ${p>=70?"#10b981":p>=40?"#C5A059":"#ba1a1a"};">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
      <div class="av" style="width:44px;height:44px;background:#d9e2ff;color:var(--cor-primaria);font-size:15px;border:2px solid #fff;box-shadow:0 0 0 1px #e4e2e5;">
        ${u.foto?`<img src="${u.foto}" style="width:100%;height:100%;object-fit:cover;"/>`:(u.nome||"U")[0]}
      </div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:14px;font-weight:700;color:#1b1b1e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(u.nome)}</div>
        ${badgeHTML(u.cargo)}
      </div>
      <button class="btn-w" onclick="openEmpProfile('${u.id}')"><span class="ms" style="font-size:18px;">open_in_new</span></button>
    </div>
    <div style="margin-bottom:4px;display:flex;justify-content:space-between;font-size:11px;color:#75777f;font-weight:600;text-transform:uppercase;letter-spacing:.05em;">
      <span>Progresso de Treinamento</span><span>${p}%</span>
    </div>
    <div class="pbar"><div class="pfill ${pcol(p)}" style="width:${p}%;"></div></div>
  </div>`;
}

// Card de configuração (Configurações admin)
function cfgCard(icon, titulo, subtitulo, acao, bg, cor) {
  return `<div class="tonal-card" style="padding:18px;border-radius:14px;cursor:pointer;transition:transform .2s;" onclick="${acao}" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
    <div style="display:flex;align-items:center;gap:13px;">
      <div style="background:${bg};border-radius:10px;padding:10px;flex-shrink:0;"><span class="ms" style="color:${cor};font-size:20px;">${icon}</span></div>
      <div style="flex:1;">
        <div style="font-size:15px;font-weight:700;color:#0a1f44;">${titulo}</div>
        <div style="font-size:12px;color:#75777f;">${subtitulo}</div>
      </div>
      <span class="ms" style="color:#c5c6cf;">chevron_right</span>
    </div>
  </div>`;
}
