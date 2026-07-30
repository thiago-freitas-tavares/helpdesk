<template>
  <!-- casca visual da aplicação -->
  <div class="min-h-screen bg-slate-100 text-slate-900">
    <!-- onde o Vue Router renderiza a página atual - /login -> LoginView ou /register -> RegisterView -->
    <router-view />
  </div>
</template>

<script lang="ts">
// Options API - data, methods, computed, props, components, watch, mounted, created
// Class Component - propriedades, métodos, get, @Prop, @Component, @Watch, mounted, created
// Composition API - ref/reactive, setup, computed, defineProps, defineComponent, watch, onMounted, setup
import { Component, Vue } from "vue-property-decorator"; // estamos usando Class Component através das libs vue-class-component e vue-property-decorator

@Component // decorator que tranforma a classe abaixo em um component Vue
export default class App extends Vue {} // classe App herda os recursos do Vue, como lifecycle hooks, acesso ao router, store etc
</script>
