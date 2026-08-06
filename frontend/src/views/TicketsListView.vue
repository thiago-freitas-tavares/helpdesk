<template>
  <main class="min-h-screen bg-slate-100 px-6 py-8">
    <section class="mx-auto max-w-5xl">
      <header class="mb-8 flex items-center justify-between">
        <div>
          <p
            class="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600"
          >
            Helpdesk
          </p>

          <h1 class="text-3xl font-bold text-slate-900">Chamados</h1>

          <p class="mt-2 text-sm text-slate-600">
            Bem-vindo, {{ currentUserName }}.
          </p>
        </div>

        <BaseButton variant="secondary" @click="handleLogout">
          Sair
        </BaseButton>
      </header>

      <section class="rounded-2xl bg-white p-8 shadow">
        <h2 class="text-xl font-semibold text-slate-900">Lista de chamados</h2>

        <p class="mt-3 text-sm leading-6 text-slate-600">
          Esta é uma tela protegida. Na próxima etapa, vamos conectar esta tela
          ao backend para listar os chamados reais.
        </p>
      </section>
    </section>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BaseButton from "../components/BaseButton.vue";
import { UserResponse } from "../types/auth";

@Component({
  components: {
    BaseButton,
  },
})
export default class TicketsListView extends Vue {
  get currentUser(): UserResponse | null {
    return this.$store.getters["auth/currentUser"]; // chama o getter currentUser de store/modules/auth.ts que retorna state.user no formato userResponse
  }

  get currentUserName(): string {
    return this.currentUser?.name || "usuário"; // pega apenas a propriedade name de currentUser, se não tiver, retorna usuário
  }

  public async handleLogout(): Promise<void> {
    await this.$store.dispatch("auth/logout"); // dispatch chama a action logout store/modules/auth.ts que limpa o localStorage e o state do Vuex

    this.$router.push("/login"); // redireciona para a tela de login
  }
}
</script>
