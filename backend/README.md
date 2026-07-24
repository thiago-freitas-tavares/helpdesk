# Helpdesk System - Backend

Backend do sistema de chamados.

A API permite cadastro e autenticação de usuários, criação e gerenciamento de chamados, comentários, filtros de listagem e controle básico de permissões com base no usuário autenticado.

---

## Tecnologias utilizadas

- Node.js 22+
- TypeScript
- Express
- TypeORM
- MariaDB
- JWT
- bcryptjs
- dotenv
- cors

---

## Funcionalidades implementadas

### Autenticação

- Cadastro de usuário.
- Login com JWT.
- Token com expiração.
- Rota para consultar usuário autenticado.
- Senha criptografada com bcrypt.
- Senha nunca retornada nas respostas da API.
- Middleware de autenticação para rotas protegidas.

### Chamados

- Criar chamado autenticado.
- Listar chamados.
- Buscar chamado por ID.
- Editar chamado apenas pelo autor.
- Excluir chamado apenas pelo autor.
- Definir status inicial automaticamente como `OPEN`.
- Definir prioridade padrão como `MEDIUM` quando não informada.
- Filtrar chamados por status.
- Filtrar chamados por prioridade.
- Ordenar chamados por data de criação.

### Comentários

- Criar comentário em qualquer chamado autenticado.
- Listar comentários de um chamado.
- Excluir comentário apenas pelo autor.
- Impedir comentários vazios ou contendo apenas espaços.
- Remover comentários automaticamente ao excluir o chamado relacionado.

---

## Regras de negócio

### Usuários

- Nome, e-mail e senha são obrigatórios no cadastro.
- O e-mail deve possuir formato válido.
- A senha deve ter no mínimo 6 caracteres.
- Todo usuário cadastrado recebe a role padrão `customer`.
- A role do usuário não pode ser definida pelo cliente no cadastro.
- A senha do usuário não é retornada nas respostas da API.

### Autenticação

- O login retorna um token JWT.
- O token deve ser enviado no header das rotas protegidas:

```http
Authorization: Bearer <token>
```

- Rotas de chamados e comentários exigem autenticação.
- Credenciais inválidas retornam uma mensagem genérica.

### Chamados

- Qualquer usuário autenticado pode criar chamados.
- Qualquer usuário autenticado pode listar chamados.
- Qualquer usuário autenticado pode visualizar detalhes de chamados.
- Apenas o autor do chamado pode editar o chamado.
- Apenas o autor do chamado pode excluir o chamado.
- O autor do chamado é definido pelo token JWT.
- O cliente não pode informar ou forjar o autor do chamado no body.
- Ao criar um chamado, o status inicial sempre será `OPEN`.
- Ao criar um chamado, a prioridade padrão será `MEDIUM` caso não seja informada.

Status permitidos:

```txt
OPEN
IN_PROGRESS
DONE
CANCELED
```

Prioridades permitidas:

```txt
LOW
MEDIUM
HIGH
```

### Comentários

- Qualquer usuário autenticado pode comentar em qualquer chamado.
- O autor do comentário é definido pelo token JWT.
- O cliente não pode informar ou forjar o autor do comentário no body.
- Comentários não podem ser vazios.
- Comentários não podem conter apenas espaços.
- Apenas o autor do comentário pode excluir o comentário.
- Ao excluir um chamado, os comentários vinculados a ele também são excluídos.

---

## Estrutura do projeto

```txt
src
├── controllers
├── entities
├── enums
├── errors
├── middlewares
├── migrations
├── repositories
├── routes
├── services
├── types
├── data-source.ts
└── index.ts
```

### Organização das camadas

- `entities`: entidades do TypeORM.
- `migrations`: migrations responsáveis pela estrutura do banco de dados.
- `routes`: definição das rotas HTTP.
- `controllers`: recebem requisições e retornam respostas.
- `services`: concentram regras de negócio e validações.
- `repositories`: concentram o acesso ao banco via TypeORM.
- `middlewares`: autenticação e tratamento de erros.
- `errors`: erros customizados da aplicação.
- `types`: extensões de tipos do Express.

---

## Como rodar o projeto

### Pré-requisitos

Antes de iniciar, é necessário ter instalado:

- Node.js 22 ou superior.
- MariaDB.
- npm.

Também é necessário possuir um arquivo `.env` configurado na raiz do backend e o banco de dados criado no MariaDB.

### Instalar dependências

```bash
npm install
```

### Executar migrations

```bash
npm run migration:run
```

### Rodar em desenvolvimento

```bash
npm run dev
```

A API ficará disponível em:

```txt
http://localhost:3000
```

### Verificar se a API está online

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

## Principais rotas

### Autenticação

```http
POST /auth/register
POST /auth/login
GET /auth/me
```

### Chamados

```http
POST /tickets
GET /tickets
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
POST /tickets/:ticketId/comments
GET /tickets/:ticketId/comments
DELETE /tickets/:ticketId/comments/:commentId
```

---

## Observações técnicas

- O projeto utiliza `synchronize: false` no TypeORM.
- Alterações estruturais no banco devem ser feitas por migrations.
- A senha do usuário possui `select: false` na entity, evitando retorno acidental.
- O relacionamento entre comentários e chamados usa exclusão em cascata.
- Controllers não acessam diretamente o banco de dados.
- Services concentram regras de negócio e validações.
- Repositories concentram acesso ao TypeORM.
- Rotas conectam os caminhos HTTP aos controllers.
- Erros esperados são tratados com `AppError`.
- O tratamento centralizado de erros é feito pelo `errorMiddleware`.

---

## Melhorias futuras

Algumas melhorias possíveis para evolução do backend:

- Criar middleware de autorização por roles.
- Permitir que apenas usuários `admin` alterem roles de outros usuários.
- Permitir que usuários `agent` ou `admin` assumam ou atribuam chamados.
- Implementar paginação na listagem de chamados.
- Implementar busca por texto em título e descrição.
- Implementar testes automatizados.
- Implementar refresh token.
- Adicionar documentação Swagger/OpenAPI.
