import { api } from "@/services/api";
import { CommentResponse, CreateCommentRequest } from "../types/comment";

export const commentService = {
  async listByTicketId(ticketId: number): Promise<CommentResponse[]> {
    const response = await api.get<CommentResponse[]>(
      // eslint-disable-next-line prettier/prettier
      `/tickets/${ticketId}/comments`,
    );

    return response.data;
  },

  async create(
    ticketId: number,
    // eslint-disable-next-line prettier/prettier
    payload: CreateCommentRequest,
  ): Promise<CommentResponse> {
    const response = await api.post<CommentResponse>(
      `/tickets/${ticketId}/comments`,
      // eslint-disable-next-line prettier/prettier
      payload,
    );

    return response.data;
  },
};
