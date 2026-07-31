<template>
  <!-- flex = flexbox - permite a utilização de propriedades, como align-items, justify-content, gap, flex-wrap -->
  <!-- vh = viewport height - 100% da altura da área visível da tela  / items = vertical e justify = horizontal-->
  <!-- rem = root em - escala com alteração no tamanho da fonte do elemento raiz da página - 1rem = 16px -->
  <!-- para view de uma página inteira, é interessante usar main, para componentes menores não  -->
  <main class="flex min-h-screen items-center justify-center px-6 py-12">
    <!-- o Tailwind não tem Card, por isso usamos o HTML <section> (poderia ser outra estrutura) + classes do Tailwind para construir um-->
    <section class="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <div class="mb-8">
        <p
          class="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600"
        >
          Helpdesk
        </p>

        <h1 class="text-3xl font-bold text-slate-900">Entrar no sistema</h1>

        <p class="mt-3 text-sm leading-6 text-slate-600">
          Acesse sua conta para acompanhar, criar e gerenciar chamados.
        </p>
      </div>

      <!-- submit escuta o evento de envio do formulário e prevent impede o comportamento padrão do HTML de recarregar a página -->
      <form class="space-y-5" @submit.prevent="handleLogin">
        <!-- neste caso id, label, type e placeholder são props do component BaseInput e v-model uma diretiva do Vue -->
        <!-- v-model faz ligação bidirecional (two way data binding) entre o input e a propriedade email - quando o usuário digita, this.email é atualizado automaticamente -->
        <!-- v-model="email" é equivalente a :value="email" e @input="email = $event" ($event = valor do $emit, que é atribuído à propriedade email) -->
        <BaseInput
          id="email"
          label="E-mail"
          type="email"
          placeholder="Digite seu e-mail"
          v-model="email"
        />

        <BaseInput
          id="password"
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
          v-model="password"
        />

        <!-- a prop fullWidth deve ser passada em kebab-case no Vue/HTML e usar v-bind para passar o valor como booleano real, senão passa como string -->
        <!-- este botão não precisa de @click, pois o @submit do form é quem escuta o envio e chama handleLogin-->
        <BaseButton type="submit" :full-width="true"> Entrar </BaseButton>
      </form>

      <div class="mt-6 border-t border-slate-200 pt-6 text-center">
        <p class="text-sm text-slate-600">Ainda não tem uma conta?</p>

        <!-- variant não precisa de v-bind, pois passa string fixa, e o @click escuta o $emit('click') do BaseButton para chamar goToRegister -->
        <BaseButton variant="secondary" @click="goToRegister">
          Criar conta
        </BaseButton>
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BaseButton from "../components/BaseButton.vue";
import BaseInput from "../components/BaseInput.vue";

// este decorator diz: transforme a classe abaixo em componente Vue e registre BaseButton e BaseInput para uso no template
@Component({
  components: {
    BaseButton,
    BaseInput,
  },
})
export default class LoginView extends Vue {
  // propriedades equivalentes ao data() da Options API - guardam os valores reativos dos inputs
  public email = "";
  public password = "";

  public handleLogin(): void {
    // imprime no console no formato de objeto - depois vamos chamar o backend com Axios
    console.log("Login", {
      email: this.email, // sem this, o método não encontra a propriedade, pois ela não foi criada dentro do método, com this, o método consegue acessar propriedades da classe
      password: this.password,
    });
  }

  public goToRegister(): void {
    this.$router.push("/register");
  }
}
</script>
