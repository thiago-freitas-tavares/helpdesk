import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";

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
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
];

// cria a instância do Vue Router, que compara a URL atual com as rotas e define qual componente será renderizado no <router-view />
const router = new VueRouter({
  mode: "history", // deixa as rotas mais limpas - sem history, poderiam ficar '/#/login'
  base: process.env.BASE_URL, // variável disponibilizada na criação do projeto com Vue CLI - representa a base pública da aplicação, que geralmente é "/"
  routes,
});

export default router;
