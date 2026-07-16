import { UserRole } from '../enums/UserRole';

// o Express possui propriedades e métodos de app, response e request (request.body, request.params, request.headers, request.query)

declare global { // tipagem global no projeto
  namespace Express {
    interface Request { // vamos criar uma tipagem para request.user
      user?: { // a ? indica que ela é opcional (rotas públicas não terão request.user e rotas protegidas terão request.user depois do authMiddleware)
        id: number; // vem do token JWT, da claim sub
        role: UserRole;
      };
    }
  }
}

export {}; // faz o TypeScript tratar esse arquivo como módulo
