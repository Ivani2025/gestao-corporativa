// ============================================================
// js/modals.js — TODOS OS MODAIS DO SISTEMA
// ============================================================

// ══ UNIDADE (criar/editar) ════════════════════════════════
function openUnitForm(id) {
  const u = id ? DB.unidade(id) : {};
  openModal(`<div style="padding:24px;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
      <h2 style="font-size:17px;font-weight:700;color:var(--cor-primaria);">${id?"Editar":"Nova"} Unidade</h2>
      <button class="btn-w" onclick="closeModal()"><span class="ms">close</span></button>
    </div>
    <div style="display:grid;gap:12px;">
      <div><label class="lbl">Nome *</label>
        <div style="position:relative;"><span class="ms" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#75777f;font-size:18px;">corporate_fare</span>
          <input class="inp inp-icon" id="u-n" value="${esc(u.nome||"")}" placeholder="Ex: Unidade Centro"/></div>
      </div>
      <div style="display:grid;grid-template-columns:2fr 1fr;gap:11px;">
        <div><label class="lbl">Cidade *</label><input class="inp" id="u-c" value="${esc(u.cidade||"")}" placeholder="São Paulo"/></div>
        <div><label class="lbl">Estado</label><input class="inp" id="u-e" value="${esc(u.estado||"")}" placeholder="SP" maxlength="2" style="text-transform:uppercase;"/></div>
      </div>
      <div><label class="lbl">Endereço</label><input class="inp" id="u-end" value="${esc(u.endereco||"")}" placeholder="Rua, número, bairro"/></div>
    </div>
    <div style="display:flex;gap:10px;margin-top:18px;justify-content:flex-end;">
      <button class="btn btn-s" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-p" onclick="saveUnit('${id||""}')"><span class="ms">save</span>Salvar</button>
    </div>
  </div>`);
}

function saveUnit(id) {
  const n=$("u-n")?.value.trim(), c=$("u-c")?.value.trim();
  if(!n||!c){ toast("Nome e cidade são obrigatórios.","err"); return; }
  const u = {
    id: id || DB.uid(),
    nome: n, cidade: c,
    estado: $("u-e")?.value.trim().toUpperCase() || "",
    endereco: $("u-end")?.value.trim() || "",
    criadoEm: id ? (DB.unidade(id)?.criadoEm || new Date().toISOString()) : new Date().toISOString(),
  };
  DB.saveUnidade(u);
  closeModal();
  toast(id ? "Unidade atualizada!" : "Unidade criada!", "ok");
  if (S.page==="unidades") renderUnitCards($("srch-un")?.value||"");
}

// ══ DETALHE DA UNIDADE ════════════════════════════════════
function openUnitDetail(id) {
  const u=DB.unidade(id); if(!u) return;
  const funcs=DB.users().filter(f=>f.unidadeId===id);
  const grouped={};
  funcs.forEach(f=>{ const g=cg(f.cargo).l; if(!grouped[g])grouped[g]=[]; grouped[g].push(f); });
  openModal(`<div style="padding:26px;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
      <div style="width:48px;height:48px;background:#d9e2ff;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:var(--cor-primaria);">${esc(u.nome[0])}</div>
      <div style="flex:1;">
        <h2 style="font-size:17px;font-weight:700;color:var(--cor-primaria);">${esc(u.nome)}</h2>
        <p style="font-size:13px;color:#75777f;">${esc(u.cidade||"")}${u.estado?" — "+u.estado:""} ${u.endereco?"| "+u.endereco:""}</p>
      </div>
      <button class="btn-w" onclick="closeModal()"><span class="ms">close</span></button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:20px;">
      ${miniStat("group",funcs.length,"Funcionários")}
      ${miniStat("check_circle",funcs.filter(f=>(f.progresso||0)>=100).length,"Concluíram")}
      ${miniStat("trending_up",DB.avgProgressAll(funcs)+"%","Média")}
    </div>
    <h3 style="font-size:14px;font-weight:700;color:var(--cor-primaria);margin-bottom:12px;">Equipe por Cargo</h3>
    ${funcs.length===0 ? `<p style="color:#75777f;text-align:center;padding:20px;font-size:13px;">Nenhum funcionário nesta unidade</p>` :
      Object.entries(grouped).map(([grp,gf])=>`
        <div style="margin-bottom:14px;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <span style="font-size:13px;font-weight:700;color:var(--cor-primaria);">${esc(grp)}</span>
            <div style="flex:1;height:1px;background:#e4e2e5;"></div>
            <span style="font-size:11px;color:#75777f;">${gf.length} colaborador${gf.length>1?"es":""}</span>
          </div>
          ${gf.map(f=>`
            <div onclick="closeModal();openEmpProfile('${f.id}')" style="display:flex;align-items:center;gap:10px;padding:10px;border:1px solid #e4e2e5;border-left:4px solid var(--cor-primaria);border-radius:0 10px 10px 0;margin-bottom:6px;cursor:pointer;transition:all .2s;" onmouseover="this.style.background='#f5f3f7'" onmouseout="this.style.background='#fff'">
              <div class="av" style="width:36px;height:36px;background:#d9e2ff;color:var(--cor-primaria);font-size:13px;">${f.foto?`<img src="${f.foto}" style="width:100%;height:100%;object-fit:cover;"/>`:(f.nome||"U")[0]}</div>
              <div style="flex:1;"><div style="font-size:13px;font-weight:600;">${esc(f.nome)}</div></div>
              <div style="width:80px;">${progBar(f.progresso,"")}</div>
              <span class="ms" style="font-size:16px;color:#c5c6cf;">chevron_right</span>
            </div>`).join("")}
        </div>`).join("")}
    ${isAdmin()?`<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px;">
      <button class="btn btn-s" style="justify-content:center;" onclick="closeModal();openUnitForm('${id}')"><span class="ms">edit</span>Editar</button>
      <button class="btn btn-p" style="justify-content:center;" onclick="closeModal();openFuncForm('${id}')"><span class="ms">person_add</span>Adicionar</button>
    </div>`:""}
  </div>`);
}

// ══ PERFIL DO FUNCIONÁRIO ═════════════════════════════════
function openEmpProfile(id) {
  const u=DB.user(id); if(!u) return;
  const trs=DB.treinamentos().filter(t=>!t.cargos||!t.cargos.length||t.cargos.includes(u.cargo));
  const done=trs.filter(t=>u.treinamentos?.[t.id]?.concluido).length;
  const p=pct(done,trs.length);
  openModal(`<div style="padding:24px;">
    <div style="display:flex;justify-content:flex-end;margin-bottom:-12px;"><button class="btn-w" onclick="closeModal()"><span class="ms">close</span></button></div>
    <div style="text-align:center;margin-bottom:22px;">
      <div class="av" style="width:80px;height:80px;background:var(--cor-primaria);color:#fff;font-size:28px;margin:0 auto 12px;border:4px solid #d9e2ff;">
        ${u.foto?`<img src="${u.foto}" style="width:100%;height:100%;object-fit:cover;"/>`:u.nome[0]}
      </div>
      <h2 style="font-size:17px;font-weight:700;color:var(--cor-primaria);margin-bottom:6px;">${esc(u.nome)}</h2>
      ${badgeHTML(u.cargo)}
      ${u.unidadeNome?`<p style="font-size:12px;color:#75777f;margin-top:5px;">${esc(u.unidadeNome)}</p>`:""}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:18px;">
      ${miniStat("school",trs.length,"Treinamentos")}${miniStat("check_circle",done,"Concluídos")}${miniStat("workspace_premium",p+"%","Progresso")}
    </div>
    <div style="margin-bottom:18px;">
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;"><span style="font-weight:600;color:#44464e;">Progresso Geral</span><b style="color:var(--cor-primaria);">${p}%</b></div>
      <div class="pbar lg"><div class="pfill ${pcol(p)}" style="width:${p}%;"></div></div>
    </div>
    <h3 style="font-size:13px;font-weight:700;color:var(--cor-primaria);margin-bottom:9px;">Informações de Contato</h3>
    <div style="display:grid;gap:7px;margin-bottom:18px;">
      <!-- Telefone com link WhatsApp -->
      ${u.telefone
        ? `<div style="display:flex;align-items:center;gap:10px;padding:10px;background:#f5f3f7;border-radius:10px;">
            <span class="ms" style="color:var(--cor-primaria);font-size:18px;flex-shrink:0;">phone_iphone</span>
            <div style="flex:1;">
              <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#75777f;">WhatsApp / Telefone</div>
              <div style="font-size:14px;color:#1b1b1e;">${esc(u.telefone)}</div>
            </div>
            <a href="https://wa.me/55${u.telefone.replace(/\D/g,"")}" target="_blank" class="btn btn-g" style="padding:6px 12px;font-size:12px;gap:4px;text-decoration:none;">
              <span class="ms" style="font-size:14px;">chat</span>Chamar
            </a>
          </div>`
        : infoRow("phone_iphone","Telefone","Não informado")}
      <!-- Localização com link Maps -->
      ${u.localizacao
        ? `<div style="display:flex;align-items:center;gap:10px;padding:10px;background:#f5f3f7;border-radius:10px;">
            <span class="ms" style="color:var(--cor-primaria);font-size:18px;flex-shrink:0;">location_on</span>
            <div style="flex:1;">
              <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#75777f;">Localização / CEP</div>
              <div style="font-size:14px;color:#1b1b1e;">${esc(u.localizacao)}</div>
            </div>
            <a href="https://www.google.com/maps/search/${encodeURIComponent(u.localizacao)}" target="_blank" class="btn btn-p" style="padding:6px 12px;font-size:12px;gap:4px;text-decoration:none;">
              <span class="ms" style="font-size:14px;">map</span>Maps
            </a>
          </div>`
        : infoRow("location_on","Localização","Não informado")}
      <!-- Emergência: nome + telefone separados -->
      ${(u.emergenciaNome||u.emergenciaTel)
        ? `<div style="background:#fff3cd;border:1px solid #ffe08a;border-radius:10px;padding:10px;display:flex;align-items:center;gap:10px;">
            <span class="ms" style="color:#996600;font-size:18px;flex-shrink:0;">emergency</span>
            <div style="flex:1;">
              <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#996600;">Emergência</div>
              <div style="font-size:13px;font-weight:600;color:#1b1b1e;">${esc(u.emergenciaNome||"—")}</div>
              <div style="font-size:13px;color:#44464e;">${esc(u.emergenciaTel||"—")}</div>
            </div>
            ${u.emergenciaTel ? `<a href="tel:${u.emergenciaTel.replace(/\D/g,"")}" class="btn btn-r" style="padding:6px 12px;font-size:12px;gap:4px;text-decoration:none;">
              <span class="ms" style="font-size:14px;">call</span>Ligar
            </a>` : ""}
          </div>`
        : infoRow("emergency","Emergência","Não informado")}
      ${infoRow("mail","E-mail",u.email||"Não informado")}
    </div>
    <!-- Botão Editar — só para admins/gerentes -->
    ${isMgr() ? `<div style="display:flex;gap:10px;margin-bottom:18px;">
      <button class="btn btn-p" style="flex:1;justify-content:center;" onclick="closeModal();openFuncForm(null,'${u.id}')">
        <span class="ms">edit</span>Editar Funcionário
      </button>
    </div>` : ""}
    <h3 style="font-size:13px;font-weight:700;color:var(--cor-primaria);margin-bottom:9px;">Treinamentos</h3>
    ${trs.map(t=>{
      const st=u.treinamentos?.[t.id]; const ok=st?.concluido;
      return `<div style="display:flex;align-items:center;gap:9px;padding:9px;border:1px solid #e4e2e5;border-radius:10px;margin-bottom:5px;">
        <span class="ms ${ok?"f":""}" style="color:${ok?"#006b54":"#c5c6cf"};font-size:20px;">${ok?"check_circle":"radio_button_unchecked"}</span>
        <div style="flex:1;font-size:13px;font-weight:600;">${esc(t.titulo)}</div>
        ${ok?`<span style="background:#9ef3d6;color:#00513f;font-size:11px;font-weight:700;padding:2px 9px;border-radius:99px;">${st.pontuacao!==undefined?st.pontuacao+"% ":""}OK</span>`:""}
      </div>`;}).join("")||`<p style="color:#75777f;font-size:13px;padding:12px;text-align:center;">—</p>`}
  </div>`);
}

// ══ CADASTRO FUNCIONÁRIO (physical card style) ════════════════════
let _fotoPrev = null;

function openFuncForm(presetUnidadeId, editId) {
  const uns = DB.unidades();
  const ed  = editId ? DB.user(editId) : null;  // dados do funcionário a editar
  _fotoPrev = null;

  openModal(`<div style="padding:24px;max-height:90vh;overflow-y:auto;position:relative;">
    <div style="position:absolute;top:-40px;left:-40px;width:120px;height:120px;background:#d9e2ff;border-radius:50%;filter:blur(40px);opacity:.4;pointer-events:none;"></div>

    <!-- Header -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;position:relative;">
      <div>
        <h2 style="font-size:17px;font-weight:700;color:var(--cor-primaria);">${ed?"Editar":"Cadastrar"} Funcionário</h2>
        <p style="font-size:12px;color:#75777f;margin-top:2px;">${ed?"Atualize as informações do colaborador":"Preencha as informações do colaborador"}</p>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="background:#d9e2ff;color:var(--cor-primaria);padding:4px 10px;border-radius:99px;font-size:11px;font-weight:700;display:flex;align-items:center;gap:4px;">
          <span class="ms" style="font-size:13px;">verified_user</span>SISTEMA SEGURO
        </div>
        <button class="btn-w" onclick="closeModal()"><span class="ms">close</span></button>
      </div>
    </div>

    <!-- Foto -->
    <div style="display:flex;align-items:center;gap:18px;margin-bottom:20px;padding:16px;background:#f5f3f7;border-radius:14px;">
      <div id="fav" onclick="$('fav-i').click()" style="width:80px;height:80px;border-radius:16px;background:#efedf1;border:2px dashed #c5c6cf;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;position:relative;flex-shrink:0;transition:all .2s;" onmouseover="this.style.borderColor='var(--cor-primaria)'" onmouseout="this.style.borderColor='#c5c6cf'">
        ${ed?.foto
          ? `<img src="${ed.foto}" style="width:100%;height:100%;object-fit:cover;border-radius:14px;"/><div style="position:absolute;bottom:4px;right:4px;background:var(--cor-primaria);border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;"><span class="ms" style="color:#fff;font-size:11px;">edit</span></div>`
          : `<span class="ms" style="color:#75777f;font-size:26px;">add_a_photo</span><span style="font-size:10px;font-weight:700;text-transform:uppercase;color:#75777f;margin-top:3px;">Foto</span>`}
      </div>
      <input type="file" id="fav-i" accept="image/*" style="display:none;" onchange="prevFoto(this)"/>
      <div>
        <p style="font-size:14px;font-weight:600;color:var(--cor-primaria);">Foto do Funcionário</p>
        <p style="font-size:12px;color:#75777f;margin-top:2px;">Clique para ${ed?.foto?"alterar a foto":"adicionar uma foto"}.<br>JPG ou PNG, proporção 1:1.</p>
      </div>
    </div>

    <!-- Campos do formulário -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">

      <!-- Nome -->
      <div style="grid-column:1/-1;">
        <label class="lbl">Nome Completo *</label>
        <div style="position:relative;">
          <span class="ms" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#75777f;font-size:17px;line-height:1;">person</span>
          <input class="inp" id="f-n" value="${esc(ed?.nome||"")}" placeholder="Ex: Roberto Silva" style="padding-left:44px;"/>
        </div>
      </div>

      <!-- Telefone com máscara (00) 00000-0000 -->
      <div>
        <label class="lbl">WhatsApp / Telefone</label>
        <div style="position:relative;">
          <span class="ms" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#75777f;font-size:17px;line-height:1;">phone_iphone</span>
          <input class="inp" id="f-t" value="${esc(ed?.telefone||"")}" placeholder="(11) 99999-9999" maxlength="15" style="padding-left:44px;" oninput="maskPhone(this)"/>
        </div>
        ${ed?.telefone ? `<a href="https://wa.me/55${ed.telefone.replace(/\D/g,"")}" target="_blank" style="font-size:11px;color:#006b54;font-weight:600;display:flex;align-items:center;gap:3px;margin-top:4px;"><span class="ms" style="font-size:13px;">open_in_new</span>Abrir WhatsApp</a>` : ""}
      </div>

      <!-- CEP / Localização com link Maps -->
      <div>
        <label class="lbl">CEP / Localização</label>
        <div style="position:relative;">
          <span class="ms" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#75777f;font-size:17px;line-height:1;">location_on</span>
          <input class="inp" id="f-l" value="${esc(ed?.localizacao||"")}" placeholder="CEP ou Cidade - Estado" maxlength="60" style="padding-left:44px;" oninput="maskCep(this)"/>
        </div>
        ${ed?.localizacao ? `<a href="https://www.google.com/maps/search/${encodeURIComponent(ed.localizacao)}" target="_blank" style="font-size:11px;color:#0a1f44;font-weight:600;display:flex;align-items:center;gap:3px;margin-top:4px;"><span class="ms" style="font-size:13px;">open_in_new</span>Ver no Maps</a>` : ""}
      </div>

      <!-- Emergência: nome separado do telefone -->
      <div>
        <label class="lbl">Nome do Contato de Emergência</label>
        <div style="position:relative;">
          <span class="ms" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#75777f;font-size:17px;line-height:1;">emergency</span>
          <input class="inp" id="f-emg-nome" value="${esc(ed?.emergenciaNome||"")}" placeholder="Nome do familiar" style="padding-left:44px;"/>
        </div>
      </div>
      <div>
        <label class="lbl">Telefone de Emergência</label>
        <div style="position:relative;">
          <span class="ms" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#75777f;font-size:17px;line-height:1;">call</span>
          <input class="inp" id="f-emg-tel" value="${esc(ed?.emergenciaTel||"")}" placeholder="(11) 99999-9999" maxlength="15" style="padding-left:44px;" oninput="maskPhone(this)"/>
        </div>
      </div>

      <!-- E-mail -->
      <div style="grid-column:1/-1;">
        <label class="lbl">E-mail de Login *</label>
        <div style="position:relative;">
          <span class="ms" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#75777f;font-size:17px;line-height:1;">mail</span>
          <input class="inp" id="f-e" type="email" value="${esc(ed?.email||"")}" placeholder="funcionario@empresa.com" style="padding-left:44px;" ${ed?"readonly style='padding-left:44px;opacity:.7;background:#efedf1;'":""}/>
        </div>
        ${ed?`<p style="font-size:11px;color:#75777f;margin-top:3px;">E-mail não pode ser alterado após o cadastro</p>`:""}
      </div>

      <!-- Senha -->
      <div style="grid-column:1/-1;">
        <label class="lbl">${ed?"Nova Senha (deixe em branco para manter)":"Senha de Acesso *"}</label>
        <div style="position:relative;">
          <span class="ms" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#75777f;font-size:17px;line-height:1;">lock</span>
          <input class="inp" id="f-senha" type="password" placeholder="${ed?"Nova senha (opcional)":"Mínimo 4 caracteres"}" style="padding-left:44px;padding-right:44px;"/>
          <button class="btn-w" onclick="tPass('f-senha',this)" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);">
            <span class="ms" style="font-size:18px;">visibility</span>
          </button>
        </div>
        <p style="font-size:11px;color:#75777f;margin-top:3px;padding-left:2px;">Senha usada para entrar no sistema</p>
      </div>

      <!-- Cargo -->
      <div>
        <label class="lbl">Cargo *</label>
        <select class="inp" id="f-c">
          ${Object.entries(CARGOS).map(([k,v])=>`<option value="${k}" ${(ed?.cargo||"funcionario")===k?"selected":""}>${v.l}</option>`).join("")}
        </select>
      </div>

      <!-- Unidade -->
      <div>
        <label class="lbl">Unidade</label>
        <select class="inp" id="f-u">
          <option value="">— Selecionar —</option>
          ${uns.map(u=>`<option value="${u.id}" ${(ed?.unidadeId||presetUnidadeId)===u.id?"selected":""}>${esc(u.nome)}</option>`).join("")}
        </select>
      </div>

    </div>

    <!-- Botões -->
    <div style="display:flex;gap:10px;margin-top:20px;justify-content:flex-end;">
      <button class="btn btn-s" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-p" onclick="saveFunc('${editId||""}')">
        <span class="ms">${ed?"save":"person_add"}</span>${ed?"Salvar Alterações":"Cadastrar"}
      </button>
    </div>
  </div>`);
}

// Máscara de telefone
function maskPhone(inp) {
  let v = inp.value.replace(/\D/g,"");
  if(v.length>11) v=v.substr(0,11);
  if(v.length<=10) v=v.replace(/(\d{2})(\d{4})(\d{0,4})/,"($1) $2-$3");
  else              v=v.replace(/(\d{2})(\d{5})(\d{0,4})/,"($1) $2-$3");
  inp.value=v;
}

// Máscara de CEP
function maskCep(inp) {
  let v = inp.value.replace(/\D/g,"");
  if(v.length>8) v=v.substr(0,8);
  if(v.length>5) v=v.replace(/(\d{5})(\d{0,3})/,"$1-$2");
  inp.value=v;
}

function prevFoto(inp) {
  const f=inp.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=e=>{
    _fotoPrev=e.target.result;
    const av=$("fav"); if(!av) return;
    av.innerHTML=`<img src="${_fotoPrev}" style="width:100%;height:100%;object-fit:cover;border-radius:14px;"/>
      <div style="position:absolute;bottom:4px;right:4px;background:var(--cor-primaria);border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;">
        <span class="ms" style="color:#fff;font-size:11px;">edit</span></div>`;
  };
  r.readAsDataURL(f);
}

function saveFunc(editId) {
  const n         = $("f-n")?.value.trim();
  const email     = $("f-e")?.value.trim();
  const senha     = $("f-senha")?.value;
  const emgNome   = $("f-emg-nome")?.value.trim() || "";
  const emgTel    = $("f-emg-tel")?.value.trim() || "";
  const cargo     = $("f-c")?.value || "funcionario";
  const uid       = $("f-u")?.value || null;
  const un        = uid ? DB.unidade(uid) : null;
  const isEdit    = !!editId;
  const existing  = isEdit ? DB.user(editId) : null;

  // Validações
  if (!n) { toast("Informe o nome completo.","err"); return; }
  if (!isEdit && !email) { toast("Informe o e-mail de login.","err"); return; }
  if (!isEdit && (!senha || senha.length < 4)) { toast("A senha precisa ter pelo menos 4 caracteres.","err"); return; }
  if (!isEdit && DB.byEmail(email)) { toast("Esse e-mail já está cadastrado.","err"); return; }
  if (isEdit && senha && senha.length < 4) { toast("A nova senha precisa ter pelo menos 4 caracteres.","err"); return; }

  const u = {
    id:             isEdit ? editId : DB.uid(),
    nome:           n,
    email:          isEdit ? existing.email : email,
    senha:          (isEdit && !senha) ? existing.senha : senha,
    cargo:          cargo,
    telefone:       $("f-t")?.value.trim() || "",
    localizacao:    $("f-l")?.value.trim() || "",
    emergenciaNome: emgNome,
    emergenciaTel:  emgTel,
    // Mantém compatibilidade com campo antigo
    emergencia:     emgNome && emgTel ? `${emgNome} — ${emgTel}` : (emgNome || emgTel || ""),
    unidadeId:      uid,
    unidadeNome:    un?.nome || null,
    foto:           _fotoPrev || (isEdit ? existing.foto : null),
    progresso:      isEdit ? (existing.progresso || 0) : 0,
    treinamentos:   isEdit ? (existing.treinamentos || {}) : {},
    criadoEm:       isEdit ? (existing.criadoEm || new Date().toISOString()) : new Date().toISOString(),
  };

  DB.saveUser(u);
  _fotoPrev = null;
  closeModal();

  if (isEdit) {
    toast("Funcionário atualizado com sucesso!", "ok");
    if (S.user.id === editId) { S.user = u; buildNav(); }
    if (S.page === "funcionarios") renderFuncTable();
    return;
  }
  funcSuccess(n, cargo, email, senha);
}

function funcSuccess(nome, cargo, email, senha) {
  const cd = cg(cargo);
  openModal(`<div style="padding:28px;text-align:center;">
    <div style="width:76px;height:76px;background:#9ef3d6;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;" class="anim-check">
      <span class="ms f" style="color:#006b54;font-size:40px;">check_circle</span>
    </div>
    <h2 style="font-size:17px;font-weight:700;color:#0a1f44;margin-bottom:6px;">Cadastro Realizado!</h2>
    <p style="color:#75777f;font-size:13px;margin-bottom:18px;"><b>${esc(nome)}</b> foi cadastrado como <b>${cd.l}</b></p>
    <!-- Credenciais -->
    <div style="background:linear-gradient(135deg,var(--cor-primaria),#1a3460);border-radius:16px;padding:20px;margin-bottom:20px;text-align:left;color:#fff;">
      <div style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:12px;">Credenciais de Acesso</div>
      <div style="margin-bottom:8px;"><div style="font-size:10px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.05em;">E-mail</div><div style="font-size:13px;font-weight:600;">${esc(email)}</div></div>
      <div style="margin-bottom:12px;"><div style="font-size:10px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.05em;">Senha</div><div style="font-size:13px;font-weight:600;">${esc(senha)}</div></div>
      <span class="badge ${cd.b}">${cd.l}</span>
    </div>
    <p style="font-size:12px;color:#75777f;margin-bottom:18px;">Compartilhe as credenciais com o funcionário.</p>
    <div style="display:flex;gap:10px;justify-content:center;">
      <button class="btn btn-s" onclick="closeModal()">Fechar</button>
      <button class="btn btn-p" onclick="closeModal();openFuncForm(null)"><span class="ms">person_add</span>Cadastrar Outro</button>
    </div>
  </div>`);
  if (S.page==="funcionarios") renderFuncTable();
}

// ══ TREINAMENTO (criar/editar) ════════════════════════════
let _pergCount = 0;
function openTrForm(id) {
  const t=id?DB.treinamento(id):{}; _pergCount=(t.perguntas||[]).length;
  openModal(`<div style="padding:24px;max-height:88vh;overflow-y:auto;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
      <h2 style="font-size:17px;font-weight:700;color:var(--cor-primaria);">${id?"Editar":"Novo"} Treinamento</h2>
      <button class="btn-w" onclick="closeModal()"><span class="ms">close</span></button>
    </div>
    <div style="display:grid;gap:12px;">
      <div><label class="lbl">Título *</label><input class="inp" id="t-t" value="${esc(t.titulo||"")}" placeholder="Nome do treinamento"/></div>
      <div><label class="lbl">Descrição</label><textarea class="inp" id="t-d" rows="2" style="resize:vertical;" placeholder="Descreva o conteúdo...">${esc(t.descricao||"")}</textarea></div>
      <div><label class="lbl">URL do Vídeo</label>
        <div style="position:relative;"><span class="ms" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#75777f;font-size:17px;">smart_display</span>
          <input class="inp inp-icon" id="t-v" value="${esc(t.videoUrl||"")}" placeholder="https://youtube.com/watch?v=... ou MP4 direto"/></div>
      </div>
      <div>
        <label class="lbl">Visível para (vazio = todos os cargos)</label>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-top:5px;">
          ${Object.entries(CARGOS).map(([k,v])=>`
            <label style="display:flex;align-items:center;gap:7px;padding:8px 10px;border:1px solid #e4e2e5;border-radius:9px;cursor:pointer;font-size:13px;transition:all .2s;" onmouseover="this.style.borderColor='var(--cor-primaria)'" onmouseout="this.style.borderColor='#e4e2e5'">
              <input type="checkbox" value="${k}" id="tc-${k}" ${(t.cargos||[]).includes(k)?"checked":""} style="accent-color:var(--cor-primaria);"/>
              <span class="badge ${v.b}">${v.l}</span>
            </label>`).join("")}
        </div>
      </div>
      <div>
        <label class="lbl">Perguntas da Avaliação</label>
        <div id="pg-ctn">${(t.perguntas||[]).map((p,i)=>pergHTML(i,p)).join("")}</div>
        <button onclick="addPerg()" style="margin-top:8px;width:100%;background:#f5f3f7;border:1.5px dashed #c5c6cf;border-radius:10px;padding:10px;cursor:pointer;font-size:13px;color:var(--cor-primaria);font-weight:600;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .2s;" onmouseover="this.style.borderColor='var(--cor-primaria)'" onmouseout="this.style.borderColor='#c5c6cf'">
          <span class="ms" style="font-size:17px;">add_circle</span>Adicionar Pergunta
        </button>
      </div>
    </div>
    <div style="display:flex;gap:10px;margin-top:18px;justify-content:flex-end;">
      <button class="btn btn-s" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-p" onclick="saveTr('${id||""}')"><span class="ms">save</span>Salvar Treinamento</button>
    </div>
  </div>`);
}

function pergHTML(i, p) {
  return `<div style="border:1px solid #e4e2e5;border-radius:11px;padding:14px;margin-bottom:8px;" id="pg-${i}">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:9px;">
      <span style="font-size:11px;font-weight:700;color:#75777f;text-transform:uppercase;letter-spacing:.06em;">Pergunta ${i+1}</span>
      <button class="btn-w" style="color:#ba1a1a;" onclick="document.getElementById('pg-${i}').remove()"><span class="ms" style="font-size:16px;">close</span></button>
    </div>
    <input class="inp" id="pq-${i}" value="${esc(p?.pergunta||"")}" placeholder="Digite a pergunta..." style="margin-bottom:9px;"/>
    <div style="display:grid;gap:6px;">
      ${["A","B","C"].map((_,oi)=>`<div style="display:flex;align-items:center;gap:8px;">
        <input type="radio" name="cor-${i}" value="${oi}" ${(p?.correta||0)===oi?"checked":""} style="accent-color:var(--cor-sucesso);flex-shrink:0;" title="Marcar como correta"/>
        <input class="inp" id="po-${i}-${oi}" value="${esc(p?.opcoes?.[oi]||"")}" placeholder="Opção ${_}" style="flex:1;"/>
      </div>`).join("")}
    </div>
    <p style="font-size:11px;color:#75777f;margin-top:5px;">🟢 Clique no radio para marcar a resposta correta</p>
  </div>`;
}

function addPerg() {
  const c=$("pg-ctn"); if(!c) return;
  const d=document.createElement("div");
  d.innerHTML=pergHTML(_pergCount, null);
  c.appendChild(d.firstChild);
  _pergCount++;
}

function saveTr(id) {
  const titulo=$("t-t")?.value.trim();
  if(!titulo){ toast("Informe o título.","err"); return; }
  const cargos=Array.from(document.querySelectorAll("[id^='tc-']:checked")).map(el=>el.value);
  const perguntas=[];
  for(let i=0;i<50;i++){
    const pq=$("pq-"+i); if(!pq) break;
    const perg=pq.value.trim(); if(!perg) continue;
    const opcoes=[0,1,2].map(oi=>($("po-"+i+"-"+oi)?.value.trim()||""));
    let correta=0;
    for(let oi=0;oi<3;oi++){if(document.querySelector(`input[name="cor-${i}"][value="${oi}"]`)?.checked){correta=oi;break;}}
    if(opcoes.some(o=>o)) perguntas.push({pergunta:perg,opcoes,correta});
  }
  const t={
    id:id||DB.uid(), titulo,
    descricao:$("t-d")?.value.trim()||"", videoUrl:$("t-v")?.value.trim()||"",
    cargos, perguntas,
    criadoEm:id?(DB.treinamento(id)?.criadoEm||new Date().toISOString()):new Date().toISOString(),
  };
  DB.saveTreinamento(t);
  closeModal();
  toast(id?"Treinamento atualizado!":"Treinamento criado!","ok");
  if(S.page==="treinamentos") renderTrList();
}

// ══ CRIAR USUÁRIO ═════════════════════════════════════════
function openCreateUser() {
  const uns=DB.unidades();
  openModal(`<div style="padding:24px;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
      <h2 style="font-size:17px;font-weight:700;color:var(--cor-primaria);">Criar Novo Usuário</h2>
      <button class="btn-w" onclick="closeModal()"><span class="ms">close</span></button>
    </div>
    <div style="background:#d9e2ff;border-radius:10px;padding:12px;margin-bottom:15px;font-size:13px;color:var(--cor-primaria);display:flex;gap:8px;align-items:flex-start;">
      <span class="ms" style="font-size:18px;flex-shrink:0;">info</span>
      Cria credenciais de login. Para funcionários simples, use "Cadastrar Funcionário".
    </div>
    <div style="display:grid;gap:11px;">
      <div><label class="lbl">Nome *</label><input class="inp" id="nu-n" placeholder="Nome completo"/></div>
      <div><label class="lbl">E-mail (login) *</label><input class="inp" id="nu-e" placeholder="usuario@empresa.com"/></div>
      <div><label class="lbl">Senha *</label><input class="inp" id="nu-s" type="password" placeholder="Mínimo 4 caracteres"/></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:11px;">
        <div><label class="lbl">Cargo *</label>
          <select class="inp" id="nu-c">${Object.entries(CARGOS).map(([k,v])=>`<option value="${k}">${v.l}</option>`).join("")}</select>
        </div>
        <div><label class="lbl">Unidade</label>
          <select class="inp" id="nu-u">
            <option value="">Sem unidade</option>
            ${uns.map(u=>`<option value="${u.id}">${esc(u.nome)}</option>`).join("")}
          </select>
        </div>
      </div>
    </div>
    <div style="display:flex;gap:10px;margin-top:18px;justify-content:flex-end;">
      <button class="btn btn-s" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-p" onclick="createUser()"><span class="ms">person_add</span>Criar Usuário</button>
    </div>
  </div>`);
}

function createUser() {
  const n=$("nu-n")?.value.trim(), e=$("nu-e")?.value.trim(), s=$("nu-s")?.value;
  const cargo=$("nu-c")?.value||"funcionario", uid=$("nu-u")?.value||null;
  if(!n||!e||!s){ toast("Preencha todos os campos.","err"); return; }
  if(s.length<4){ toast("Senha muito curta (mín. 4).","err"); return; }
  if(DB.byEmail(e)){ toast("E-mail já cadastrado.","err"); return; }
  const un=uid?DB.unidade(uid):null;
  DB.saveUser({
    id:DB.uid(), nome:n, email:e, senha:s, cargo,
    unidadeId:uid, unidadeNome:un?.nome||null,
    foto:null, telefone:"", localizacao:"", emergencia:"",
    progresso:0, treinamentos:{}, criadoEm:new Date().toISOString(),
  });
  closeModal();
  // Mostra modal de confirmação com as credenciais
  const cd2 = cg(cargo);
  openModal(`<div style="padding:28px;text-align:center;">
    <div style="width:70px;height:70px;background:#9ef3d6;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;" class="anim-check">
      <span class="ms f" style="color:#006b54;font-size:36px;">check_circle</span>
    </div>
    <h2 style="font-size:16px;font-weight:700;color:#0a1f44;margin-bottom:5px;">Usuário Criado!</h2>
    <p style="color:#75777f;font-size:13px;margin-bottom:16px;"><b>${esc(n)}</b> pode acessar o sistema agora</p>
    <div style="background:linear-gradient(135deg,var(--cor-primaria),#1a3460);border-radius:14px;padding:18px;margin-bottom:18px;text-align:left;color:#fff;">
      <div style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:10px;">Credenciais</div>
      <div style="margin-bottom:7px;">
        <div style="font-size:10px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.05em;">E-mail</div>
        <div style="font-size:13px;font-weight:600;">${esc(e)}</div>
      </div>
      <div style="margin-bottom:10px;">
        <div style="font-size:10px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.05em;">Senha</div>
        <div style="font-size:13px;font-weight:600;">${esc(s)}</div>
      </div>
      <span class="badge ${cd2.b}">${cd2.l}</span>
    </div>
    <button class="btn btn-p" style="width:100%;justify-content:center;" onclick="closeModal()">Fechar</button>
  </div>`);
}

// ══ CONFIRMAR EXCLUSÃO ════════════════════════════════════
function confirmDel(type, id, nome) {
  const lbls={unidade:"Excluir Unidade",funcionario:"Remover Funcionário",treinamento:"Excluir Treinamento"};
  openModal(`<div style="padding:26px;text-align:center;">
    <span class="ms" style="font-size:48px;color:#ba1a1a;">warning</span>
    <h2 style="font-size:17px;font-weight:700;color:#0a1f44;margin:12px 0 7px;">${lbls[type]}?</h2>
    <p style="color:#75777f;font-size:13px;margin-bottom:22px;">Tem certeza que deseja remover <b>${esc(nome)}</b>?<br>Esta ação não pode ser desfeita.</p>
    <div style="display:flex;gap:10px;justify-content:center;">
      <button class="btn btn-s" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-r" onclick="doDel('${type}','${id}')">Confirmar</button>
    </div>
  </div>`);
}

function doDel(type, id) {
  if(type==="unidade")   { DB.deleteUnidade(id);     closeModal(); toast("Unidade excluída.");      if(S.page==="unidades")    renderUnitCards(""); }
  if(type==="funcionario"){ DB.deleteUser(id);         closeModal(); toast("Funcionário removido.");  renderFuncTable(); }
  if(type==="treinamento"){ DB.deleteTreinamento(id);  closeModal(); toast("Treinamento excluído."); renderTrList(); }
}

// ══ PLAYER DE TREINAMENTO ═════════════════════════════════
const _vW={}, _qa={};

function openTreinamento(id) {
  const t=DB.treinamento(id); if(!t)return;
  const done=S.user.treinamentos?.[id]?.concluido;
  const locked=t.videoUrl&&!_vW[id]&&!done;
  openModal(`<div style="padding:24px;max-height:88vh;overflow-y:auto;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;">
      <h2 style="font-size:16px;font-weight:700;color:var(--cor-primaria);flex:1;">${esc(t.titulo)}</h2>
      <button class="btn-w" onclick="closeModal()"><span class="ms">close</span></button>
    </div>
    ${done?`<div style="background:#9ef3d6;border-radius:12px;padding:13px;display:flex;align-items:center;gap:10px;margin-bottom:18px;">
      <span class="ms f" style="color:#006b54;font-size:28px;">verified</span>
      <div><div style="font-weight:700;color:#006b54;font-size:14px;">Treinamento Concluído!</div>
        <div style="font-size:12px;color:#00513f;">Pontuação: ${S.user.treinamentos[id].pontuacao!==undefined?S.user.treinamentos[id].pontuacao+"%":"—"}</div></div>
    </div>`:""}
    ${t.videoUrl?`<div style="margin-bottom:18px;">
      <div class="vplayer">
        ${t.videoUrl.match(/youtube|youtu\.be/)?
          `<iframe src="${ytEmbed(t.videoUrl)}" style="width:100%;height:100%;border:none;" allowfullscreen></iframe>
           <div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,8,30,.8));padding:12px 16px;border-radius:0 0 14px 14px;display:flex;justify-content:space-between;align-items:center;">
             <span style="color:rgba(255,255,255,.7);font-size:12px;display:flex;align-items:center;gap:5px;"><span class="ms" style="font-size:16px;">smart_display</span>YouTube</span>
             <button class="btn btn-g" style="padding:7px 14px;font-size:12px;" onclick="markWatched('${id}')">✓ Marcar como assistido</button>
           </div>`:
          `<video src="${esc(t.videoUrl)}" style="width:100%;height:100%;border-radius:14px;background:#000;" controls onended="markWatched('${id}')"></video>`}
      </div>
      ${!done&&locked?`<div style="display:flex;align-items:center;gap:6px;margin-top:6px;padding:8px 12px;background:#d9e2ff;border-radius:8px;">
        <span class="ms" style="color:var(--cor-primaria);font-size:17px;">lock</span>
        <p style="font-size:12px;color:var(--cor-primaria);font-weight:600;">Assista ao vídeo completo para liberar a avaliação</p>
      </div>`:""}</div>`:""}
    ${t.descricao?`<div style="background:#f5f3f7;border-radius:12px;padding:15px;margin-bottom:18px;font-size:14px;color:#1b1b1e;line-height:1.7;">${esc(t.descricao)}</div>`:""}
    ${t.perguntas?.length?`<div>
      <h3 style="font-size:14px;font-weight:700;color:var(--cor-primaria);margin-bottom:13px;display:flex;align-items:center;gap:7px;"><span class="ms" style="font-size:18px;">quiz</span>Avaliação — ${t.perguntas.length} questão${t.perguntas.length>1?"ões":""}</h3>
      <div id="quiz-c">${renderQuiz(t.perguntas,done?S.user.treinamentos[id].respostas:null,done)}</div>
      ${done?`<div style="background:#9ef3d6;border-radius:11px;padding:12px;text-align:center;font-weight:700;color:#006b54;margin-top:12px;">✓ Avaliação já realizada</div>`:
             `<button class="btn btn-p" id="btn-quiz" style="width:100%;justify-content:center;margin-top:14px;${locked?"opacity:.45;pointer-events:none;":""}" ${locked?"disabled":""} onclick="submitQuiz('${id}')"><span class="ms">send</span>Enviar Avaliação</button>`}
    </div>`:
    `<button class="btn ${done?"btn-s":"btn-g"}" style="width:100%;justify-content:center;${locked?"opacity:.45;pointer-events:none;":""}" ${locked||done?"disabled":""} onclick="concluirSemQuiz('${id}')">
      ${done?`<span class="ms f">verified</span> Concluído`:`<span class="ms">check_circle</span> Marcar como Concluído`}
    </button>`}
  </div>`);
}

function ytEmbed(url) {
  const m=url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m?`https://www.youtube.com/embed/${m[1]}?rel=0`:url;
}
function markWatched(id) {
  _vW[id]=true;
  const b=$("btn-quiz"); if(b){b.disabled=false;b.style.opacity="1";b.style.pointerEvents="auto";}
  const bc=$("btn-concl"); if(bc){bc.disabled=false;bc.style.opacity="1";bc.style.pointerEvents="auto";}
  toast("Vídeo assistido! Avaliação liberada ✓","ok");
}
function renderQuiz(pergs, respostas, ro) {
  return pergs.map((p,pi)=>`
    <div style="margin-bottom:18px;">
      <p style="font-size:14px;font-weight:600;color:#1b1b1e;margin-bottom:9px;">${pi+1}. ${esc(p.pergunta)}</p>
      <div style="display:grid;gap:7px;">
        ${p.opcoes.map((o,oi)=>{
          let cls="qopt";
          if(ro&&respostas?.[pi]===oi) cls+=oi===p.correta?" ok":" err";
          return `<div class="${cls}" id="qo-${pi}-${oi}" onclick="${ro?"":` selOpt(${pi},${oi})`}" style="${ro?"cursor:default;":""}">
            <span style="width:24px;height:24px;border-radius:50%;border:2px solid currentColor;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">${String.fromCharCode(65+oi)}</span>${esc(o)}
          </div>`;}).join("")}
      </div>
    </div>`).join("");
}
function selOpt(pi, oi) {
  document.querySelectorAll(`[id^="qo-${pi}-"]`).forEach(el=>el.classList.remove("sel"));
  document.getElementById(`qo-${pi}-${oi}`)?.classList.add("sel");
  _qa[`${pi}`]=oi;
}
function submitQuiz(tid) {
  const t=DB.treinamento(tid); if(!t?.perguntas?.length)return;
  let ac=0; const rs={};
  t.perguntas.forEach((p,i)=>{ const r=_qa[`${i}`]; rs[i]=r; if(r===p.correta)ac++; });
  const pt=Math.round((ac/t.perguntas.length)*100);
  saveProgress(tid,{concluido:true,pontuacao:pt,respostas:rs,concluidoEm:new Date().toISOString()});
  closeModal(); showCert(t.titulo,pt);
}
function concluirSemQuiz(tid) {
  saveProgress(tid,{concluido:true,concluidoEm:new Date().toISOString()});
  closeModal(); toast("Treinamento concluído! 🎉","ok");
  nav(S.page);
}
function saveProgress(tid, data) {
  if(!S.user.treinamentos) S.user.treinamentos={};
  S.user.treinamentos[tid]=data;
  recalcProg();
  DB.saveUser(S.user);
}
function showCert(titulo, pt) {
  openModal(`<div style="padding:26px;">
    <div class="cert">
      <div style="position:relative;z-index:1;">
        <div style="font-size:42px;margin-bottom:12px;">🏆</div>
        <div style="font-size:11px;font-weight:700;letter-spacing:.16em;color:rgba(255,255,255,.5);text-transform:uppercase;margin-bottom:8px;">Certificado de Conclusão</div>
        <div style="font-size:20px;font-weight:700;color:#fff;margin-bottom:6px;">${esc(titulo)}</div>
        <div style="font-size:36px;font-weight:800;color:#82d7ba;margin-bottom:8px;">${pt}%</div>
        <div style="font-size:14px;color:rgba(255,255,255,.65);">${esc(S.user.nome)}</div>
        <div style="font-size:12px;color:rgba(255,255,255,.4);margin-top:3px;">${new Date().toLocaleDateString("pt-BR")}</div>
      </div>
    </div>
    <div style="text-align:center;margin-top:22px;">
      <p style="color:#75777f;font-size:14px;margin-bottom:16px;">Parabéns! Treinamento concluído com sucesso.</p>
      <button class="btn btn-g" onclick="closeModal();nav('meu-treinamento');" style="margin:0 auto;"><span class="ms">arrow_forward</span>Continuar</button>
    </div>
  </div>`);
}
