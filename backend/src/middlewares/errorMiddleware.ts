import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';

// este arquivo captura os erros e os transforma em respostas padronizadas para o frontend.
export function errorMiddleware(
  error: Error, // erro que chegou ao middleware, que pode ser um AppError ou um erro qualquer
  _request: Request, // o underline indica que eu sei que existe, mas não vou usar, para não dar erro no TypeScript
  response: Response,
  _next: NextFunction,
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    }); // se o errorMiddleware responde a request, não preciso dar next
  }

  console.error(error);

  return response.status(500).json({ // 500 - Internal Server Error
    message: 'Erro interno',
  });
}
