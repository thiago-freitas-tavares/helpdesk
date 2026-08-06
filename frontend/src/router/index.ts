import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import TicketsListView from "../views/TicketsListView.vue";
// este store é a store global do Vuex e permite usar store.state, store.getters, store.dispatch, store.commit
import store from "../store"; // quando se importa a pasta sem especificar o arquivo, o TypeScript/Webpack procura automaticamente o arquivo index.ts dentro dela

Vue.use(VueRouter); // instala o Vue Router dentro do Vue, permitindo o uso de recursos, como 'this.$router', 'this.$route', '<router-view />', '<router-link />'

// RouteConfig ajuda o TypeScript a entender que cada item do array precisa seguir o formato esperado por uma rota do Vue Router
const routes: Array<RouteConfig> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login", // pode ser chamado através de 'this.$router.push("/login")'
    name: "login", // pode ser chamado através de 'this.$router.push({ name: "login" })'
    component: LoginView,
    meta: {
      guestOnly: true, // rota apenas para visitante,se usuário estiver logado, mandamos ele para /tickets
    },
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
    meta: {
      guestOnly: true,
    },
  },
  {
    path: "/tickets",
    name: "tickets",
    component: TicketsListView,
    meta: {
      requiresAuth: true, // rota exige usuário autenticado
    },
  },
];

// cria a instância do Vue Router, que compara a URL atual com as rotas e define qual componente será renderizado no <router-view />
const router = new VueRouter({
  mode: "history", // deixa as rotas mais limpas - sem history, poderiam ficar '/#/login'
  base: process.env.BASE_URL, // variável disponibilizada na criação do projeto com Vue CLI - representa a base pública da aplicação, que geralmente é "/"
  routes,
});

// guard global de navegação, que roda antes de cada troca de rota
router.beforeEach((to, from, next) => {
  // dentro de component podemos usar this.$store, mas fora, no caso desse router, temos que importar store
  const isAuthenticated = Boolean(store.getters["auth/isAuthenticated"]); // chama o getter isAuthenticated de store/modules/auth.ts para verificar se o usuário está autenticado

  const requiresAuth = to.matched.some((route) =>
    Boolean(route.meta?.requiresAuth)
  ); // verifica se a rota atual possui meta e se requiresAuth é true

  const guestOnly = to.matched.some((route) => Boolean(route.meta?.guestOnly)); // verifica se a rota é somente para visitante

  // se a rota exige autenticação e o usuário não está logado
  if (requiresAuth && !isAuthenticated) {
    next({ name: "login" }); // redireciona para a rota de login

    return;
  }

  // se a rota é só para visitantes e o usuário já está logado
  if (guestOnly && isAuthenticated) {
    next({ name: "tickets" }); // redireciona para a rota de chamados

    return;
  }

  next();
});

export default router;
