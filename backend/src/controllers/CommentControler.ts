import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { CommentService } from "../services/CommentService";

interface CreateCommentParams {
  ticketId?: string | undefined; // na rota /tickets/:ticketId/comments o :ticketId é um parâmetro da URL
}

interface CreateCommentBody {
  content?: string | undefined; // opcional na tipagem pois o cliente pode mandar uma requisição inválida, a validação real acontece no service
}

interface DeleteCommentParams {
  ticketId?: string | undefined; // vem da rota http - request.params.ticketId
  commentId?: string | undefined; // vem da rota http - request.params.commentId
}

export class CommentController { // métodos de rota relacionados a comentários

  constructor(
    private readonly commentService: CommentService = new CommentService
  ) {}

  public create = async( // arrow function para não perder a referência do this
    request: Request<CreateCommentParams, unknown, CreateCommentBody>, // porque foi colocado params e nao record? no ticket tinha o requesterId e assigneeId
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if(!request.user) {
        throw new AppError('Usuário não autenticado', 401);
      }

      const { content } = request.body;
      const { ticketId } = request.params; // se a rota chamada foi POST /tickets/1/comments, então ticketId = '1'

      const comment = await this.commentService.create({ // chama o service para criar o comentário - envolve validação do banco de dados
        content,
        ticketId: Number(ticketId), // vem string da URL
        authorId: request.user.id,
      });

      response.status(201).json(comment);
    } catch(error) {
      next(error);
    }
  };

   public listByTicketId = async (
    request: Request<CreateCommentParams>,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { ticketId } = request.params;

      const comments = await this.commentService.listByTicketId({ ticketId: Number(ticketId) }); // nesse caso tive que colocar um objeto, pois é o argumento que o método pede

      response.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (
    request: Request<DeleteCommentParams>,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!request.user) {
        throw new AppError('Usuário não autenticado', 401);
      }

      const { ticketId, commentId } = request.params;

      await this.commentService.delete({
        ticketId: Number(ticketId),
        commentId: Number(commentId),
        authenticatedUserId: request.user.id,
      });

      response.status(204).send(); // 204 - No Content (a operação deu certo, mas não há conteúdo para retornar no corpo da resposta.)
    } catch (error) {
      next(error);
    }
  };
}
