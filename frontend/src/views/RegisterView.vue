<template>
  <main class="flex min-h-screen items-center justify-center px-6 py-12">
    <section class="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <div class="mb-8">
        <p
          class="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600"
        >
          Helpdesk
        </p>

        <h1 class="text-3xl font-bold text-slate-900">Criar conta</h1>

        <p class="mt-3 text-sm leading-6 text-slate-600">
          Informe seus dados para criar um novo acesso ao sistema de chamados.
        </p>
      </div>

      <form class="space-y-5" @submit.prevent="handleRegister">
        <BaseInput
          id="name"
          label="Nome"
          type="text"
          placeholder="Digite seu nome"
          v-model="name"
        />

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
          type="text"
          placeholder="Digite sua senha"
          v-model="password"
        />

        <p class="text-xs leading-5 text-slate-500">
          A senha deve ter pelo menos 6 caracteres.
        </p>

        <!-- desabilita o botão enquanto name, email ou password estiverem com entrada inválida -->
        <BaseButton type="submit" :full-width="true" :disabled="!isFormValid">
          Criar conta
        </BaseButton>
      </form>

      <div class="mt-6 border-t border-slate-200 pt-6 text-center">
        <p class="text-sm text-slate-600">Já tem uma conta?</p>

        <BaseButton variant="secondary" @click="goToLogin">
          Voltar para login
        </BaseButton>
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BaseButton from "../components/BaseButton.vue";
import BaseInput from "../components/BaseInput.vue";

@Component({
  components: {
    BaseButton,
    BaseInput,
  },
})
export default class RegisterView extends Vue {
  public name = "";
  public email = "";
  public password = "";

  // função que representa um valor calculado a partir de dados reativos e retorna este valor, sem executar uma ação, é computed
  get isFormValid(): boolean {
    return (
      this.name.trim() !== "" &&
      this.email.trim() !== "" &&
      this.password.length >= 6
    );
  }

  // função que representa uma ação, com ou sem retorno, mesmo que use dados reativos, é método
  public handleRegister(): void {
    console.log("Register", {
      name: this.name,
      email: this.email,
      password: this.password,
    });
  }

  public goToLogin(): void {
    this.$router.push("/login");
  }
}
</script>
