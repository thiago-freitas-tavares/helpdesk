import { api } from "./api"; // importa instância Axios criada, que já sabe a URL base do backend, logo, podemos escrever direto "/auth/register", por exemplo
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserResponse,
} from "../types/auth";

// objeto AuthService concentra as funções relacionadas à autenticação
export const AuthService = {
  async register(payload: RegisterRequest): Promise<UserResponse> {
    const response = await api.post<UserResponse>("/auth/register", payload); // requisição POST para auth/register com payload (enviado ao backend) no corpo da requisição

    // Axios retorna um objeto grande, com status, headers, config e data - queremos data (recebido do backend)
    return response.data;
  },

  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", payload);

    return response.data;
  },

  // o frontend precisa saber se um token que ele possui ainda é válido, seja para acesso após o login ou de rotas protegidas
  async getCurrentUser(): Promise<UserResponse> {
    // a rota /auth/me é um endpoint da API, ou seja, é um endereço do backend feito para trocar dados com o sistema, não para mostrar uma página visual para o usuário
    const response = await api.get<UserResponse>("/auth/me"); // recebe uma requisição HTTP (get) e devolve dados, normalmente em JSON

    return response.data;
  },
};
