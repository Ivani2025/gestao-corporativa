// ============================================================
// js/pages.js — RENDERIZAÇÃO DAS PÁGINAS
// ============================================================

// ══ DASHBOARD ════════════════════════════════════════════
function renderDashboard(el) {
  el.innerHTML = `<div class="anim-fade" style="max-width:1200px;margin:0 auto;">
    <div style="margin-bottom:22px;">
      <h2 style="font-size:24px;font-weight:700;color:var(--cor-primaria);">Olá, ${esc(S.user.nome.split(" ")[0])} 👋</h2>
      <p style="color:#75777f;font-size:14px;margin-top:3px;">${new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}</p>
    </div>
    <div id="d-cards" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:16px;margin-bottom:24px;"></div>
    <div id="d-body"></div>
  </div>`;
  isAdmin() ? dashAdmin() : isMgr() ? dashMgr() : dashEmp();
}

function dashAdmin() {
  const uns=DB.unidades(), us=DB.users(), trs=DB.treinamentos();
  $("d-cards").innerHTML =
    statCard("corporate_fare",uns.length,"Unidades","var(--cor-primaria)","#d9e2ff","") +
    statCard("group",us.length,"Colaboradores","var(--cor-sucesso)","#9ef3d6","") +
    statCard("school",trs.length,"Treinamentos","#5c5f61","#e0e3e6","") +
    statCard("trending_up",avg(us)+"%","Média Geral","var(--cor-destaque)","#F5E6C8","");

  $("d-body").innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;flex-wrap:wrap;">
    <div class="tonal-card" style="padding:20px;border-radius:var(--raio);">
      <h3 style="font-size:16px;font-weight:700;color:var(--cor-primaria);margin-bottom:16px;display:flex;align-items:center;gap:7px;">
        <span class="ms" style="font-size:18px;">corporate_fare</span>Unidades Recentes
      </h3>
      ${uns.length===0
        ? `<div style="text-align:center;padding:30px;">
            <span class="ms" style="font-size:40px;color:#e4e2e5;">corporate_fare</span>
            <p style="color:#75777f;margin-top:8px;font-size:13px;">Nenhuma unidade</p>
            <button class="btn btn-p" style="margin-top:12px;" onclick="openUnitForm()"><span class="ms">add</span>Criar Unidade</button>
           </div>`
        : uns.slice(0,5).map(u=>`
            <div onclick="openUnitDetail('${u.id}')" style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:11px;cursor:pointer;border:1px solid #f0eef2;margin-bottom:7px;transition:all .2s;" onmouseover="this.style.background='#f5f3f7';this.style.borderColor='#d9e2ff'" onmouseout="this.style.background='#fff';this.style.borderColor='#f0eef2'">
              <div class="av" style="width:38px;height:38px;background:#d9e2ff;color:var(--cor-primaria);font-size:14px;font-weight:800;border-radius:10px;">${esc(u.nome[0])}</div>
              <div style="flex:1;"><div style="font-size:13px;font-weight:600;color:#1b1b1e;">${esc(u.nome)}</div><div style="font-size:11px;color:#75777f;">${esc(u.cidade||"—")}</div></div>
              <div style="font-size:12px;font-weight:700;color:var(--cor-primaria);">${DB.countFuncsInUnit(u.id)}<span style="color:#75777f;font-weight:400;"> func.</span></div>
              <span class="ms" style="font-size:16px;color:#c5c6cf;">chevron_right</span>
            </div>`).join("")}
      <button class="btn btn-p" style="width:100%;justify-content:center;margin-top:10px;padding:10px;font-size:13px;" onclick="nav('unidades')">Ver todas as unidades</button>
    </div>
    <div class="tonal-card" style="padding:20px;border-radius:var(--raio);">
      <h3 style="font-size:16px;font-weight:700;color:var(--cor-primaria);margin-bottom:16px;display:flex;align-items:center;gap:7px;">
        <span class="ms" style="font-size:18px;">group</span>Colaboradores Recentes
      </h3>
      ${us.length===0
        ? `<div style="text-align:center;padding:30px;"><p style="color:#75777f;font-size:13px;">Nenhum colaborador</p></div>`
        : us.slice(0,4).map(u=>`
            <div onclick="openEmpProfile('${u.id}')" style="display:flex;align-items:center;gap:10px;padding:9px;border-radius:10px;cursor:pointer;margin-bottom:5px;border:1px solid #f0eef2;transition:all .2s;" onmouseover="this.style.background='#f5f3f7'" onmouseout="this.style.background='#fff'">
              <div class="av" style="width:34px;height:34px;background:#d9e2ff;color:var(--cor-primaria);font-size:12px;">${u.foto?`<img src="${u.foto}" style="width:100%;height:100%;object-fit:cover;"/>`:(u.nome||"U")[0]}</div>
              <div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(u.nome)}</div>${badgeHTML(u.cargo)}</div>
              <div style="width:80px;">${progBar(u.progresso,"")}</div>
            </div>`).join("")}
      <button class="btn btn-s" style="width:100%;justify-content:center;margin-top:10px;padding:10px;font-size:13px;" onclick="nav('funcionarios')">Ver todos</button>
    </div>
  </div>`;
}

function dashMgr() {
  const team = myTeam();
  $("d-cards").innerHTML =
    statCard("group",team.length,"Minha Equipe","var(--cor-primaria)","#d9e2ff","") +
    statCard("check_circle",team.filter(u=>(u.progresso||0)>=100).length,"Concluíram","var(--cor-sucesso)","#9ef3d6","") +
    statCard("pending",team.filter(u=>(u.progresso||0)<50).length,"Precisam Atenção","var(--cor-erro)","#ffdad6","");
  $("d-body").innerHTML = `<div class="tonal-card" style="padding:20px;border-radius:var(--raio);">
    <h3 style="font-size:16px;font-weight:700;color:var(--cor-primaria);margin-bottom:16px;">Minha Equipe</h3>
    ${team.length===0
      ? `<p style="color:#75777f;text-align:center;padding:30px;">Nenhum membro na equipe</p>`
      : `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;">${team.map(u=>memberCard(u)).join("")}</div>`}
  </div>`;
}

function dashEmp() {
  const trs=myTrens(), done=trs.filter(t=>S.user.treinamentos?.[t.id]?.concluido).length;
  const p = pct(done,trs.length);
  $("d-cards").innerHTML =
    statCard("school",trs.length,"Treinamentos","var(--cor-primaria)","#d9e2ff",done+" concluídos") +
    statCard("workspace_premium",p+"%","Meu Progresso","var(--cor-sucesso)","#9ef3d6","") +
    statCard("emoji_events",done,"Certificados","var(--cor-destaque)","#F5E6C8","");
  $("d-body").innerHTML = `<div class="tonal-card" style="padding:20px;border-radius:var(--raio);">
    <div style="display:flex;align-items:center;gap:18px;margin-bottom:22px;">
      <div class="av" style="width:68px;height:68px;background:var(--cor-primaria);color:#fff;font-size:26px;flex-shrink:0;border:3px solid #d9e2ff;">
        ${S.user.foto?`<img src="${S.user.foto}" style="width:100%;height:100%;object-fit:cover;"/>`:S.user.nome[0]}
      </div>
      <div style="flex:1;">
        <div style="font-size:20px;font-weight:700;color:var(--cor-primaria);">${esc(S.user.nome)}</div>
        ${badgeHTML(S.user.cargo)}
        <div style="margin-top:10px;">${progBar(p,"lg")}</div>
      </div>
    </div>
    <h3 style="font-size:14px;font-weight:700;color:var(--cor-primaria);margin-bottom:12px;">Meus Treinamentos</h3>
    ${trs.slice(0,4).map(t => {
      const ok=S.user.treinamentos?.[t.id]?.concluido;
      return `<div onclick="openTreinamento('${t.id}')" style="display:flex;align-items:center;gap:12px;padding:12px;border:1px solid #e4e2e5;border-radius:12px;margin-bottom:7px;cursor:pointer;transition:all .2s;" onmouseover="this.style.background='#f5f3f7'" onmouseout="this.style.background='#fff'">
        <div style="width:44px;height:44px;border-radius:11px;background:${ok?"#9ef3d6":"#d9e2ff"};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <span class="ms ${ok?"f":""}" style="color:${ok?"#006b54":"var(--cor-primaria)"};font-size:22px;">${ok?"verified":"play_circle"}</span>
        </div>
        <div style="flex:1;"><div style="font-size:14px;font-weight:600;color:#1b1b1e;">${esc(t.titulo)}</div>
          <div style="font-size:12px;color:#75777f;">${ok?"Concluído ✓":"Disponível"}</div></div>
        <span class="ms" style="color:#c5c6cf;">chevron_right</span>
      </div>`;
    }).join("")||`<p style="color:#75777f;text-align:center;padding:20px;font-size:13px;">Nenhum treinamento disponível</p>`}
    <button class="btn btn-p" style="width:100%;justify-content:center;margin-top:8px;" onclick="nav('meu-treinamento')">Ver todos os treinamentos</button>
  </div>`;
}

// ══ UNIDADES ═════════════════════════════════════════════
function renderUnidades(el) {
  el.innerHTML = `<div class="anim-fade" style="max-width:1200px;margin:0 auto;">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:22px;">
      <div>
        <h2 style="font-size:22px;font-weight:700;color:var(--cor-primaria);">Gestão de Unidades</h2>
        <p style="color:#75777f;font-size:13px;margin-top:3px;">Monitore a performance operacional em tempo real</p>
      </div>
      ${isAdmin()?`<button class="btn btn-p" onclick="openUnitForm()"><span class="ms">add</span>Nova Unidade</button>`:""}
    </div>
    <div style="background:#fff;padding:14px 18px;border-radius:14px;box-shadow:0 2px 8px rgba(0,8,30,.06);margin-bottom:20px;display:flex;gap:12px;flex-wrap:wrap;">
      <div style="flex:1;min-width:200px;position:relative;">
        <span class="ms" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#75777f;font-size:19px;">search</span>
        <input class="inp" id="srch-un" placeholder="Filtrar por nome ou cidade..." style="padding-left:42px;background:#f5f3f7;" oninput="renderUnitCards(this.value)"/>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:14px;margin-bottom:22px;" id="un-stats"></div>
    <div id="un-list" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:16px;"></div>
  </div>`;
  const uns=DB.unidades(), us=DB.users();
  $("un-stats").innerHTML =
    statCard("corporate_fare",uns.length,"Total Unidades","var(--cor-primaria)","#d9e2ff","") +
    statCard("group",us.length,"Colaboradores","var(--cor-sucesso)","#9ef3d6","") +
    statCard("trending_up",avg(us)+"%","Média Conclusão","var(--cor-destaque)","#F5E6C8","");
  renderUnitCards("");
}

function renderUnitCards(q) {
  const el=$("un-list"); if(!el)return;
  let uns=DB.unidades();
  if(q) uns=uns.filter(u=>(u.nome+u.cidade).toLowerCase().includes(q.toLowerCase()));
  if(!uns.length){
    el.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:60px 20px;" class="tonal-card rounded-2xl">
      <span class="ms" style="font-size:52px;color:#e4e2e5;">corporate_fare</span>
      <p style="color:#75777f;margin-top:12px;font-size:14px;">Nenhuma unidade encontrada</p>
      ${isAdmin()?`<button class="btn btn-p" style="margin-top:14px;" onclick="openUnitForm()"><span class="ms">add</span>Criar Primeira Unidade</button>`:""}
    </div>`; return;
  }
  el.innerHTML=uns.map(u=>`
    <div class="tonal-card" style="border-radius:var(--raio);overflow:hidden;cursor:pointer;" onclick="openUnitDetail('${u.id}')">
      <div style="height:6px;background:linear-gradient(90deg,var(--cor-primaria),#4c5e86);"></div>
      <div style="padding:20px;">
        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:16px;">
          <div style="width:46px;height:46px;background:#d9e2ff;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:var(--cor-primaria);flex-shrink:0;">${esc(u.nome[0])}</div>
          <div style="flex:1;">
            <div style="font-size:15px;font-weight:700;color:var(--cor-primaria);">${esc(u.nome)}</div>
            <div style="font-size:12px;color:#75777f;display:flex;align-items:center;gap:3px;margin-top:2px;"><span class="ms" style="font-size:13px;">location_on</span>${esc(u.cidade||"—")}${u.estado?" - "+esc(u.estado):""}</div>
          </div>
          ${isAdmin()?`<div style="display:flex;gap:4px;" onclick="event.stopPropagation()">
            <button class="btn-w" onclick="openUnitForm('${u.id}')" title="Editar"><span class="ms" style="font-size:17px;">edit</span></button>
            <button class="btn-w" style="color:#ba1a1a;" onclick="confirmDel('unidade','${u.id}','${esc(u.nome)}')" title="Excluir"><span class="ms" style="font-size:17px;">delete</span></button>
          </div>`:""}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;">
          <div style="background:#f5f3f7;border-radius:9px;padding:10px;text-align:center;">
            <div style="font-size:20px;font-weight:800;color:var(--cor-primaria);">${DB.countFuncsInUnit(u.id)}</div>
            <div style="font-size:10px;font-weight:700;color:#75777f;text-transform:uppercase;letter-spacing:.04em;">Funcionários</div>
          </div>
          <div style="background:#f5f3f7;border-radius:9px;padding:10px;text-align:center;">
            <div style="font-size:20px;font-weight:800;color:var(--cor-sucesso);">${DB.avgProgressUnit(u.id)}%</div>
            <div style="font-size:10px;font-weight:700;color:#75777f;text-transform:uppercase;letter-spacing:.04em;">Conclusão</div>
          </div>
        </div>
        <div style="margin-bottom:4px;display:flex;justify-content:space-between;font-size:11px;color:#75777f;font-weight:600;text-transform:uppercase;letter-spacing:.04em;">
          <span>Performance</span><span>${DB.avgProgressUnit(u.id)}%</span>
        </div>
        <div class="pbar"><div class="pfill ${pcol(DB.avgProgressUnit(u.id))}" style="width:${DB.avgProgressUnit(u.id)}%;"></div></div>
        <div style="display:flex;align-items:center;justify-content:flex-end;margin-top:12px;">
          <span style="font-size:12px;color:var(--cor-primaria);font-weight:600;display:flex;align-items:center;gap:3px;">Ver detalhes <span class="ms" style="font-size:14px;">arrow_forward</span></span>
        </div>
      </div>
    </div>`).join("");
}

// ══ FUNCIONÁRIOS ══════════════════════════════════════════
function renderFuncionarios(el) {
  el.innerHTML = `<div class="anim-fade" style="max-width:1200px;margin:0 auto;">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:22px;">
      <div>
        <h2 style="font-size:22px;font-weight:700;color:var(--cor-primaria);">${isAdmin()?"Todos os Funcionários":"Minha Equipe"}</h2>
        <p style="color:#75777f;font-size:13px;margin-top:3px;">Acompanhe o progresso e gerencie a equipe</p>
      </div>
      ${isMgr()?`<button class="btn btn-p" onclick="openFuncForm(null)"><span class="ms">person_add</span>Cadastrar Funcionário</button>`:""}
    </div>
    <div style="background:#fff;padding:14px 18px;border-radius:14px;box-shadow:0 2px 8px rgba(0,8,30,.06);margin-bottom:18px;display:flex;gap:12px;flex-wrap:wrap;">
      <div style="flex:1;min-width:180px;position:relative;">
        <span class="ms" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#75777f;font-size:19px;">search</span>
        <input class="inp" id="srch-f" placeholder="Buscar por nome..." style="padding-left:42px;background:#f5f3f7;" oninput="renderFuncTable()"/>
      </div>
      <select class="inp" id="fil-c" onchange="renderFuncTable()" style="min-width:155px;background:#f5f3f7;">
        <option value="">Todos os cargos</option>
        ${Object.entries(CARGOS).map(([k,v])=>`<option value="${k}">${v.l}</option>`).join("")}
      </select>
    </div>
    <div class="tonal-card" style="border-radius:var(--raio);overflow:hidden;" id="func-tbl"></div>
  </div>`;
  renderFuncTable();
}

function renderFuncTable() {
  const el=$("func-tbl"); if(!el)return;
  const q=($("srch-f")?.value||"").toLowerCase();
  const fc=$("fil-c")?.value||"";
  let list=myTeam().filter(u=>
    (!q||(u.nome||"").toLowerCase().includes(q)||(u.email||"").toLowerCase().includes(q))&&
    (!fc||u.cargo===fc)
  );
  if(!list.length){
    el.innerHTML=`<div style="text-align:center;padding:60px;"><span class="ms" style="font-size:52px;color:#e4e2e5;">group</span><p style="color:#75777f;margin-top:12px;font-size:14px;">Nenhum funcionário encontrado</p></div>`;
    return;
  }
  el.innerHTML=`<table class="tbl">
    <thead><tr><th>Funcionário</th><th>Cargo</th><th>Unidade</th><th>Progresso</th><th>Ações</th></tr></thead>
    <tbody>${list.map(u=>`<tr>
      <td>${avName(u)}</td>
      <td>${badgeHTML(u.cargo)}</td>
      <td style="font-size:13px;color:#44464e;">${esc(u.unidadeNome||"—")}</td>
      <td>${progBar(u.progresso,"")}</td>
      <td><div style="display:flex;gap:6px;">
        <button class="btn btn-s" style="padding:5px 11px;font-size:12px;" onclick="openEmpProfile('${u.id}')">Ver Perfil</button>
        ${isMgr()?`<button class="btn-w" title="Editar" onclick="openFuncForm(null,'${u.id}')"><span class="ms" style="font-size:16px;color:var(--cor-primaria);">edit</span></button>`:""}
        ${isAdmin()?`<button class="btn-w" title="Excluir" style="color:#ba1a1a;" onclick="confirmDel('funcionario','${u.id}','${esc(u.nome)}')"><span class="ms" style="font-size:16px;">delete</span></button>`:""}
      </div></td>
    </tr>`).join("")}</tbody>
  </table>`;
}

// ══ TREINAMENTOS (admin) ══════════════════════════════════
function renderTreinamentos(el) {
  el.innerHTML=`<div class="anim-fade" style="max-width:1000px;margin:0 auto;">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:22px;">
      <div>
        <h2 style="font-size:22px;font-weight:700;color:var(--cor-primaria);">Treinamentos</h2>
        <p style="color:#75777f;font-size:13px;margin-top:3px;">Crie e gerencie módulos para sua equipe</p>
      </div>
      <button class="btn btn-p" onclick="openTrForm()"><span class="ms">add</span>Novo Treinamento</button>
    </div>
    <div id="tr-list" style="display:grid;gap:13px;"></div>
  </div>`;
  renderTrList();
}

function renderTrList() {
  const el=$("tr-list"); if(!el)return;
  const list=DB.treinamentos();
  if(!list.length){
    el.innerHTML=`<div class="tonal-card" style="padding:60px;text-align:center;border-radius:var(--raio);">
      <span class="ms" style="font-size:52px;color:#e4e2e5;">school</span>
      <p style="color:#75777f;margin-top:12px;font-size:14px;">Nenhum treinamento criado</p>
      <button class="btn btn-p" style="margin-top:16px;" onclick="openTrForm()"><span class="ms">add</span>Criar Primeiro Treinamento</button>
    </div>`; return;
  }
  el.innerHTML=list.map(t=>`
    <div class="tonal-card" style="padding:20px;border-radius:var(--raio);">
      <div style="display:flex;align-items:flex-start;gap:14px;">
        <div style="width:50px;height:50px;background:#d9e2ff;border-radius:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <span class="ms" style="color:var(--cor-primaria);font-size:24px;">school</span>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:8px;">
            <div>
              <div style="font-size:15px;font-weight:700;color:var(--cor-primaria);">${esc(t.titulo)}</div>
              <p style="font-size:13px;color:#75777f;margin-top:2px;">${esc(t.descricao||"—")}</p>
            </div>
            <div style="display:flex;gap:7px;flex-shrink:0;">
              <button class="btn btn-s" style="padding:6px 13px;font-size:12px;" onclick="openTrForm('${t.id}')"><span class="ms" style="font-size:15px;">edit</span>Editar</button>
              <button class="btn btn-r" style="padding:6px 10px;" onclick="confirmDel('treinamento','${t.id}','${esc(t.titulo)}')"><span class="ms" style="font-size:15px;">delete</span></button>
            </div>
          </div>
          <div style="display:flex;gap:7px;flex-wrap:wrap;align-items:center;">
            ${(t.cargos||[]).length ? t.cargos.map(c=>badgeHTML(c)).join("") : `<span class="badge b5">Todos os cargos</span>`}
            ${t.videoUrl?`<span style="background:#9ef3d6;color:#00513f;font-size:11px;font-weight:600;padding:2px 9px;border-radius:99px;">📹 Vídeo</span>`:""}
            ${t.perguntas?.length?`<span style="background:#d9e2ff;color:var(--cor-primaria);font-size:11px;font-weight:600;padding:2px 9px;border-radius:99px;">📝 ${t.perguntas.length} questão${t.perguntas.length>1?"ões":""}</span>`:""}
          </div>
        </div>
      </div>
    </div>`).join("");
}

// ══ MEUS TREINAMENTOS (funcionário) ══════════════════════
function renderMeuTreinamento(el) {
  const trs=myTrens(), done=trs.filter(t=>S.user.treinamentos?.[t.id]?.concluido).length;
  const p=pct(done,trs.length);
  el.innerHTML=`<div class="anim-fade" style="max-width:860px;margin:0 auto;">
    <div style="margin-bottom:22px;">
      <h2 style="font-size:22px;font-weight:700;color:var(--cor-primaria);">Meus Treinamentos</h2>
      <p style="color:#75777f;font-size:13px;margin-top:3px;margin-bottom:10px;">${done} de ${trs.length} concluídos</p>
      <div style="background:#fff;border-radius:12px;padding:14px;box-shadow:0 2px 8px rgba(0,8,30,.06);">
        <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#44464e;text-transform:uppercase;letter-spacing:.05em;margin-bottom:7px;">
          <span>Progresso Geral</span><span style="color:var(--cor-primaria);">${p}%</span>
        </div>
        <div class="pbar lg"><div class="pfill ${pcol(p)}" style="width:${p}%;"></div></div>
      </div>
    </div>
    <div style="display:grid;gap:12px;">
      ${trs.length===0 ? `<div class="tonal-card" style="padding:60px;text-align:center;border-radius:var(--raio);">
          <span class="ms" style="font-size:52px;color:#e4e2e5;">school</span>
          <p style="color:#75777f;margin-top:12px;font-size:14px;">Nenhum treinamento disponível para seu cargo</p>
        </div>` :
        trs.map(t=>{
          const ok=S.user.treinamentos?.[t.id]?.concluido, st=S.user.treinamentos?.[t.id];
          return `<div class="tonal-card" style="border-radius:var(--raio);cursor:pointer;overflow:hidden;" onclick="openTreinamento('${t.id}')">
            <div style="height:4px;background:${ok?"linear-gradient(90deg,#10b981,#9ef3d6)":"#e4e2e5"};"></div>
            <div style="padding:18px;display:flex;align-items:center;gap:14px;">
              <div style="width:52px;height:52px;border-radius:14px;background:${ok?"#9ef3d6":"#d9e2ff"};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <span class="ms ${ok?"f":""}" style="color:${ok?"#006b54":"var(--cor-primaria)"};font-size:26px;">${ok?"verified":"play_circle"}</span>
              </div>
              <div style="flex:1;">
                <h3 style="font-size:15px;font-weight:700;color:var(--cor-primaria);margin-bottom:3px;">${esc(t.titulo)}</h3>
                <p style="font-size:13px;color:#75777f;">${esc(t.descricao||"")}</p>
                <div style="display:flex;gap:7px;margin-top:7px;flex-wrap:wrap;align-items:center;">
                  ${ok?`<span style="background:#9ef3d6;color:#00513f;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;">✓ Concluído${st.pontuacao!==undefined?" · "+st.pontuacao+"%":""}</span>`:
                       `<span style="background:#d9e2ff;color:var(--cor-primaria);font-size:11px;font-weight:600;padding:2px 10px;border-radius:99px;">Disponível</span>`}
                  ${t.videoUrl?`<span style="font-size:12px;color:#75777f;">📹 Vídeo</span>`:""}
                  ${t.perguntas?.length?`<span style="font-size:12px;color:#75777f;">📝 Avaliação</span>`:""}
                </div>
              </div>
              <span class="ms" style="color:#c5c6cf;flex-shrink:0;">chevron_right</span>
            </div>
          </div>`;
        }).join("")}
    </div>
  </div>`;
}

// ══ PERFIL ════════════════════════════════════════════════
function renderPerfil(el) {
  const u=S.user;
  const trs=DB.treinamentos().filter(t=>!t.cargos||!t.cargos.length||t.cargos.includes(u.cargo));
  const done=trs.filter(t=>u.treinamentos?.[t.id]?.concluido).length;
  const p=pct(done,trs.length);
  el.innerHTML=`<div class="anim-fade" style="max-width:700px;margin:0 auto;">
    <div class="tonal-card" style="border-radius:20px;overflow:hidden;margin-bottom:16px;">
      <div style="height:90px;background:linear-gradient(135deg,var(--cor-primaria),#4c5e86);position:relative;">
        <div style="position:absolute;bottom:-38px;left:24px;">
          <div style="position:relative;cursor:pointer;" onclick="$('av-inp').click()">
            <div class="av" style="width:80px;height:80px;background:var(--cor-primaria);color:#fff;font-size:28px;border:4px solid #fff;box-shadow:0 4px 16px rgba(0,8,30,.2);">
              ${u.foto?`<img src="${u.foto}" style="width:100%;height:100%;object-fit:cover;"/>`:u.nome[0]}
            </div>
            <div style="position:absolute;bottom:2px;right:2px;background:var(--cor-primaria);border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;">
              <span class="ms" style="color:#fff;font-size:12px;">edit</span>
            </div>
          </div>
          <input type="file" id="av-inp" accept="image/*" style="display:none;" onchange="handleAv(this)"/>
        </div>
      </div>
      <div style="padding:50px 24px 24px;">
        <div style="font-size:20px;font-weight:700;color:var(--cor-primaria);margin-bottom:4px;">${esc(u.nome)}</div>
        ${badgeHTML(u.cargo)}
        ${(function(){
        const tema = DB.getTema();
        const empresa = tema.nomeEmpresa || "";
        const unidade = u.unidadeNome || "";
        if (!empresa && !unidade) return "";
        return `<p style="font-size:12px;color:#75777f;margin-top:4px;display:flex;align-items:center;gap:3px;">
          <span class="ms" style="font-size:13px;">corporate_fare</span>
          ${empresa ? `<b>${esc(empresa)}</b>` : ""}${empresa && unidade ? " — " : ""}${unidade ? esc(unidade) : ""}
        </p>`;
      })()}
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin:18px 0;">
          ${miniStat("school",trs.length,"Treinamentos")}${miniStat("check_circle",done,"Concluídos")}${miniStat("workspace_premium",p+"%","Progresso")}
        </div>
        <div style="margin-bottom:22px;">
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;font-weight:600;color:#44464e;text-transform:uppercase;letter-spacing:.05em;">
            <span>Progresso Geral</span><span style="color:var(--cor-primaria);">${p}%</span>
          </div>
          <div class="pbar lg"><div class="pfill ${pcol(p)}" style="width:${p}%;"></div></div>
        </div>
        <h3 style="font-size:13px;font-weight:700;color:var(--cor-primaria);margin-bottom:12px;text-transform:uppercase;letter-spacing:.06em;">Editar Informações</h3>
        <div style="display:grid;gap:11px;">
          <div><label class="lbl">Nome Completo</label><input class="inp" id="p-nome" value="${esc(u.nome||"")}"/></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:11px;">
            <div><label class="lbl">Telefone</label><input class="inp" id="p-tel" value="${esc(u.telefone||"")}" placeholder="(00) 00000-0000"/></div>
            <div><label class="lbl">Localização</label><input class="inp" id="p-loc" value="${esc(u.localizacao||"")}" placeholder="Bairro, Cidade"/></div>
          </div>
          <div><label class="lbl">Contato de Emergência</label><input class="inp" id="p-emerg" value="${esc(u.emergencia||"")}" placeholder="Nome — (00) 00000-0000"/></div>
          <div><label class="lbl">Nova Senha</label><input class="inp" id="p-senha" type="password" placeholder="Deixe em branco para manter"/></div>
        </div>
        <button class="btn btn-p" style="margin-top:16px;" onclick="saveProfile()"><span class="ms">save</span>Salvar Alterações</button>
      </div>
    </div>
    ${done>0?`<div class="tonal-card" style="padding:20px;border-radius:var(--raio);margin-bottom:16px;">
      <h3 style="font-size:14px;font-weight:700;color:var(--cor-primaria);margin-bottom:13px;display:flex;align-items:center;gap:7px;"><span class="ms" style="font-size:18px;">workspace_premium</span>Meus Certificados</h3>
      ${trs.filter(t=>u.treinamentos?.[t.id]?.concluido).map(t=>`
        <div style="display:flex;align-items:center;gap:12px;padding:12px;background:linear-gradient(135deg,#f5f3f7,#d9e2ff20);border-radius:11px;margin-bottom:8px;border-left:4px solid var(--cor-destaque);">
          <span style="font-size:28px;">🏆</span>
          <div style="flex:1;"><div style="font-size:14px;font-weight:600;color:var(--cor-primaria);">${esc(t.titulo)}</div>
            <div style="font-size:11px;color:#75777f;">${u.treinamentos[t.id].pontuacao!==undefined?"Pontuação: "+u.treinamentos[t.id].pontuacao+"% ":""} ${u.treinamentos[t.id].concluidoEm?"• "+new Date(u.treinamentos[t.id].concluidoEm).toLocaleDateString("pt-BR"):""}</div></div>
          <span style="background:#9ef3d6;color:#00513f;font-size:11px;font-weight:700;padding:3px 10px;border-radius:99px;">Aprovado</span>
        </div>`).join("")}
    </div>`:""}
    <button onclick="doLogout()" style="width:100%;padding:14px;background:#ffdad6;color:#ba1a1a;border:none;border-radius:13px;font-size:14px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s;" onmouseover="this.style.background=\'#ffb3ab\'" onmouseout="this.style.background=\'#ffdad6\'">
      <span class="ms">logout</span>Sair do Sistema
    </button>
  </div>`;
}

function saveProfile() {
  const nome=$("p-nome")?.value.trim();
  if(!nome){toast("Informe o nome.","err");return;}
  S.user.nome      = nome;
  S.user.telefone  = $("p-tel")?.value.trim()||"";
  S.user.localizacao=$("p-loc")?.value.trim()||"";
  S.user.emergencia=$("p-emerg")?.value.trim()||"";
  const s=$("p-senha")?.value; if(s) S.user.senha=s;
  DB.saveUser(S.user);
  buildNav();
  toast("Perfil atualizado!","ok");
}

function handleAv(inp) {
  const f=inp.files[0]; if(!f)return;
  const r=new FileReader();
  r.onload=e=>{ S.user.foto=e.target.result; DB.saveUser(S.user); buildNav(); nav("perfil"); toast("Foto atualizada!","ok"); };
  r.readAsDataURL(f);
}

// ══ CONFIGURAÇÕES ═════════════════════════════════════════
function renderConfig(el) {
  el.innerHTML=`<div class="anim-fade" style="max-width:760px;margin:0 auto;">
    <div style="margin-bottom:22px;">
      <h2 style="font-size:22px;font-weight:700;color:var(--cor-primaria);">Configurações</h2>
      <p style="color:#75777f;font-size:13px;margin-top:3px;">Gerencie usuários, unidades e treinamentos</p>
    </div>
    <div style="display:grid;gap:13px;">
      ${cfgCard("person_add","Criar Novo Usuário","Crie credenciais de acesso para gerentes e administradores","openCreateUser()","#d9e2ff","var(--cor-primaria)")}
      ${cfgCard("add_business","Nova Unidade","Cadastre uma nova unidade da empresa","openUnitForm()","#d9e2ff","var(--cor-primaria)")}
      ${cfgCard("add_circle","Novo Treinamento","Crie um módulo com vídeo e avaliação","openTrForm()","#9ef3d6","#006b54")}
      ${cfgCard("person_add","Cadastrar Funcionário","Adicione um funcionário com foto e informações","openFuncForm(null)","#F5E6C8","var(--cor-destaque)")}
      ${cfgCard("palette","Personalizar Tema","Altere cores, fontes e aparência do sistema","nav('personalizacao')","#e0e3e6","#5c5f61")}
      <div class="tonal-card" style="padding:18px;border-radius:14px;">
        <div style="display:flex;align-items:center;gap:13px;margin-bottom:14px;">
          <div style="background:#ffdad6;border-radius:10px;padding:10px;"><span class="ms" style="color:#ba1a1a;font-size:20px;">storage</span></div>
          <div style="flex:1;"><div style="font-size:15px;font-weight:700;color:#0a1f44;">Gerenciar Dados</div><div style="font-size:12px;color:#75777f;">localStorage — dados salvos neste navegador</div></div>
          <button class="btn btn-r" style="padding:7px 14px;font-size:12px;" onclick="confirmClear()">Limpar Tudo</button>
        </div>
        <div style="background:#f5f3f7;border-radius:10px;padding:13px;font-size:13px;color:#44464e;line-height:1.6;">
          Para Firebase com banco em nuvem, configure as credenciais em <code style="background:#d9e2ff;padding:2px 7px;border-radius:5px;">js/config.js</code>.
        </div>
      </div>
    </div>
  </div>`;
}

function confirmClear() {
  openModal(`<div style="padding:26px;text-align:center;">
    <span class="ms" style="font-size:48px;color:#ba1a1a;">warning</span>
    <h2 style="font-size:17px;font-weight:700;color:#0a1f44;margin:12px 0 8px;">Limpar todos os dados?</h2>
    <p style="color:#75777f;font-size:13px;margin-bottom:22px;">Todos os usuários (exceto admin demo), unidades e treinamentos serão apagados.</p>
    <div style="display:flex;gap:10px;justify-content:center;">
      <button class="btn btn-s" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-r" onclick="doClear()">Confirmar</button>
    </div>
  </div>`);
}
function doClear() {
  DB.clearAll();
  S.user = DB.byEmail(SYSTEM_CONFIG.demoEmail);
  closeModal();
  toast("Dados limpos!","ok");
  setTimeout(() => nav("dashboard"), 400);
}
