import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';
import { AuthService } from '../services/AuthService';

interface RegisterUserBody {
  name?: string | undefined;
  email?: string | undefined;
  password?: string | undefined;
};

interface LoginUserBody {
  email?: string | undefined;
  password?: string | undefined;
};

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  };

  public register = async ( // será chamado pela rota POST /auth/register - tem que ser arrow function, porque usa this
    // Record é um tipo utilitário do TypeScript usado para representar um objeto com chaves e valores tipados <chave, valor> e never = nenhum / o corpo da resposta já foi tipado no AuthService
    request: Request<Record<string, never>, unknown, RegisterUserBody>, // poderia ser apenas request: Request, mas tipamos <parâmetros da rota, corpo da resposta, corpo da requisição>
    response: Response,
    next: NextFunction,
  ): Promise<void> => { // a função não retorna nenhum valor, quem envia resposta HTTP é o Express através do response
    try { // tudo o que pode dar erro fica aqui dentro
      const { name, email, password } = request.body; // o Express coloca os dados JSON que vem dos inputs do frontend no request.body

      const user = await this.authService.register({ // quando ocorre um erro no AuthService.register, o fluxo interrompe e volta direto no catch
        name,
        email,
        password,
      });

      response.status(201).json(user); // 201 - Created
    } catch (error) {
      next(error); // função que envia o erro para o errorMiddleware
    };
  };

  public login = async ( // será chamado pela rota POST /auth/login
    request: Request<Record<string, never>, unknown, LoginUserBody>,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email, password } = request.body;

      const loginData = await this.authService.login({
        email,
        password,
      });

      response.status(200).json(loginData); // 200 - OK (sucesso)
    } catch (error) {
      next(error);
    };
  };

  public me = async ( // será chamado pela rota GET /auth/me
    request: Request, // Request simples, pois não precisamos tipar body, params ou query para essa rota.
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!request.user) {
        throw new AppError('Usuário não autenticado', 401);
      };

      response.status(200).json({
        user: request.user,
      });
    } catch (error) { // se request.user existe, significa que a autenticação do token no authMiddleware foi válida, por isso, não precisaria de catch(error) aqui, mas deixamos por padronização
      next(error);
    };
  };
};
