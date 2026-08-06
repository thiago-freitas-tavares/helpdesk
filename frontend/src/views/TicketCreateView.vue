<template>
  <main class="min-h-screen bg-slate-100 px-6 py-8">
    <section class="mx-auto max-w-3xl">
      <header class="mb-8">
        <p
          class="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600"
        >
          Helpdesk
        </p>

        <h1 class="text-3xl font-bold text-slate-900">Novo chamado</h1>

        <p class="mt-2 text-sm text-slate-600">
          Preencha as informações abaixo para abrir um novo chamado.
        </p>
      </header>

      <section class="rounded-2xl bg-white p-8 shadow">
        <form class="space-y-5" @submit.prevent="handleCreateTicket">
          <BaseInput
            id="title"
            label="Título"
            type="text"
            placeholder="Digite o título do chamado"
            v-model="title"
          />

          <div>
            <label
              for="description"
              class="mb-1 block text-sm font-medium text-slate-700"
            >
              Descrição
            </label>

            <textarea
              id="description"
              v-model="description"
              rows="6"
              placeholder="Descreva o problema ou solicitação"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            ></textarea>
          </div>

          <div>
            <label
              for="priority"
              class="mb-1 block text-sm font-medium text-slate-700"
            >
              Prioridade
            </label>

            <select
              id="priority"
              v-model="priority"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              <option :value="TicketPriority.LOW">Baixa</option>
              <option :value="TicketPriority.MEDIUM">Média</option>
              <option :value="TicketPriority.HIGH">Alta</option>
            </select>
          </div>

          <p
            v-if="errorMessage"
            class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {{ errorMessage }}
          </p>

          <div class="flex items-center justify-end gap-3">
            <BaseButton
              type="button"
              variant="secondary"
              :disabled="isLoading"
              @click="goBack"
            >
              Cancelar
            </BaseButton>

            <BaseButton type="submit" :disabled="!isFormValid || isLoading">
              {{ submitButtonText }}
            </BaseButton>
          </div>
        </form>
      </section>
    </section>
  </main>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Vue } from "vue-property-decorator";
import BaseButton from "../components/BaseButton.vue";
import BaseInput from "../components/BaseInput.vue";
import { ticketService } from "../services/ticketService";
import { TicketPriority } from "../types/ticket";

@Component({
  components: {
    BaseButton,
    BaseInput,
  },
})
export default class TicketCreateView extends Vue {
  public title = "";
  public description = "";
  public priority: TicketPriority = TicketPriority.MEDIUM;
  public isLoading = false;
  public errorMessage = "";
  public TicketPriority = TicketPriority;

  get isFormValid(): boolean {
    return this.title.trim() !== "" && this.description.trim() !== "";
  }

  get submitButtonText(): string {
    return this.isLoading ? "Criando chamado..." : "Criar chamado";
  }

  public async handleCreateTicket(): Promise<void> {
    if (!this.isFormValid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = "";

    try {
      await ticketService.create({
        title: this.title,
        description: this.description,
        priority: this.priority,
      });

      this.$router.push({ name: "tickets" });
    } catch (error) {
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }

  public goBack(): void {
    if (this.isLoading) {
      return;
    }

    this.$router.push({ name: "tickets" });
  }

  private getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;

      if (typeof message === "string") {
        return message;
      }
    }

    return "Não foi possível criar o chamado.";
  }
}
</script>
