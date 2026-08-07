import { UserResponse } from "./auth";
import { TicketResponse } from "./ticket";

export interface CommentResponse {
  id: number;
  content: string;
  ticket: TicketResponse;
  author: UserResponse;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentRequest {
  content: string;
}
