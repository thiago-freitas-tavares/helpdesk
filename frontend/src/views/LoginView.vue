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

        <p
          v-if="errorMessage"
          class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {{ errorMessage }}
        </p>

        <p
          v-if="successMessage"
          class="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700"
        >
          {{ successMessage }}
        </p>

        <!-- a prop fullWidth deve ser passada em kebab-case no Vue/HTML e usar v-bind para passar o valor como booleano real, senão passa como string -->
        <!-- este botão não precisa de @click, pois o @submit do form é quem escuta o envio e chama handleLogin-->
        <BaseButton
          type="submit"
          :full-width="true"
          :disabled="!isFormValid || isLoading"
        >
          {{ submitButtonText }}
        </BaseButton>
      </form>

      <div class="mt-6 border-t border-slate-200 pt-6 text-center">
        <p class="text-sm text-slate-600">Ainda não tem uma conta?</p>

        <!-- variant não precisa de v-bind, pois passa string fixa, e o @click escuta o $emit('click') do BaseButton para chamar goToRegister -->
        <BaseButton
          variant="secondary"
          :disabled="isLoading"
          @click="goToRegister"
        >
          Criar conta
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
import { authService } from "@/services/authService";

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
  public errorMessage = "";
  public successMessage = "";
  public isLoading = false;

  get isFormValid(): boolean {
    return this.email.trim() !== "" && this.password.length >= 6;
  }

  get submitButtonText(): string {
    return this.isLoading ? "Entrando..." : "Entrar";
  }

  public async handleLogin(): Promise<void> {
    if (!this.isFormValid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = "";
    this.successMessage = "";

    try {
      // chama o backend com os dados digitados no formato LoginRequest e salva o objeto recebido como resposta na variável response
      const response = await authService.login({
        email: this.email, // sem this, o método não encontra a propriedade, pois ela não foi criada dentro do método, com this, o método consegue acessar propriedades da classe
        password: this.password,
      });

      // salva o token JWT no localStorage do navegador, que continua existindo mesmo se o usuário fechar e abrir o navegador de novo (chave, valor)
      localStorage.setItem("token", response.token); // depois, quando o frontend precisar chamar uma rota protegida, ele poderá pegar esse token e mandar no header
      // salva os dados do usuário no localStorage, mas localStorage só salva texto e response.user é um objeto, por isso o stringify
      localStorage.setItem("user", JSON.stringify(response.user)); // depois para recuperar os dados seria const user = JSON.parse(localStorage.getItem("user") || "null");

      this.successMessage = "Login realizado com sucesso."; // por enquanto só exibimos a mensagem de sucesso, depois redirecionaremos para a tela de chamados
    } catch (error) {
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }

  public goToRegister(): void {
    if (this.isLoading) {
      return;
    }
    this.$router.push("/register");
  }

  private getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      if (typeof message == "string") {
        return message;
      }
    }
    return "Não foi possível criar a conta. Tente novamente.";
  }
}
</script>
