import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken'; // função que valida se o token foi assinado com o JWT_SECRET correto, não foi alterado e não expirou
import type { JwtPayload } from 'jsonwebtoken'; // JwtPayload é um tipo que representa o formato genérico de um payload JWT decodificado
import { UserRole } from '../enums/UserRole';
import { AppError } from '../errors/AppError';

interface AuthTokenPayload extends JwtPayload { // temos que criar essa interface, pois temos a propriedade role, que não é padrão do JwtPayload
  sub: string; // dono da token (sub é uma propriedade padrão do JwtPayload)
  role: UserRole;
}

export function authMiddleware( // função que será usada em rotas protegidas - pode ser function, porque não usa this
  request: Request,
  _response: Response,
  next: NextFunction,
): void { // não retorna valor, apenas valida token, preenche request.user e libera ou bloquea a requisição
  try {
    const authHeader = request.headers.authorization; // quando o frontend chama uma rota protegida, ele envia algo do tipo - Authorization: Bearer eyJhbGciOiJIUzI1Ni...

    if (!authHeader) {
      throw new AppError('Token não informado', 401);
    }

    const [scheme, token] = authHeader.split(' '); // scheme = "Bearer" e token = "eyJhbGciOiJIUzI1Ni..."

    if (scheme !== 'Bearer' || !token) {
      throw new AppError('Token inválido ou expirado', 401);
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new AppError('Configuração de autenticação inválida', 500);
    }

    const decodedToken = verify(token, jwtSecret); // valida o token e retorna o payload objeto (sub e role) ou vai para o catch se der erro

    if (typeof decodedToken === 'string') { // pela tipagem da biblioteca, o retorno de verify pode ser string | JwtPayload, não é o que esperamos
      throw new AppError('Token inválido ou expirado', 401);
    }

    const { sub, role } = decodedToken as AuthTokenPayload; // converte decodedToken para o tipo AuthTokenPayload, pois o TypeScript não sabe que o token foi criado pelo login

    if (!sub || Number.isNaN(Number(sub))) { // somente isNaN(Number(sub)) funcionaria 
      throw new AppError('Token inválido ou expirado', 401);
    }

    if (!Object.values(UserRole).includes(role)) { // gera uma lista com os valores do enum UserRole e verifica se o role recebido está nessa lista
      throw new AppError('Token inválido ou expirado', 401);
    }

    request.user = { // depois de todas as validações, preenchemos a propriedade user
      id: Number(sub), // sub que veio como string do JWT
      role,
    };

    next(); // libera a requisição para o próximo middleware/controller
  } catch (error) {
    if (error instanceof AppError) {
      next(error); // envia o erro para o errorMiddleware
      return;
    }

    next(new AppError('Token inválido ou expirado', 401)); // se o erro for do JWT
  }
}
