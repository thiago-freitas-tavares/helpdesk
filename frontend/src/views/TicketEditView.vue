<template>
  <main class="min-h-screen bg-slate-100 px-6 py-8">
    <section class="mx-auto max-w-3xl">
      <header class="mb-8">
        <p
          class="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600"
        >
          Helpdesk
        </p>

        <h1 class="text-3xl font-bold text-slate-900">Editar chamado</h1>

        <p class="mt-2 text-sm text-slate-600">
          Atualize as informações do chamado selecionado.
        </p>
      </header>

      <section class="rounded-2xl bg-white p-8 shadow">
        <p
          v-if="isLoadingTicket"
          class="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700"
        >
          Carregando chamado...
        </p>

        <p
          v-else-if="loadErrorMessage"
          class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {{ loadErrorMessage }}
        </p>

        <form v-else class="space-y-5" @submit.prevent="handleUpdateTicket">
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
              for="status"
              class="mb-1 block text-sm font-medium text-slate-700"
            >
              Status
            </label>

            <select
              id="status"
              v-model="status"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              <option :value="TicketStatus.OPEN">Aberto</option>
              <option :value="TicketStatus.IN_PROGRESS">Em andamento</option>
              <option :value="TicketStatus.DONE">Concluído</option>
              <option :value="TicketStatus.CANCELED">Cancelado</option>
            </select>
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
              :disabled="isSaving"
              @click="goBack"
            >
              Cancelar
            </BaseButton>

            <BaseButton type="submit" :disabled="!isFormValid || isSaving">
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
import { UserResponse } from "../types/auth";
import { TicketPriority, TicketResponse, TicketStatus } from "../types/ticket";

@Component({
  components: {
    BaseButton,
    BaseInput,
  },
})
export default class TicketEditView extends Vue {
  public ticket: TicketResponse | null = null;
  public title = "";
  public description = "";
  public status: TicketStatus = TicketStatus.OPEN;
  public priority: TicketPriority = TicketPriority.MEDIUM;
  public isLoadingTicket = false;
  public isSaving = false;
  public loadErrorMessage = "";
  public errorMessage = "";
  public TicketStatus = TicketStatus;
  public TicketPriority = TicketPriority;

  get ticketId(): number | null {
    const id = Number(this.$route.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return null;
    }

    return id;
  }

  get isFormValid(): boolean {
    return this.title.trim() !== "" && this.description.trim() !== "";
  }

  get submitButtonText(): string {
    return this.isSaving ? "Salvando..." : "Salvar alterações";
  }

  get currentUser(): UserResponse | null {
    return this.$store.getters["auth/currentUser"];
  }

  private canEditTicket(ticket: TicketResponse): boolean {
    return (
      this.currentUser !== null && ticket.requester.id === this.currentUser.id
    );
  }

  public mounted(): void {
    this.loadTicket();
  }

  public async loadTicket(): Promise<void> {
    if (this.isLoadingTicket) {
      return;
    }

    if (this.ticketId === null) {
      this.loadErrorMessage = "Chamado inválido.";

      return;
    }

    this.isLoadingTicket = true;
    this.loadErrorMessage = "";

    try {
      const ticket = await ticketService.findById(this.ticketId);

      if (!this.canEditTicket(ticket)) {
        void this.$router.push({
          name: "ticket-detail",
          params: {
            id: String(ticket.id),
          },
        });

        return;
      }

      this.ticket = ticket;
      this.title = ticket.title;
      this.description = ticket.description;
      this.status = ticket.status;
      this.priority = ticket.priority;
    } catch (error) {
      this.loadErrorMessage = this.getErrorMessage(error);
    } finally {
      this.isLoadingTicket = false;
    }
  }

  public async handleUpdateTicket(): Promise<void> {
    if (!this.isFormValid || this.isSaving || this.ticketId === null) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = "";

    try {
      const updatedTicket = await ticketService.update(this.ticketId, {
        title: this.title,
        description: this.description,
        status: this.status,
        priority: this.priority,
      });

      this.$router.push({
        name: "ticket-detail",
        params: {
          id: String(updatedTicket.id),
        },
      });
    } catch (error) {
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.isSaving = false;
    }
  }

  public goBack(): void {
    if (this.isSaving) {
      return;
    }

    if (this.ticketId === null) {
      this.$router.push({ name: "tickets" });

      return;
    }

    this.$router.push({
      name: "ticket-detail",
      params: {
        id: String(this.ticketId),
      },
    });
  }

  private getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;

      if (typeof message === "string") {
        return message;
      }
    }

    return "Não foi possível processar o chamado.";
  }
}
</script>
