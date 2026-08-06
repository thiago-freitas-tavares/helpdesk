import { UserResponse } from "../types/auth";

// criamos esse arquivo, pois o TypeScript estava entendendo que Module do authModule do store/modules/auth.ts é um namespace

// interface do estado específico do módulo de autenticação
export interface AuthState {
  token: string | null;
  user: UserResponse | null;
}

// interface do estado global da store inteira (src/store)
export interface RootState {
  auth: AuthState; // diz que a store raiz terá uma propriedade auth no formato AuthState, com isso, o TypeScript entende que existe this.$store.state.auth (.token .user)
}
