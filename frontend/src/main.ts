import Vue from "vue"; // no Vue3 é createApp
import App from "./App.vue"; // componente principal da aplicação
import router from "./router"; // Vue Router
import store from "./store"; // Vuex

// 'npm install -D tailwindcss@3 postcss autoprefixer' e depois 'npx tailwindcss init -p' cria os arquivos 'tailwind.config.js' e 'postcss.config.js'
import "@/assets/styles/tailwind.css";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App), // componente principal renderizado será o App.vue
}).$mount("#app"); // monta a aplicação dentro do elemento <div id="app"></div> do arquivo public/index.html
