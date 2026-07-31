// interfaces iguais às definidas no backend

// interface com o formato que o frontend vai enviar para POST /auth/register
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// interface com o formato que o backend devolve para o register do frontend - role, createdAt e updatedAt chegam no frontend como string
export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// interface com o formato que o frontend vai enviar para POST /auth/login
export interface LoginRequest {
  email: string;
  password: string;
}

// interface com o formato da resposta que o backend devolve para o login do frontend
export interface LoginResponse {
  user: UserResponse;
  token: string;
}
