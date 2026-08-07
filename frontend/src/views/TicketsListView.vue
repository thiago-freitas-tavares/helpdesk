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

      <section class="mb-6 rounded-2xl bg-white p-8 shadow">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-slate-900">Filtros</h2>

            <p class="mt-2 text-sm text-slate-600">
              Filtre os chamados por status, prioridade e data de criação.
            </p>
          </div>

          <BaseButton @click="goToCreateTicket"> Novo chamado </BaseButton>
        </div>

        <form class="grid gap-4 md:grid-cols-4" @submit.prevent="applyFilters">
          <div>
            <label
              for="status"
              class="mb-1 block text-sm font-medium text-slate-700"
            >
              Status
            </label>

            <select
              id="status"
              v-model="selectedStatus"
              :disabled="isLoading"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              <option value="">Todos</option>
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
              v-model="selectedPriority"
              :disabled="isLoading"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              <option value="">Todas</option>
              <option :value="TicketPriority.LOW">Baixa</option>
              <option :value="TicketPriority.MEDIUM">Média</option>
              <option :value="TicketPriority.HIGH">Alta</option>
            </select>
          </div>

          <div>
            <label
              for="createdAtOrder"
              class="mb-1 block text-sm font-medium text-slate-700"
            >
              Ordenação
            </label>

            <select
              id="createdAtOrder"
              v-model="createdAtOrder"
              :disabled="isLoading"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              <option value="DESC">Mais recentes primeiro</option>
              <option value="ASC">Mais antigos primeiro</option>
            </select>
          </div>

          <div class="flex items-end gap-3">
            <BaseButton type="submit" :disabled="isLoading">
              Aplicar
            </BaseButton>

            <BaseButton
              type="button"
              variant="secondary"
              :disabled="isLoading"
              @click="clearFilters"
            >
              Limpar
            </BaseButton>
          </div>
        </form>
      </section>

      <section class="rounded-2xl bg-white p-8 shadow">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-slate-900">
              Lista de chamados
            </h2>

            <p class="mt-2 text-sm text-slate-600">
              Acompanhe os chamados cadastrados no sistema.
            </p>
          </div>

          <BaseButton variant="secondary" @click="loadTickets">
            Atualizar
          </BaseButton>
        </div>

        <p
          v-if="isLoading"
          class="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700"
        >
          Carregando chamados...
        </p>

        <p
          v-else-if="errorMessage"
          class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {{ errorMessage }}
        </p>

        <p
          v-else-if="!hasTickets"
          class="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600"
        >
          Nenhum chamado encontrado.
        </p>

        <div v-else class="space-y-4">
          <article
            v-for="ticket in tickets"
            :key="ticket.id"
            class="rounded-xl border border-slate-200 p-4"
          >
            <div class="mb-3 flex items-start justify-between gap-4">
              <div>
                <h3 class="font-semibold text-slate-900">
                  #{{ ticket.id }} - {{ ticket.title }}
                </h3>

                <p class="mt-1 text-sm text-slate-600">
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

            <p class="text-sm leading-6 text-slate-700">
              {{ ticket.description }}
            </p>

            <div class="mt-4 flex items-center justify-between">
              <p class="text-xs text-slate-500">
                Criado em {{ formatDate(ticket.createdAt) }}
              </p>

              <BaseButton
                variant="secondary"
                @click="goToTicketDetail(ticket.id)"
              >
                Abrir
              </BaseButton>
            </div>
          </article>
        </div>
      </section>
    </section>
  </main>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Vue } from "vue-property-decorator";
import BaseButton from "../components/BaseButton.vue";
import { ticketService } from "../services/ticketService";
import { UserResponse } from "../types/auth";
import {
  ListTicketsParams,
  TicketPriority,
  TicketResponse,
  TicketStatus,
} from "../types/ticket";

@Component({
  components: {
    BaseButton,
  },
})
export default class TicketsListView extends Vue {
  public tickets: TicketResponse[] = [];
  public selectedStatus: TicketStatus | "" = "";
  public selectedPriority: TicketPriority | "" = "";
  public createdAtOrder: "ASC" | "DESC" = "DESC";
  public isLoading = false;
  public errorMessage = "";
  public TicketStatus = TicketStatus;
  public TicketPriority = TicketPriority;

  get currentUser(): UserResponse | null {
    return this.$store.getters["auth/currentUser"]; // chama o getter currentUser de store/modules/auth.ts que retorna state.user no formato userResponse
  }

  get currentUserName(): string {
    return this.currentUser?.name || "usuário"; // pega apenas a propriedade name de currentUser, se não tiver, retorna usuário
  }

  get hasTickets(): boolean {
    return this.tickets.length > 0;
  }

  public mounted(): void {
    void this.loadTickets();
  }

  public async loadTickets(): Promise<void> {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = "";

    try {
      this.tickets = await ticketService.list(this.getListTicketsParams());
    } catch (error) {
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }

  public applyFilters(): void {
    void this.loadTickets();
  }

  public clearFilters(): void {
    this.selectedStatus = "";
    this.selectedPriority = "";
    this.createdAtOrder = "DESC";

    void this.loadTickets();
  }

  public async handleLogout(): Promise<void> {
    await this.$store.dispatch("auth/logout"); // dispatch chama a action logout store/modules/auth.ts que limpa o localStorage e o state do Vuex

    this.$router.push("/login"); // redireciona para a tela de login
  }

  public goToCreateTicket(): void {
    this.$router.push({ name: "ticket-create" });
  }

  public goToTicketDetail(ticketId: number): void {
    void this.$router.push({
      name: "ticket-detail",
      params: {
        id: String(ticketId),
      },
    });
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

  private getListTicketsParams(): ListTicketsParams {
    const params: ListTicketsParams = {
      createdAtOrder: this.createdAtOrder,
    };

    if (this.selectedStatus !== "") {
      params.status = this.selectedStatus;
    }

    if (this.selectedPriority !== "") {
      params.priority = this.selectedPriority;
    }

    return params;
  }

  private getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;

      if (typeof message === "string") {
        return message;
      }
    }

    return "Não foi possível carregar os chamados.";
  }
}
</script>
