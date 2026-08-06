import axios from "axios"; // biblioteca usada pelo frontend para fazer requisições HTTP para o backend
import { TOKEN_STORAGE_KEY } from "../constants/storageKeys";

const baseURL = process.env.VUE_APP_API_URL || "http://localhost:3000"; // endereço base da API (variável VUE_APP_API_URL do .env ou 3000 padrão)

// cria uma instância chamada api do Axios e a exporta para ser usada em outros arquivos, chamando api.post ao invés de axios.post, por exemplo
export const api = axios.create({
  baseURL,
});

// interceptor de requisição, que roda antes de cada requisição feita com api
// o config de uma requisição é um objeto que pode ter baseURL, url, method, headers (Accept, Authorization), params, data, timeout...
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // modifica o config.headers.Authorization
  }

  return config; // retorna o objeto inteiro
});
