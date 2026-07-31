import axios from "axios"; // biblioteca usada pelo frontend para fazer requisições HTTP para o backend

const baseURL = process.env.VUE_APP_API_URL || "http://localhost:3000"; // endereço base da API (variável VUE_APP_API_URL do .env ou 3000 padrão)

// cria uma instância chamada api do Axios e a exporta para ser usada em outros arquivos, chamando api.post ao invés de axios.post, por exemplo
export const api = axios.create({
  baseURL,
});
