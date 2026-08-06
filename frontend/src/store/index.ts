import Vue from "vue";
import Vuex from "vuex";
import { authModule } from "./modules/auth";

Vue.use(Vuex); // instala o Vuex dentro do Vue, o que permite usar this.$store dentro dos componentes

// cria e exporta a store principal da aplicação.
export default new Vuex.Store({
  modules: {
    auth: authModule,
  },
});
