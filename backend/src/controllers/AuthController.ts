import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

interface RegisterUserBody {
  name?: string | undefined;
  email?: string | undefined;
  password?: string | undefined;
}

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public register = async (
    // Record é um tipo utilitário do TypeScript usado para representar um objeto com chaves e valores tipados <chave, valor> e never = nenhum / o corpo da resposta já foi tipado no AuthService
    request: Request<Record<string, never>, unknown, RegisterUserBody>, // poderia ser apenas request: Request, mas tipamos <parâmetros da rota, corpo da resposta, corpo da requisição>
    response: Response,
    next: NextFunction,
  ): Promise<void> => { // a função não retorna nenhum valor, quem envia resposta é o Express através do response
    try {
      const { name, email, password } = request.body;

      const user = await this.authService.register({
        name,
        email,
        password,
      });

      response.status(201).json(user); // 201 - Created
    } catch (error) {
      next(error); // envia o erro para o errorMiddleware
    }
  };
}
