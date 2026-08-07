<template>
  <main class="min-h-screen bg-slate-100 px-6 py-8">
    <section class="mx-auto max-w-4xl">
      <header class="mb-8 flex items-center justify-between">
        <div>
          <p
            class="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600"
          >
            Helpdesk
          </p>

          <h1 class="text-3xl font-bold text-slate-900">Detalhes do chamado</h1>

          <p class="mt-2 text-sm text-slate-600">
            Visualize as informações completas do chamado selecionado.
          </p>
        </div>

        <div class="flex gap-3">
          <BaseButton
            v-if="canEditTicket"
            variant="danger"
            :disabled="isDeleting"
            @click="handleDeleteTicket"
          >
            {{ deleteButtonText }}
          </BaseButton>

          <BaseButton
            v-if="canEditTicket"
            :disabled="isDeleting"
            @click="goToEdit"
          >
            Editar
          </BaseButton>

          <BaseButton
            variant="secondary"
            :disabled="isDeleting"
            @click="goBack"
          >
            Voltar
          </BaseButton>
        </div>
      </header>

      <section class="rounded-2xl bg-white p-8 shadow">
        <p
          v-if="isLoading"
          class="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700"
        >
          Carregando chamado...
        </p>

        <p
          v-else-if="errorMessage"
          class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {{ errorMessage }}
        </p>

        <article v-else-if="ticket">
          <div class="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 class="text-2xl font-bold text-slate-900">
                #{{ ticket.id }} - {{ ticket.title }}
              </h2>

              <p class="mt-2 text-sm text-slate-600">
                Aberto por {{ ticket.requester.name }}
              </p>
            </div>

            <div class="flex gap-2">
              <span
                class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
              >
                {{ getStatusLabel(ticket.status) }}
              </span>

              <span
                class="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
              >
                {{ getPriorityLabel(ticket.priority) }}
              </span>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="mb-2 text-sm font-semibold text-slate-900">Descrição</h3>

            <p class="whitespace-pre-line text-sm leading-6 text-slate-700">
              {{ ticket.description }}
            </p>
          </div>

          <p
            v-if="deleteErrorMessage"
            class="mb-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {{ deleteErrorMessage }}
          </p>

          <div
            class="grid gap-4 border-t border-slate-200 pt-6 text-sm text-slate-600 md:grid-cols-2"
          >
            <p>
              <strong class="text-slate-900">Criado em:</strong>
              {{ formatDate(ticket.createdAt) }}
            </p>

            <p>
              <strong class="text-slate-900">Atualizado em:</strong>
              {{ formatDate(ticket.updatedAt) }}
            </p>

            <p>
              <strong class="text-slate-900">Responsável:</strong>
              {{ assigneeName }}
            </p>

            <p>
              <strong class="text-slate-900">Autor:</strong>
              {{ ticket.requester.email }}
            </p>
          </div>
        </article>
      </section>
    </section>
  </main>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Vue } from "vue-property-decorator";
import BaseButton from "../components/BaseButton.vue";
import { ticketService } from "../services/ticketService";
import { TicketPriority, TicketResponse, TicketStatus } from "../types/ticket";
import { UserResponse } from "../types/auth";

@Component({
  components: {
    BaseButton,
  },
})
export default class TicketDetailView extends Vue {
  public ticket: TicketResponse | null = null;
  public isLoading = false;
  public errorMessage = "";
  public isDeleting = false;
  public deleteErrorMessage = "";

  get ticketId(): number | null {
    const id = Number(this.$route.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return null;
    }

    return id;
  }

  get assigneeName(): string {
    return this.ticket?.assignee?.name || "Sem responsável";
  }

  get currentUser(): UserResponse | null {
    return this.$store.getters["auth/currentUser"];
  }

  get canEditTicket(): boolean {
    return (
      this.ticket !== null &&
      this.currentUser !== null &&
      this.ticket.requester.id === this.currentUser.id
    );
  }

  get deleteButtonText(): string {
    return this.isDeleting ? "Excluindo..." : "Excluir";
  }

  public mounted(): void {
    this.loadTicket();
  }

  public async loadTicket(): Promise<void> {
    if (this.isLoading) {
      return;
    }

    if (this.ticketId === null) {
      this.errorMessage = "Chamado inválido.";

      return;
    }

    this.isLoading = true;
    this.errorMessage = "";

    try {
      this.ticket = await ticketService.findById(this.ticketId);
    } catch (error) {
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }

  public goToEdit(): void {
    if (!this.ticket) {
      return;
    }

    void this.$router.push({
      name: "ticket-edit",
      params: {
        id: String(this.ticket.id),
      },
    });
  }

  public async handleDeleteTicket(): Promise<void> {
    if (!this.ticket || this.isDeleting || !this.canEditTicket) {
      return;
    }

    const confirmed = window.confirm(
      // eslint-disable-next-line prettier/prettier
      "Tem certeza que deseja excluir este chamado? Esta ação não pode ser desfeita.",
    );

    if (!confirmed) {
      return;
    }

    this.isDeleting = true;
    this.deleteErrorMessage = "";

    try {
      await ticketService.remove(this.ticket.id);

      void this.$router.push({ name: "tickets" });
    } catch (error) {
      this.deleteErrorMessage = this.getErrorMessage(error);
    } finally {
      this.isDeleting = false;
    }
  }

  public goBack(): void {
    this.$router.push({ name: "tickets" });
  }

  public getStatusLabel(status: TicketStatus): string {
    const labels: Record<TicketStatus, string> = {
      [TicketStatus.OPEN]: "Aberto",
      [TicketStatus.IN_PROGRESS]: "Em andamento",
      [TicketStatus.DONE]: "Concluído",
      [TicketStatus.CANCELED]: "Cancelado",
    };

    return labels[status];
  }

  public getPriorityLabel(priority: TicketPriority): string {
    const labels: Record<TicketPriority, string> = {
      [TicketPriority.LOW]: "Baixa",
      [TicketPriority.MEDIUM]: "Média",
      [TicketPriority.HIGH]: "Alta",
    };

    return labels[priority];
  }

  public formatDate(value: string): string {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  }

  private getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;

      if (typeof message === "string") {
        return message;
      }
    }

    return "Não foi possível carregar o chamado.";
  }
}
</script>
