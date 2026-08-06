import { api } from "./api"; // como já configuramos o interceptor, essa instância manda o token automaticamente.
import {
  CreateTicketRequest,
  ListTicketsParams,
  TicketResponse,
} from "../types/ticket";

// serviço responsável por chamadas de API relacionadas a tickets.
export const ticketService = {
  // função list, que pode receber parâmetro opcional e retorna uma lista de chamados
  async list(params?: ListTicketsParams): Promise<TicketResponse[]> {
    // faz requisição GET /tickets. e se params existir, o Axios transforma em query params automaticamente (GET /tickets?status=OPEN&createdAtOrder=DESC)
    const response = await api.get<TicketResponse[]>("/tickets", {
      params,
    });

    return response.data; // retorna apenas o corpo, que é um array de chamados
  },

  async create(payload: CreateTicketRequest): Promise<TicketResponse> {
    const response = await api.post<TicketResponse>("/tickets", payload);

    return response.data;
  },
};
