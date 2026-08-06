import { UserResponse } from "./auth";

export enum TicketStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  CANCELED = "CANCELED",
}

export enum TicketPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface TicketResponse {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  requester: UserResponse;
  assignee: UserResponse | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListTicketsParams {
  status?: TicketStatus;
  priority?: TicketPriority;
  createdAtOrder?: "ASC" | "DESC";
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority?: TicketPriority;
}
