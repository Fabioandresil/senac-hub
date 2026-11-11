/* Hub Senac - DF — interações + renderização (vanilla JS, sem backend) */
(function(){
  "use strict";
  var D = window.HubData;

  /* ---------- ícones ---------- */
  var IC = {
   calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
   user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
   heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/>',
   msg:'<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/>',
   arrow:'<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
   back:'<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
   code:'<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
   ext:'<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
   doc:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
   share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>',
   left:'<path d="M15 18l-6-6 6-6"/>', right:'<path d="M9 18l6-6-6-6"/>',
   plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
   check:'<path d="M20 6L9 17l-5-5"/>',
   folder:'<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
   clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
   award:'<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
   shieldcheck:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
   x:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
   edit:'<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/>',
   trash:'<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>'
  };
  function svg(n,cls){ return '<svg class="'+(cls||'')+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+IC[n]+'</svg>'; }

  var GRAD = {'IA':'linear-gradient(135deg,#6d5bd0,#9179f2)','ADS':'linear-gradient(135deg,#2f6dd0,#5296ea)',
    'Gestão de TI':'linear-gradient(135deg,#12876a,#25b58e)','Segurança da Informação':'linear-gradient(135deg,#d9682f,#efa13f)'};
  var CODE = {'IA':'IA','ADS':'ADS','Gestão de TI':'TI','Segurança da Informação':'SEG'};
  function grad(t){ return GRAD[t]||'linear-gradient(135deg,#4a5a78,#6b7b98)'; }
  function code(t){ return CODE[t]||(t||'?').slice(0,3).toUpperCase(); }
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function statusPill(s){ var c=(s==='Ativo')?'st-ativo':'st-concluido'; return '<span class="pill-status '+c+'">'+s+'</span>'; }

  /* =================== HUB (frontpage) =================== */
  var hubFilter='all', hubQuery='';
  function coverInner(p){
    var src=p.photo||p.img;
    if(src){
      var onerr=(p.photo&&p.img)?' onerror="this.onerror=null;this.src=\''+p.img+'\'"':'';
      return '<img src="'+src+'"'+onerr+' alt="" loading="lazy"><span class="cover-shade"></span><span class="tag">'+esc(p.tag)+'</span>'+statusPill(p.status);
    }
    return '<span class="tag">'+esc(p.tag)+'</span>'+statusPill(p.status)+'<span class="mono">'+code(p.tag)+'</span>';
  }
  function cardHTML(p){
    var hasImg=!!(p.img||p.photo);
    return '<div class="card" data-act="open" data-id="'+p.id+'" data-turma="'+esc(p.tag)+'">'
      +'<div class="card-cover'+(hasImg?' has-img':'')+'"'+(hasImg?'':' style="background:'+grad(p.tag)+'"')+'>'+coverInner(p)+'</div>'
      +'<div class="card-body">'
        +'<div class="card-meta">'+svg('calendar')+'<span>'+p.year+'</span><span class="dot"></span>'+svg('user')+'<span>'+esc(p.author)+'</span></div>'
        +'<h3>'+esc(p.title)+'</h3><p>'+esc(p.desc)+'</p>'
        +'<div class="card-foot"><div class="stats">'
          +'<button class="stat'+(p.liked?' liked':'')+'" data-act="like" data-id="'+p.id+'">'+svg('heart')+'<span>'+p.likes+'</span></button>'
          +'<span class="stat">'+svg('msg')+' '+p.comments+'</span>'
        +'</div><span class="ver">Ver '+svg('arrow')+'</span></div>'
      +'</div></div>';
  }
  function renderHub(){
    var grid=document.getElementById('grid'); if(!grid) return;
    var q=hubQuery.trim().toLowerCase();
    var list=D.all().filter(function(p){
      var okT=(hubFilter==='all'||p.tag===hubFilter);
      var okQ=(!q||(p.title+' '+p.tag+' '+p.author+' '+p.desc).toLowerCase().indexOf(q)>=0);
      return okT&&okQ;
    });
    grid.innerHTML = list.length? list.map(cardHTML).join('') :
      '<p style="color:var(--muted);grid-column:1/-1">Nenhum projeto encontrado.</p>';
    var c=document.getElementById('count'); if(c) c.textContent=list.length+' projeto'+(list.length===1?'':'s');
  }

  /* =================== DETALHE =================== */
  function param(n){ var m=new RegExp('[?&]'+n+'=([^&]+)').exec(location.search); return m?decodeURIComponent(m[1]):null; }
  function renderDetail(){
    var box=document.getElementById('detail'); if(!box) return;
    var p=D.get(param('id')) || D.all()[0];
    if(!p){ box.innerHTML='<p>Projeto não encontrado.</p>'; return; }
    document.title=p.title+' — Hub Senac - DF';
    var h=document.querySelector('.pagehead h1'); if(h) h.textContent=p.title;
    var lk=p.links||{};
    var links=''
      +(lk.code?'<a class="chip-link" href="#" onclick="return false">'+svg('code')+' Repositório GitHub</a>':'')
      +(lk.sys ?'<a class="chip-link" href="#" onclick="return false">'+svg('ext')+' Sistema publicado</a>':'')
      +(lk.doc ?'<a class="chip-link" href="#" onclick="return false">'+svg('doc')+' Documentação</a>':'');
    if(!links) links='<span style="color:var(--muted-2);font-size:13px">Nenhum artefato anexado ainda.</span>';
    var tl=(p.timeline||[]).map(function(t){
      var d={done:'tl-done',active:'tl-active',todo:'tl-todo'}[t.state]||'tl-todo';
      var st={done:'concluído',active:'em andamento',todo:'pendente'}[t.state]||'';
      return '<li><span class="tl-dot '+d+'"></span><span class="tl-text"><b>'+esc(t.label)+'</b><span>'+esc(t.date)+' · '+st+'</span></span></li>';
    }).join('');
    var team=(p.team||[]).map(function(m){return '<span>'+esc(m)+'</span>';}).join('');
    var hsrc=p.photo||p.img;
    var honerr=(p.photo&&p.img)?' onerror="this.onerror=null;this.src=\''+p.img+'\'"':'';
    var hero = hsrc
      ? '<div class="detail-hero has-img"><img src="'+hsrc+'"'+honerr+' alt=""><span class="cover-shade"></span></div>'
      : '<div class="detail-hero" style="background:'+grad(p.tag)+'"><span class="mono">'+code(p.tag)+'</span></div>';
    box.innerHTML =
      '<a class="btn btn-ghost" href="index.html" style="margin-bottom:20px">'+svg('back')+' Voltar ao Hub</a>'
      + hero
      +'<div class="meta-row">'
        +'<div class="meta-item"><div class="k">Turma</div><div class="v">'+esc(p.tag)+' · '+p.year+'</div></div>'
        +'<div class="meta-item"><div class="k">Status</div><div class="v">'+p.status+'</div></div>'
        +'<div class="meta-item"><div class="k">Equipe</div><div class="v">'+(p.team?p.team.length:0)+' integrantes</div></div>'
        +'<div class="meta-item"><div class="k">Orientador</div><div class="v">'+esc(p.orientador||'—')+'</div></div>'
      +'</div>'
      +'<div class="detail-grid"><div>'
        +'<div class="panel"><h3>Resumo do projeto</h3><p style="margin:0;color:var(--muted);font-size:14.5px;line-height:1.65">'+esc(p.desc)+'</p></div>'
        +'<div class="panel"><h3>Artefatos e links</h3><div class="chip-links">'+links+'</div></div>'
        +'<div class="panel"><h3>Linha do tempo</h3><ul class="timeline">'+tl+'</ul></div>'
      +'</div><div>'
        +'<div class="panel"><h3>'+esc(p.title)+'</h3>'
          +'<div style="display:flex;gap:10px;margin-bottom:16px">'
            +'<button class="btn btn-primary" style="flex:1" data-act="like" data-id="'+p.id+'">'+svg('heart')+' <span>'+p.likes+'</span></button>'
            +'<button class="btn btn-ghost" style="flex:1" data-act="follow" data-id="'+p.id+'">'+svg('share')+' <span>'+(p.following?'Seguindo':'Seguir')+'</span></button>'
          +'</div>'
          +'<div class="card-meta" style="margin-bottom:10px">'+svg('calendar')+'<span>Publicado em '+p.year+'</span></div>'
          +'<h3 style="font-size:13px;margin:14px 0 8px">Equipe</h3>'
          +'<div style="display:flex;flex-direction:column;gap:8px;font-size:13.5px;color:var(--navy)">'+team+'</div>'
        +'</div>'
      +'</div></div>';
  }

  /* =================== PAINEL =================== */
  function renderPainel(){
    var body=document.getElementById('painel-body'); if(!body) return;
    var ps=D.all();
    var ativos=ps.filter(function(p){return p.status==='Ativo';}).length;
    var concl=ps.filter(function(p){return p.status==='Concluído';}).length;
    var aguard=ps.filter(function(p){return !p.published;}).length;
    set('m-total',ps.length); set('m-ativos',ativos); set('m-concl',concl); set('m-aguard',aguard);
    body.innerHTML=ps.map(function(p){
      var scls=(p.status==='Ativo')?'st-ativo':'st-concluido';
      var barc=(p.status==='Concluído')?'#1f9d68':'#e8792b';
      var pub=p.published?'<span class="badge-pub yes">Publicado</span>'
        :'<button class="badge-pub no" data-act="approve" data-id="'+p.id+'" style="cursor:pointer;border:none">Aprovar</button>';
      return '<tr><td><b>'+esc(p.title)+'</b></td><td>'+esc(p.tag)+'</td>'
        +'<td><span class="pill-status '+scls+'" style="position:static">'+p.status+'</span></td>'
        +'<td><span class="mini-bar"><span class="f" style="width:'+p.progress+'%;background:'+barc+'"></span></span>'+p.progress+'%</td>'
        +'<td>'+pub+'</td></tr>';
    }).join('');
  }
  function set(id,v){ var e=document.getElementById(id); if(e) e.textContent=v; }

  /* =================== BIBLIOTECA =================== */
  var libFilter='all';
  function renderLib(){
    var body=document.getElementById('lib-body'); if(!body) return;
    var ps=D.all().filter(function(p){return libFilter==='all'||p.tag===libFilter;});
    body.innerHTML=ps.map(function(p){
      var scls=(p.status==='Ativo')?'st-ativo':'st-concluido';
      function chip(on,txt){ return '<span class="art-chip'+(on?'':' off')+'">'+txt+'</span>'; }
      var lk=p.links||{};
      return '<tr><td><b>'+esc(p.title)+'</b></td><td>'+esc(p.tag)+'</td><td>'+p.year+'</td>'
        +'<td><span class="pill-status '+scls+'" style="position:static">'+p.status+'</span></td>'
        +'<td>'+chip(lk.code,'Código')+chip(lk.sys,'Sistema')+chip(lk.doc,'Documento')+'</td></tr>';
    }).join('');
  }

  /* =================== KANBAN =================== */
  var COL_LABEL={todo:'A fazer',doing:'Fazendo',done:'Concluído'};
  var COL_ORDER=['todo','doing','done'];
  function taskHTML(t,col){
    var i=COL_ORDER.indexOf(col);
    var L='<button class="move left" data-act="move" data-id="'+t.id+'" data-col="'+col+'" data-dir="-1"'+(i===0?' disabled':'')+'>'+svg('left')+'</button>';
    var R='<button class="move right" data-act="move" data-id="'+t.id+'" data-col="'+col+'" data-dir="1"'+(i===2?' disabled':'')+'>'+svg('right')+'</button>';
    return '<div class="task"><div class="t">'+esc(t.t)+'</div><div class="task-foot">'
      +'<span class="task-owner"><span class="av">'+esc(t.av)+'</span>'+esc(t.owner)+'</span>'
      +'<span class="task-moves">'+L+R+'</span></div></div>';
  }
  function renderKanban(){
    var board=document.getElementById('board'); if(!board) return;
    var k=D.kanban();
    board.innerHTML=COL_ORDER.map(function(col){
      var tasks=k[col]||[];
      return '<div class="col"><div class="col-head">'+COL_LABEL[col]+' <span class="count">'+tasks.length+'</span></div>'
        +'<div class="col-tasks">'+tasks.map(function(t){return taskHTML(t,col);}).join('')+'</div></div>';
    }).join('');
  }

  /* =================== MEUS PROJETOS (visão do aluno) =================== */
  function manageCardHTML(p){
    var pill='<span class="pill-status '+(p.status==='Ativo'?'st-ativo':'st-concluido')+'" style="position:static">'+p.status+'</span>';
    return '<div class="manage-card">'
      +'<div class="mc-badge" style="background:'+grad(p.tag)+'">'+code(p.tag)+'</div>'
      +'<div class="mc-main">'
        +'<div class="card-meta">'+svg('calendar')+'<span>'+p.year+'</span><span class="dot"></span><span>'+esc(p.tag)+'</span><span class="dot"></span>'+pill+'</div>'
        +'<h3>'+esc(p.title)+'</h3>'
        +'<div class="mc-prog"><span class="mini-bar"><span class="f" style="width:'+p.progress+'%;background:'+(p.status==='Concluído'?'#1f9d68':'#e8792b')+'"></span></span><span class="pct" style="font-size:12.5px">'+p.progress+'%</span></div>'
      +'</div>'
      +'<div class="mc-actions">'
        +'<a class="btn btn-ghost btn-sm" data-act="open" data-id="'+p.id+'">'+svg('ext')+' Abrir</a>'
        +'<button class="btn btn-ghost btn-sm" data-act="edit" data-id="'+p.id+'">'+svg('edit')+' Alterar</button>'
        +'<button class="btn btn-danger btn-sm" data-act="del" data-id="'+p.id+'">'+svg('trash')+' Excluir</button>'
      +'</div></div>';
  }
  function renderMeus(){
    var box=document.getElementById('meus-grid'); if(!box) return;
    var list=D.mine();
    box.innerHTML = list.length ? list.map(manageCardHTML).join('')
      : '<div class="empty">Você ainda não faz parte de nenhum projeto. Use <b>Novo Projeto</b> para criar o primeiro.</div>';
    var c=document.getElementById('meus-count'); if(c) c.textContent=list.length+' projeto'+(list.length===1?'':'s');
  }

  /* =================== MODAL (criar / editar) =================== */
  var editingId=null;
  function openModal(id){
    editingId = id||null;
    var m=document.getElementById('modal'); if(!m) return;
    var t=document.getElementById('np-title'), tag=document.getElementById('np-tag'),
        st=document.getElementById('np-status'), d=document.getElementById('np-desc');
    var tt=document.getElementById('modal-title'), sl=document.getElementById('modal-save-label');
    var err=document.getElementById('np-err'); if(err) err.style.display='none';
    if(editingId){
      var p=D.get(editingId);
      if(t) t.value=p.title; if(tag) tag.value=p.tag; if(st) st.value=p.status; if(d) d.value=p.desc;
      if(tt) tt.textContent='Editar projeto'; if(sl) sl.textContent='Salvar alterações';
    }else{
      if(t) t.value=''; if(tag) tag.value='ADS'; if(st) st.value='Ativo'; if(d) d.value='';
      if(tt) tt.textContent='Novo projeto'; if(sl) sl.textContent='Publicar projeto';
    }
    m.classList.add('show'); if(t) t.focus();
  }
  function closeModal(){ var m=document.getElementById('modal'); if(m) m.classList.remove('show'); editingId=null; }
  function rerender(){ if(document.getElementById('grid')) renderHub(); if(document.getElementById('meus-grid')) renderMeus(); if(document.getElementById('painel-body')) renderPainel(); }
  function saveModal(){
    var title=(document.getElementById('np-title')||{}).value||'';
    var tag=(document.getElementById('np-tag')||{}).value||'ADS';
    var status=(document.getElementById('np-status')||{}).value||'Ativo';
    var desc=(document.getElementById('np-desc')||{}).value||'';
    if(!title.trim()){ var e=document.getElementById('np-err'); if(e) e.style.display='block'; return; }
    if(editingId){
      D.update(editingId,{title:title.trim(), tag:tag, status:status, desc:desc.trim()||'—'});
    }else{
      D.add({ title:title.trim(), tag:tag, status:status, year:'2026', author:'Fabio S.',
        img:'assets/img/d-'+(CODE[tag]||'ADS')+'.svg',
        likes:0, comments:0, liked:false, following:false, published:false, progress:5, mine:true,
        desc:desc.trim()||'Projeto criado no protótipo.', orientador:'Prof. Jean Lima',
        team:['Fabio S. · líder'], links:{code:false,sys:false,doc:false},
        timeline:[{label:'Sprint 1 — Início', date:'2026', state:'active'}] });
      hubFilter='all'; hubQuery=''; var q=document.getElementById('q'); if(q) q.value='';
      document.querySelectorAll('[data-act="chip"]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-turma')==='all'); });
    }
    closeModal(); rerender();
  }

  /* ---------- perfil (Entrar como) na sidebar ---------- */
  var ROLE_KEY='hubsenacdf_role';
  var ROLE_LABEL={aluno:'Aluno · ADS', professor:'Professor', coordenacao:'Coordenação'};
  function getRole(){ try{ return localStorage.getItem(ROLE_KEY)||'aluno'; }catch(e){ return 'aluno'; } }
  function setRole(r){ try{ localStorage.setItem(ROLE_KEY,r); }catch(e){} }
  function applyRole(){
    var r=getRole();
    document.querySelectorAll('.role-btn').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-role')===r); });
    var rl=document.getElementById('sb-role'); if(rl) rl.textContent=ROLE_LABEL[r]||'Aluno · ADS';
    document.querySelectorAll('[data-role-only]').forEach(function(el){
      if(el.classList.contains('active')){ el.style.display=''; return; }  // não esconde a página atual
      var allowed=el.getAttribute('data-role-only').split(' ');
      el.style.display = allowed.indexOf(r)>=0 ? '' : 'none';
    });
  }

  /* ---------- globais usados por HTML estático ---------- */
  window.toggleSidebar=function(){ var s=document.querySelector('.sidebar'),o=document.querySelector('.overlay'); if(s)s.classList.toggle('open'); if(o)o.classList.toggle('show'); };
  window.selPerfil=function(btn){ document.querySelectorAll('.perfil-btn').forEach(function(b){b.classList.remove('active');}); btn.classList.add('active'); window.__perfil=btn.getAttribute('data-perfil'); };
  window.entrar=function(ev){ if(ev)ev.preventDefault(); var p=window.__perfil||'aluno'; setRole(p); location.href=(p==='coordenacao')?'painel.html':'gestao.html'; };

  /* ---------- delegação de cliques ---------- */
  document.addEventListener('click', function(ev){
    var el=ev.target.closest('[data-act]'); if(!el) return;
    var act=el.getAttribute('data-act');
    if(act==='like'){ ev.preventDefault(); ev.stopPropagation(); D.toggleLike(el.getAttribute('data-id'));
      if(document.getElementById('grid')) renderHub(); if(document.getElementById('detail')) renderDetail(); return; }
    if(act==='open'){ location.href='projeto.html?id='+el.getAttribute('data-id'); return; }
    if(act==='follow'){ ev.preventDefault(); D.toggleFollow(el.getAttribute('data-id')); renderDetail(); return; }
    if(act==='chip'){ hubFilter=el.getAttribute('data-turma');
      document.querySelectorAll('[data-act="chip"]').forEach(function(b){b.classList.remove('active');}); el.classList.add('active'); renderHub(); return; }
    if(act==='libchip'){ libFilter=el.getAttribute('data-turma');
      document.querySelectorAll('[data-act="libchip"]').forEach(function(b){b.classList.remove('active');}); el.classList.add('active'); renderLib(); return; }
    if(act==='approve'){ D.approve(el.getAttribute('data-id')); renderPainel(); return; }
    if(act==='role'){ setRole(el.getAttribute('data-role')); applyRole(); return; }
    if(act==='new'){ openModal(); return; }
    if(act==='edit'){ openModal(el.getAttribute('data-id')); return; }
    if(act==='del'){ var pid=el.getAttribute('data-id'), pp=D.get(pid);
      if(pp && confirm('Excluir o projeto "'+pp.title+'"?\nEsta ação não pode ser desfeita.')){ D.remove(pid); rerender(); } return; }
    if(act==='modal-close'){ closeModal(); return; }
    if(act==='modal-save'){ saveModal(); return; }
    if(act==='addtask'){ var t=prompt('Título da nova tarefa:'); if(t&&t.trim()){ D.addTask(t.trim()); renderKanban(); } return; }
    if(act==='move'){
      var id=el.getAttribute('data-id'), from=el.getAttribute('data-col'), dir=parseInt(el.getAttribute('data-dir'),10);
      var to=COL_ORDER[COL_ORDER.indexOf(from)+dir]; if(!to) return;
      D.moveTask(id,from,to); renderKanban(); return;
    }
  });

  /* ---------- init por página ---------- */
  document.addEventListener('DOMContentLoaded', function(){
    var page=document.body.getAttribute('data-page');
    applyRole();
    var q=document.getElementById('q'); if(q){ q.addEventListener('input', function(){ hubQuery=q.value; renderHub(); }); }
    if(page==='hub') renderHub();
    else if(page==='detalhe') renderDetail();
    else if(page==='painel') renderPainel();
    else if(page==='biblioteca') renderLib();
    else if(page==='kanban') renderKanban();
    else if(page==='meus') renderMeus();
  });
})();
