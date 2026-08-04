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
          type="password"
          placeholder="Digite sua senha"
          v-model="password"
        />

        <p class="text-xs leading-5 text-slate-500">
          A senha deve ter pelo menos 6 caracteres.
        </p>

        <p v-if="errorMessage">
          {{ errorMessage }}
        </p>

        <!-- desabilita o botão enquanto name, email ou password estiverem com entrada inválida -->
        <BaseButton
          type="submit"
          :full-width="true"
          :disabled="!isFormValid || isLoading"
        >
          {{ submitButtonText }}
        </BaseButton>
      </form>

      <div class="mt-6 border-t border-slate-200 pt-6 text-center">
        <p class="text-sm text-slate-600">Já tem uma conta?</p>

        <BaseButton
          variant="secondary"
          :disabled="isLoading"
          @click="goToLogin"
        >
          Voltar para login
        </BaseButton>
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Vue } from "vue-property-decorator";
import BaseButton from "../components/BaseButton.vue";
import BaseInput from "../components/BaseInput.vue";
import { authService } from "../services/authService";

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
  public errorMessage = "";
  public isLoading = false;

  // função que representa um valor calculado a partir de dados reativos e retorna este valor, sem executar uma ação, é computed
  get isFormValid(): boolean {
    return (
      this.name.trim() !== "" &&
      this.email.trim() !== "" &&
      this.password.length >= 6
    );
  }

  // computed que define o texto do botão de submit
  get submitButtonText(): string {
    return this.isLoading ? "Criando conta..." : "Criar conta";
  }

  // função que representa uma ação, com ou sem retorno, mesmo que use dados reativos, é método
  public async handleRegister(): Promise<void> {
    // não faz nada se o formulário estiver inválido ou se o botão de submit já foi clicado e estiver carregando
    if (!this.isFormValid || this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = ""; // limpa mensagen antiga

    try {
      // chama o backend com os dados digitados no formato RegisterRequest
      await authService.register({
        name: this.name,
        email: this.email,
        password: this.password,
      }); // se o backend retornar erro, vai direto para o catch

      // $router.push é assíncrono, mas o await só é obrigatorio se você precisa executar algo somente depois da navegação terminar
      this.$router.push("/login"); // após o cadastro, envia o usuário para a tela de login - void ignora o resultado da promise
    } catch (error) {
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.isLoading = false; // finally executa sempre, logo, garante que o isLoading será desligado
    }
  }

  public goToLogin(): void {
    if (this.isLoading) {
      return;
    }
    this.$router.push("/login");
  }

  private getErrorMessage(error: unknown): string {
    // verifica se o erro veio do Axios (de uma requisição HTTP)
    if (axios.isAxiosError(error)) {
      // no Axios, o erro geralmente tem o formato de uma message dentro de um data, dentro de um response e a ? evita erro quando alguma parte do caminho está undefined ou null
      const message = error.response?.data?.message;
      // o retorno do Axios pode ser uma string, um array, um objeto, HTML, undefined, mas nesse caso provavelmente retorna sempre string
      if (typeof message == "string") {
        return message;
      }
    }
    return "Não foi possível criar a conta. Tente novamente.";
  }
}
</script>
