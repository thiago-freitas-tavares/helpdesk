import { api } from "./api";
import { CommentResponse, CreateCommentRequest } from "../types/comment";

export const commentService = {
  async listByTicketId(ticketId: number): Promise<CommentResponse[]> {
    const response = await api.get<CommentResponse[]>(
      `/tickets/${ticketId}/comments`
    );

    return response.data;
  },

  async create(
    ticketId: number,
    payload: CreateCommentRequest
  ): Promise<CommentResponse> {
    const response = await api.post<CommentResponse>(
      `/tickets/${ticketId}/comments`,
      payload
    );

    return response.data;
  },

  async remove(ticketId: number, commentId: number): Promise<void> {
    await api.delete(`/tickets/${ticketId}/comments/${commentId}`);
  },
};
