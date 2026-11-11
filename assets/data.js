/* ===================================================================
   Hub Senac - DF — camada de dados (sem backend)
   Fonte única de verdade, persistida no navegador (localStorage).
   Todas as telas leem/escrevem daqui, então o que muda numa tela
   aparece nas outras (Hub, Painel, Biblioteca) e sobrevive à navegação.
   =================================================================== */
window.HubData = (function(){
  "use strict";
  var KEY = 'hubsenacdf_v2';   // v2: capas com ilustração — descarta estado antigo automaticamente

  var SEED = {
    projects: [
      { id:1, title:'VarizeVision AI', tag:'IA', status:'Ativo', year:'2026', img:'assets/img/p-varizevision.svg', photo:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=70&auto=format&fit=crop',
        author:'Maria S.', likes:12, comments:3, liked:false, following:false,
        published:false, progress:60, mine:true,
        desc:'Reconhecimento de padrões venosos por visão computacional para apoiar a triagem pré-cirúrgica.',
        orientador:'Prof. Jean Lima', team:['Maria S. · líder','João P.','Pedro L.'],
        links:{code:true, sys:true, doc:false},
        timeline:[
          {label:'Sprint 1 — Descoberta', date:'29 jul – 11 ago', state:'done'},
          {label:'Sprint 2 — Protótipo do modelo', date:'12 – 26 ago', state:'active'},
          {label:'Sprint 3 — Validação clínica', date:'27 ago – 09 set', state:'todo'} ] },
      { id:2, title:'Fazenda Cafundó Connect', tag:'ADS', status:'Ativo', year:'2026', img:'assets/img/p-fazenda.svg', photo:'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=70&auto=format&fit=crop',
        author:'Ana C.', likes:20, comments:2, liked:false, following:false,
        published:true, progress:66,
        desc:'Painel inteligente de monitoramento de rebanho leiteiro integrado ao sistema veterinário.',
        orientador:'Prof. Jean Lima', team:['Ana C. · líder','Lucas M.'],
        links:{code:true, sys:true, doc:true},
        timeline:[
          {label:'Sprint 1 — Coleta de dados', date:'29 jul – 11 ago', state:'done'},
          {label:'Sprint 2 — Pipeline de alertas', date:'12 – 26 ago', state:'active'},
          {label:'Sprint 3 — Dashboard final', date:'27 ago – 09 set', state:'todo'} ] },
      { id:3, title:'Feirai — Feiras Inteligentes', tag:'ADS', status:'Concluído', year:'2025', img:'assets/img/p-feira.svg', photo:'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=70&auto=format&fit=crop',
        author:'Rafael T.', likes:8, comments:3, liked:false, following:false,
        published:true, progress:100,
        desc:'Plataforma que aproxima produtores locais e consumidores para fortalecer feiras comunitárias.',
        orientador:'Prof. Jean Lima', team:['Bianca R. · líder','Felipe A.','Rafael T.'],
        links:{code:true, sys:true, doc:true},
        timeline:[
          {label:'Sprint 1 — Pesquisa de campo', date:'mar 2025', state:'done'},
          {label:'Sprint 2 — MVP web', date:'abr 2025', state:'done'},
          {label:'Entrega final', date:'jun 2025', state:'done'} ] },
      { id:4, title:'Diagnóstico IA — Laudos', tag:'IA', status:'Concluído', year:'2025', img:'assets/img/p-laudos.svg', photo:'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=70&auto=format&fit=crop',
        author:'Bruno H.', likes:18, comments:5, liked:false, following:false,
        published:true, progress:100,
        desc:'Classificação automática de laudos radiológicos com modelos de linguagem para apoio à triagem.',
        orientador:'Prof. Jean Lima', team:['Renata K. · líder','Bruno H.'],
        links:{code:true, sys:false, doc:true},
        timeline:[
          {label:'Sprint 1 — Coleta e anonimização', date:'mar 2025', state:'done'},
          {label:'Sprint 2 — Fine-tuning', date:'abr 2025', state:'done'},
          {label:'Entrega final', date:'jun 2025', state:'done'} ] },
      { id:5, title:'GestãoFácil Chamados', tag:'Gestão de TI', status:'Ativo', year:'2026', img:'assets/img/p-chamados.svg', photo:'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=70&auto=format&fit=crop',
        author:'Isabela F.', likes:5, comments:1, liked:false, following:false,
        published:false, progress:33, mine:true,
        desc:'Sistema de abertura e acompanhamento de chamados de suporte técnico para pequenas equipes.',
        orientador:'Profa. Renata', team:['Marcos V. · líder','Isabela F.'],
        links:{code:true, sys:true, doc:false},
        timeline:[
          {label:'Sprint 1 — Modelagem', date:'29 jul – 11 ago', state:'done'},
          {label:'Sprint 2 — Painel de chamados', date:'12 – 26 ago', state:'active'},
          {label:'Sprint 3 — Testes piloto', date:'27 ago – 09 set', state:'todo'} ] },
      { id:6, title:'SentinelaSeg', tag:'Segurança da Informação', status:'Ativo', year:'2026', img:'assets/img/p-seguranca.svg', photo:'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800&q=70&auto=format&fit=crop',
        author:'Diego F.', likes:9, comments:2, liked:false, following:false,
        published:true, progress:45,
        desc:'Monitor de vulnerabilidades e boas práticas de segurança para projetos acadêmicos.',
        orientador:'Profa. Renata', team:['Diego F. · líder','Larissa N.'],
        links:{code:true, sys:false, doc:true},
        timeline:[
          {label:'Sprint 1 — Levantamento', date:'05 – 18 ago', state:'done'},
          {label:'Sprint 2 — Motor de análise', date:'19 ago – 01 set', state:'active'},
          {label:'Sprint 3 — Relatórios', date:'02 – 15 set', state:'todo'} ] }
    ],
    kanban: {
      todo:  [ {id:'t1', t:'Documentar métricas de acurácia', owner:'Pedro L.', av:'PL'},
               {id:'t2', t:'Revisar protocolo de triagem com a clínica', owner:'Maria S.', av:'MS'} ],
      doing: [ {id:'t3', t:'Treinar modelo baseline (CNN)', owner:'Maria S.', av:'MS'} ],
      done:  [ {id:'t4', t:'Anotar dataset de imagens venosas', owner:'João P.', av:'JP'},
               {id:'t5', t:'Pipeline de pré-processamento', owner:'João P.', av:'JP'} ]
    }
  };

  function clone(o){ return JSON.parse(JSON.stringify(o)); }

  var mem = null;               // fallback em memória (se localStorage falhar)
  function load(){
    try{ var s = localStorage.getItem(KEY); if(s) return JSON.parse(s); }catch(e){}
    if(mem) return mem;
    return null;
  }
  function persist(){
    try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){ mem = state; }
  }
  var state = load() || clone(SEED);

  return {
    all:      function(){ return state.projects; },
    get:      function(id){ id=parseInt(id,10); return state.projects.filter(function(p){return p.id===id;})[0]; },
    add:      function(p){ p.id = Date.now(); state.projects.unshift(p); persist(); return p; },
    update:   function(id, fields){ var p=this.get(id); if(!p) return; for(var k in fields){ if(fields.hasOwnProperty(k)) p[k]=fields[k]; } persist(); return p; },
    remove:   function(id){ id=parseInt(id,10); state.projects=state.projects.filter(function(p){return p.id!==id;}); persist(); },
    mine:     function(){ return state.projects.filter(function(p){return p.mine;}); },
    toggleLike:function(id){ var p=this.get(id); if(!p) return; p.liked=!p.liked; p.likes+=p.liked?1:-1; persist(); return p; },
    toggleFollow:function(id){ var p=this.get(id); if(!p) return; p.following=!p.following; persist(); return p; },
    approve:  function(id){ var p=this.get(id); if(!p) return; p.published=true; persist(); return p; },
    kanban:   function(){ return state.kanban; },
    moveTask: function(taskId, from, to){
      var arrF=state.kanban[from], t=null;
      for(var i=0;i<arrF.length;i++){ if(arrF[i].id===taskId){ t=arrF.splice(i,1)[0]; break; } }
      if(t){ state.kanban[to].push(t); persist(); }
    },
    addTask:  function(title){ var t={id:'t'+Date.now(), t:title, owner:'Você', av:'EU'}; state.kanban.todo.push(t); persist(); return t; },
    reset:    function(){ try{ localStorage.removeItem(KEY); }catch(e){} mem=null; state=clone(SEED); }
  };
})();
