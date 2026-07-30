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

      <BaseButton variant="secondary" @click="goToLogin">
        Voltar para login
      </BaseButton>
    </section>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BaseButton from "../components/BaseButton.vue";

@Component({
  components: {
    BaseButton,
  },
})
export default class RegisterView extends Vue {
  public goToLogin(): void {
    this.$router.push("/login");
  }
}
</script>
