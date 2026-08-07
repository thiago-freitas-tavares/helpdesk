# Helpdesk System - Frontend

Frontend do sistema de chamados.

A aplicação permite cadastro e autenticação de usuários, listagem, criação, visualização, edição e exclusão de chamados, gerenciamento de comentários, filtros de listagem e controle visual de permissões com base no usuário autenticado.

---

## Tecnologias utilizadas

- Vue 2
- TypeScript
- Vuex
- Vue Router
- Axios
- Tailwind CSS
- vue-class-component
- vue-property-decorator

---

## Funcionalidades implementadas

### Autenticação

- Tela de cadastro de usuário.
- Tela de login.
- Login integrado à API.
- Cadastro integrado à API.
- Armazenamento do token JWT no `localStorage`.
- Armazenamento do usuário autenticado no Vuex.
- Restauração inicial do estado de autenticação a partir do `localStorage`.
- Logout com limpeza do Vuex e do `localStorage`.
- Redirecionamento automático após login.
- Guards de rota para proteger telas autenticadas.
- Redirecionamento de usuários autenticados ao tentar acessar login ou cadastro.

### Chamados

- Listagem de chamados.
- Filtros por status.
- Filtros por prioridade.
- Ordenação por data de criação.
- Criação de chamados.
- Visualização de detalhes de um chamado.
- Edição de chamados apenas pelo autor.
- Exclusão de chamados apenas pelo autor.
- Exibição visual de status e prioridade por cores.
- Botões de edição e exclusão exibidos apenas quando o usuário autenticado é o autor do chamado.

### Comentários

- Listagem de comentários de um chamado.
- Criação de comentários em qualquer chamado autenticado.
- Validação para impedir comentários vazios ou contendo apenas espaços.
- Exclusão de comentário apenas pelo autor do comentário.
- Botão de exclusão exibido apenas para o autor do comentário.

---

## Regras de negócio

### Usuários

- Nome, e-mail e senha são obrigatórios no cadastro.
- A senha deve ter no mínimo 6 caracteres.
- O frontend não permite envio do formulário de cadastro quando os campos obrigatórios estão inválidos.
- O usuário autenticado é armazenado no Vuex para uso nas telas protegidas.

### Autenticação

- O login retorna um token JWT através da API.
- O token é salvo no `localStorage`.
- O token é enviado automaticamente nas requisições autenticadas usando o header:

```http
Authorization: Bearer <token>
```

- Rotas protegidas exigem autenticação.
- Usuários não autenticados são redirecionados para `/login`.
- Usuários autenticados são redirecionados para `/tickets` ao tentar acessar `/login` ou `/register`.

### Chamados

- Qualquer usuário autenticado pode listar chamados.
- Qualquer usuário autenticado pode visualizar detalhes de chamados.
- Qualquer usuário autenticado pode criar chamados.
- Ao criar um chamado, o autor é definido pelo backend com base no token JWT.
- O cliente não envia nem permite forjar o autor do chamado.
- Apenas o autor do chamado visualiza os botões de editar e excluir.
- Na edição do chamado, o autor pode alterar título, descrição, status e prioridade.
- A tentativa de edição ou exclusão por usuários não autorizados continua sendo protegida pelo backend.

Status disponíveis:

```txt
OPEN
IN_PROGRESS
DONE
CANCELED
```

Prioridades disponíveis:

```txt
LOW
MEDIUM
HIGH
```

### Comentários

- Qualquer usuário autenticado pode comentar em qualquer chamado.
- O autor do comentário é definido pelo backend com base no token JWT.
- O cliente não envia nem permite forjar o autor do comentário.
- Comentários não podem ser vazios.
- Comentários não podem conter apenas espaços.
- Apenas o autor do comentário visualiza o botão de excluir comentário.
- A tentativa de exclusão por usuários não autorizados continua sendo protegida pelo backend.

---

## Estrutura do projeto

```txt
src
├── assets
├── components
├── constants
├── router
├── services
├── store
│   ├── modules
│   ├── index.ts
│   └── types.ts
├── types
├── views
├── App.vue
└── main.ts
```

### Organização das camadas

- `assets`: arquivos estáticos e estilos globais da aplicação.
- `components`: componentes reutilizáveis da interface.
- `constants`: constantes compartilhadas, como chaves do `localStorage`.
- `router`: definição das rotas e guards de navegação.
- `services`: comunicação com a API usando Axios.
- `store`: estado global da aplicação com Vuex.
- `store/modules`: módulos Vuex separados por domínio.
- `types`: interfaces e enums TypeScript compartilhados.
- `views`: telas principais renderizadas pelas rotas.
- `App.vue`: componente raiz da aplicação.
- `main.ts`: ponto de entrada da aplicação Vue.

---

## Como rodar o projeto

### Pré-requisitos

Antes de iniciar, é necessário ter instalado:

- Node.js.
- npm.
- Backend do projeto rodando.
- Arquivo `.env` ou `.env.local` configurado na raiz do frontend, caso a API não esteja usando a URL padrão.

### Configurar variáveis de ambiente

O frontend utiliza variáveis de ambiente com o prefixo `VUE_APP_`.

Exemplo de `.env.example`:

```env
VUE_APP_API_URL=http://localhost:3000
```

Caso essa variável não seja configurada, o frontend utiliza como padrão:

```txt
http://localhost:3000
```

### Instalar dependências

```bash
npm install
```

### Rodar em desenvolvimento

```bash
npm run serve
```

A aplicação ficará disponível em:

```txt
http://localhost:8080
```

### Gerar build de produção

```bash
npm run build
```

### Executar lint

```bash
npm run lint
```

---

## Principais rotas

### Autenticação

```txt
/login
/register
```

### Chamados

```txt
/tickets
/tickets/new
/tickets/:id
/tickets/:id/edit
```

### Comportamento das rotas

- `/login`: tela de login.
- `/register`: tela de cadastro.
- `/tickets`: listagem de chamados.
- `/tickets/new`: criação de chamado.
- `/tickets/:id`: detalhes de um chamado.
- `/tickets/:id/edit`: edição de um chamado.

Rotas de chamados exigem autenticação.

Usuários não autenticados são redirecionados para:

```txt
/login
```

Usuários autenticados que tentam acessar login ou cadastro são redirecionados para:

```txt
/tickets
```

---

## Integração com a API

A comunicação com a API é feita por meio da instância central do Axios em:

```txt
src/services/api.ts
```

O token JWT é enviado automaticamente através de um interceptor de requisição.

Serviços implementados:

```txt
authService
ticketService
commentService
```

### Autenticação

```http
POST /auth/register
POST /auth/login
GET /auth/me
```

### Chamados

```http
GET /tickets
POST /tickets
GET /tickets/:id
PATCH /tickets/:id
DELETE /tickets/:id
```

A listagem de chamados aceita filtros por query params:

```http
GET /tickets?status=OPEN
GET /tickets?priority=HIGH
GET /tickets?status=OPEN&priority=HIGH
GET /tickets?createdAtOrder=ASC
GET /tickets?createdAtOrder=DESC
```

### Comentários

```http
GET /tickets/:ticketId/comments
POST /tickets/:ticketId/comments
DELETE /tickets/:ticketId/comments/:commentId
```

---

## Observações técnicas

- O frontend utiliza Vue 2 com TypeScript.
- A aplicação utiliza Vuex para centralizar o estado de autenticação.
- O token JWT e os dados básicos do usuário são persistidos no `localStorage`.
- O Axios possui interceptor para enviar automaticamente o header `Authorization`.
- As rotas protegidas são controladas por `meta.requiresAuth`.
- As rotas exclusivas para visitantes são controladas por `meta.guestOnly`.
- As validações dos formulários são feitas manualmente.
- Botões de ações restritas são ocultados no frontend conforme o usuário autenticado.
- As permissões reais continuam sendo validadas pelo backend.
- O formulário de edição de chamado permite alterar título, descrição, status e prioridade.
- A interface utiliza badges coloridas para facilitar a identificação de status e prioridade.
- O projeto utiliza componentes reutilizáveis para campos e botões básicos.

---

## Melhorias futuras

Algumas melhorias possíveis para evolução do frontend:

- Adicionar validação com Zod nos formulários do frontend.
- Centralizar schemas de validação para login, cadastro, chamados e comentários.
- Padronizar mensagens de erro de validação no frontend.
- Criar componente `BaseTextarea.vue` reutilizável com label, `v-model`, placeholder, rows, estado disabled e mensagem de erro opcional.
- Criar componente `TicketBadge.vue` ou `BaseBadge.vue` para centralizar a lógica visual de status e prioridade.
- Implementar tratamento global de erro `401` para logout automático quando o token expirar.
- Implementar paginação na listagem de chamados.
- Implementar busca por texto em título e descrição.
- Melhorar feedback visual com loading skeletons.
- Implementar testes automatizados.
- Melhorar acessibilidade dos formulários e componentes.
- Melhorar responsividade em telas pequenas.
- Implementar refresh token em conjunto com o backend.
