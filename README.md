# Hub Senac - DF — Protótipo funcional (sem backend)

Protótipo navegável em HTML/CSS/JS puro — **abre por duplo-clique**, sem instalar nada.
As telas conversam entre si por uma camada de estado no próprio navegador (`localStorage`):
o que você faz numa tela reflete nas outras e sobrevive à navegação.

## Como abrir
Abra **`index.html`** no Chrome ou Edge. Mantenha a pasta inteira junta (usa `assets/`).

## O que já funciona de verdade
- **Buscar** projetos por nome, turma, autor ou tecnologia (campo no topo do Hub)
- **Filtrar** por turma (IA, ADS, Gestão de TI, Segurança da Informação)
- **Novo Projeto** (botão no Hub) → abre um formulário e **cria o projeto**, que passa a
  aparecer no Hub, no **Painel de Coordenação** e na **Biblioteca**
- **Abrir** um projeto → cada card abre a sua própria página de detalhe (`projeto.html?id=…`)
- **Curtir** e **Seguir** projetos (os números são lembrados)
- **Kanban** (tela Gestão) → mover tarefas entre colunas e adicionar tarefa; a posição é salva
- **Painel** → botão **Aprovar** publica um projeto (muda o status na hora)
- **Login** → o perfil escolhido (Aluno / Professor / Coordenação) define para onde vai

## Páginas
| Arquivo | Tela |
|---|---|
| `index.html` | **Frontpage** — Hub Público (busca, filtros, métricas, cards) |
| `projeto.html?id=N` | Detalhe de um projeto (equipe, links, linha do tempo) |
| `login.html` | Acesso por perfil |
| `gestao.html` | Gestão — quadro Kanban + cronograma |
| `painel.html` | Painel de Coordenação |
| `biblioteca.html` | Repositório de artefatos |

## Estrutura
- `assets/data.js` — **dados** (fonte única, salvos no navegador). É aqui que se editam os projetos.
- `assets/app.js` — renderização das telas + interações
- `assets/style.css` — visual (topo institucional, sidebar navy, cabeçalho creme)
- `assets/logo-senac.png` — logo oficial da Faculdade
- `build.py` — gera as páginas (opcional; só para regenerar em lote)

## Dicas para a apresentação
- Comece no `index.html`. Mostre a busca e os filtros, clique num card para abrir o detalhe.
- Faça o **login como Coordenação** e mostre o **Painel**; depois volte e crie um **Novo Projeto**
  no Hub — ele aparece no Painel. Esse é o momento "está funcionando de verdade".
- Para **zerar** os dados ao estado inicial, abra o Console do navegador (F12) e rode:
  `HubData.reset()` e recarregue a página.

> Se em algum computador o `localStorage` em `file://` estiver bloqueado, sirva a pasta por um
> servidor local: dentro dela rode `python -m http.server` e acesse `http://localhost:8000`.
> Aí a persistência entre telas fica 100% garantida.

> Protótipo de **interface + fluxo**. Os dados são locais (sem servidor). A versão real
> conecta ao Supabase (banco + login), conforme o plano de desenvolvimento do grupo.
