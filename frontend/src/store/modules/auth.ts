import type {
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex/types/index";

import {
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
} from "../../constants/storageKeys";

import { LoginRequest, LoginResponse, UserResponse } from "../../types/auth";
import { authService } from "../../services/authService"; // Vuex não vai chamar o Axios diretamente, vai chamar o authService
import { AuthState, RootState } from "../types";

// este arquivo serve para centralizar a autenticação no Vuex

function getStoredUser(): UserResponse | null {
  // localStorage é uma API global do navegador e como o frontend roda no navegador, qualquer arquivo do frontend pode acessar localStorage.getItem .setItem .removeItem
  const storedUser = localStorage.getItem(USER_STORAGE_KEY); // busca no localstorage o valor salvo na chave "user" (vem como string ou null)

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as UserResponse; // converte o storedUser, que veio como string JSON do localStorage, em um objeto JavaScript no formato UserResponse
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY); // se o JSON.parse falhar, remove o usuário inválido do localstorage

    return null;
  }
}

// estado inicial - ao abrir a aplicação, o Vuex tenta recuperar o token e o user do localStorage, o que permite manter a sessão após recarregar a página
// formulário de tela, state (estado do Vuex) e localStorage do navegador são coisas diferentes - state do Vuex é um estado que fica na memória da aplicação Vue enquanto ela está rodando
const state = (): AuthState => ({
  token: localStorage.getItem(TOKEN_STORAGE_KEY),
  user: getStoredUser(), // convertido
});

// getters são como computed properties do Vuex
const getters: GetterTree<AuthState, RootState> = {
  // retorna true se existir token e usuário ou false
  isAuthenticated(state): boolean {
    return state.token !== null && state.user !== null;
  },

  currentUser(state): UserResponse | null {
    return state.user;
  },

  authToken(state): string | null {
    return state.token;
  },
};

// mutations causam alteração síncrona no state
const mutations: MutationTree<AuthState> = {
  // atualiza o estado em memória do Vuex (dados de autenticação state) com os dados que foram enviados para a mutation (payload, que vem no formato LoginResponse)
  setAuth(state, payload: LoginResponse): void {
    state.token = payload.token;
    state.user = payload.user;
  },

  clearAuth(state): void {
    state.token = null;
    state.user = null;
  },
};

// actions podem executar operações assíncronas, chamar API e depois chamar mutations - sempre que uma action precisa alterar o state, ela deve fazer isso por uma mutation
const actions: ActionTree<AuthState, RootState> = {
  // o primeiro parâmetro de uma action é um objeto de contexto do Vuex, que pode ser context.commit .dispatch .state .getters .rootState .rootGetters (desestruturação - {commit})
  async login({ commit }, payload: LoginRequest): Promise<void> {
    const response = await authService.login(payload); // chama o backend que faz a requisição POST /auth/login

    // salva o token JWT no localStorage do navegador, que continua existindo mesmo se o usuário fechar e abrir o navegador de novo (chave, valor)
    localStorage.setItem(TOKEN_STORAGE_KEY, response.token); // depois, quando o frontend precisar chamar uma rota protegida, ele poderá pegar esse token e mandar no header
    // salva os dados do usuário no localStorage, mas localStorage só salva texto e response.user é um objeto, por isso o stringify
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user)); // depois para recuperar os dados seria const user = JSON.parse(localStorage.getItem("user") || "null");

    //commit serve para chamar uma mutation - neste caso, executa a mutation chamada setAuth e envia response como payload
    commit("setAuth", response);
  },

  logout({ commit }): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY); // limpa o localStorage
    localStorage.removeItem(USER_STORAGE_KEY);

    commit("clearAuth"); // chama mutation que limpa o state do Vuex
  },
};

// módulo Vuex de autenticação com tipos genéricos AuthState e RootState que tem estado próprio no formato AuthState e pertence a uma store raiz cujo estado tem formato RootState
export const authModule: Module<AuthState, RootState> = {
  namespaced: true, // actions, mutations e getters serão acessados com prefixo do nome usado ao registrar o módulo no store/index.ts, neste caso auth: authModule (não tem a ver com rota HTTP da API)
  state,
  getters,
  mutations,
  actions,
};
