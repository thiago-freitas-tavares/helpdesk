# Helpdesk System

Sistema de chamados desenvolvido como desafio técnico.

O projeto é composto por uma API backend em Node.js, TypeScript, Express, TypeORM e MariaDB, e uma aplicação frontend em Vue 2, TypeScript, Vuex, Vue Router, Axios e Tailwind CSS.

---

## Estrutura do projeto

```txt
helpdesk
├── backend
└── frontend
```

---

## Aplicações

### Backend

API responsável por autenticação, usuários, chamados, comentários, permissões e persistência dos dados.

Documentação específica:

```txt
backend/README.md
```

### Frontend

Interface web responsável por cadastro, login, listagem, criação, visualização, edição, exclusão e comentários de chamados.

Documentação específica:

```txt
frontend/README.md
```

---

## Tecnologias principais

### Backend

- Node.js 22+
- TypeScript
- Express
- TypeORM
- MariaDB
- JWT
- bcryptjs
- dotenv
- cors

### Frontend

- Vue 2
- TypeScript
- Vuex
- Vue Router
- Axios
- Tailwind CSS
- vue-class-component
- vue-property-decorator

---

## Funcionalidades principais

- Cadastro de usuários.
- Login com autenticação JWT.
- Proteção de rotas autenticadas.
- Listagem de chamados.
- Criação de chamados.
- Visualização de detalhes de chamados.
- Edição de chamados apenas pelo autor.
- Exclusão de chamados apenas pelo autor.
- Filtros por status e prioridade.
- Ordenação por data de criação.
- Criação de comentários em chamados.
- Exclusão de comentários apenas pelo autor.
- Interface com controle visual de permissões.
- Integração entre frontend e backend via API REST.

---

## Como rodar o projeto

Para executar o projeto completo em ambiente local, é necessário rodar o backend e o frontend separadamente.

---

## Backend

Acesse a pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Configure o arquivo `.env` na raiz do backend.

Execute as migrations:

```bash
npm run migration:run
```

Rode o backend em desenvolvimento:

```bash
npm run dev
```

A API ficará disponível em:

```txt
http://localhost:3000
```

Para verificar se a API está online:

```http
GET /health
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

---

## Frontend

Acesse a pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Configure o arquivo `.env` ou `.env.local`, se necessário.

Exemplo:

```env
VUE_APP_API_URL=http://localhost:3000
```

Rode o frontend em desenvolvimento:

```bash
npm run serve
```

A aplicação ficará disponível em:

```txt
http://localhost:8080
```

---

## Builds

### Backend

```bash
cd backend
npm run build
```

### Frontend

```bash
cd frontend
npm run build
```

---

## Documentação

Para mais detalhes sobre instalação, variáveis de ambiente, estrutura, rotas, regras de negócio, observações técnicas e melhorias futuras, consulte os READMEs específicos:

```txt
backend/README.md
frontend/README.md
```

---

## Organização geral

```txt
helpdesk
├── backend
│   ├── src
│   ├── README.md
│   ├── package.json
│   └── tsconfig.json
├── frontend
│   ├── src
│   ├── README.md
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## Observações técnicas

- O backend é responsável pelas regras de negócio, autenticação, permissões e persistência dos dados.
- O frontend é responsável pela interface, navegação, estado de autenticação e integração com a API.
- As permissões visuais do frontend não substituem as validações do backend.
- O token JWT é emitido pelo backend e enviado pelo frontend nas requisições autenticadas.
- O banco de dados utilizado é MariaDB.
- As alterações estruturais do banco são controladas por migrations no backend.
- O frontend utiliza Vuex para centralizar o estado de autenticação.
- A comunicação entre frontend e backend é feita via Axios.

---

## Melhorias futuras

Algumas melhorias possíveis para evolução do projeto:

- Implementar testes automatizados no backend.
- Implementar testes automatizados no frontend.
- Adicionar paginação na listagem de chamados.
- Adicionar busca por texto em título e descrição.
- Implementar refresh token.
- Implementar documentação Swagger/OpenAPI no backend.
- Melhorar tratamento global de erros no frontend.
- Melhorar responsividade da interface.
- Melhorar acessibilidade dos componentes.
- Criar controle de permissões por roles, como `admin`, `agent` e `customer`.
- Permitir atribuição de chamados para responsáveis.
