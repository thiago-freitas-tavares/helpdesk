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

          <p
            v-if="deleteErrorMessage"
            class="mb-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {{ deleteErrorMessage }}
          </p>

          <div class="mb-6">
            <h3 class="mb-2 text-sm font-semibold text-slate-900">Descrição</h3>

            <p class="whitespace-pre-line text-sm leading-6 text-slate-700">
              {{ ticket.description }}
            </p>
          </div>

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

      <section class="mt-6 rounded-2xl bg-white p-8 shadow">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-slate-900">Comentários</h2>

          <p class="mt-2 text-sm text-slate-600">
            Acompanhe e registre comentários sobre este chamado.
          </p>
        </div>

        <form class="mb-6 space-y-3" @submit.prevent="handleCreateComment">
          <div>
            <label
              for="comment"
              class="mb-1 block text-sm font-medium text-slate-700"
            >
              Novo comentário
            </label>

            <textarea
              id="comment"
              v-model="commentContent"
              rows="4"
              placeholder="Digite seu comentário"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            ></textarea>
          </div>

          <p
            v-if="commentErrorMessage"
            class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {{ commentErrorMessage }}
          </p>

          <div class="flex justify-end">
            <BaseButton
              type="submit"
              :disabled="!isCommentFormValid || isCreatingComment"
            >
              {{ commentButtonText }}
            </BaseButton>
          </div>
        </form>

        <p
          v-if="isLoadingComments"
          class="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700"
        >
          Carregando comentários...
        </p>

        <p
          v-else-if="commentsErrorMessage"
          class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {{ commentsErrorMessage }}
        </p>

        <p
          v-if="commentDeleteErrorMessage"
          class="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {{ commentDeleteErrorMessage }}
        </p>

        <p
          v-else-if="!hasComments"
          class="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600"
        >
          Nenhum comentário encontrado.
        </p>

        <div v-else class="space-y-4">
          <article
            v-for="comment in comments"
            :key="comment.id"
            class="rounded-xl border border-slate-200 p-4"
          >
            <div class="mb-2 flex items-center justify-between gap-4">
              <div>
                <p class="text-sm font-semibold text-slate-900">
                  {{ comment.author.name }}
                </p>

                <p class="text-xs text-slate-500">
                  {{ formatDate(comment.createdAt) }}
                </p>
              </div>

              <BaseButton
                v-if="canDeleteComment(comment)"
                variant="danger"
                :disabled="isDeletingCommentId !== null"
                @click="handleDeleteComment(comment)"
              >
                {{ getCommentDeleteButtonText(comment.id) }}
              </BaseButton>
            </div>

            <p class="whitespace-pre-line text-sm leading-6 text-slate-700">
              {{ comment.content }}
            </p>
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
import { commentService } from "../services/commentService";
import { TicketPriority, TicketResponse, TicketStatus } from "../types/ticket";
import { UserResponse } from "../types/auth";
import { CommentResponse } from "../types/comment";

@Component({
  components: {
    BaseButton,
  },
})
export default class TicketDetailView extends Vue {
  public ticket: TicketResponse | null = null;
  public comments: CommentResponse[] = [];
  public commentContent = "";
  public isLoading = false;
  public isLoadingComments = false;
  public isCreatingComment = false;
  public isDeleting = false;
  public isDeletingCommentId: number | null = null;
  public errorMessage = "";
  public commentsErrorMessage = "";
  public commentErrorMessage = "";
  public commentDeleteErrorMessage = "";
  public deleteErrorMessage = "";

  get ticketId(): number | null {
    const id = Number(this.$route.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return null;
    }

    return id;
  }

  get currentUser(): UserResponse | null {
    return this.$store.getters["auth/currentUser"];
  }

  get assigneeName(): string {
    return this.ticket?.assignee?.name || "Sem responsável";
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

  get hasComments(): boolean {
    return this.comments.length > 0;
  }

  get isCommentFormValid(): boolean {
    return this.commentContent.trim() !== "";
  }

  get commentButtonText(): string {
    return this.isCreatingComment ? "Comentando..." : "Comentar";
  }

  public mounted(): void {
    this.loadTicket();
    this.loadComments();
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

  public async loadComments(): Promise<void> {
    if (this.isLoadingComments) {
      return;
    }

    if (this.ticketId === null) {
      this.commentsErrorMessage = "Chamado inválido.";

      return;
    }

    this.isLoadingComments = true;
    this.commentsErrorMessage = "";

    try {
      this.comments = await commentService.listByTicketId(this.ticketId);
    } catch (error) {
      this.commentsErrorMessage = this.getErrorMessage(error);
    } finally {
      this.isLoadingComments = false;
    }
  }

  public async handleCreateComment(): Promise<void> {
    if (
      !this.isCommentFormValid ||
      this.isCreatingComment ||
      this.ticketId === null
    ) {
      return;
    }

    this.isCreatingComment = true;
    this.commentErrorMessage = "";

    try {
      const createdComment = await commentService.create(this.ticketId, {
        content: this.commentContent.trim(),
      });

      this.comments.push(createdComment);
      this.commentContent = "";
    } catch (error) {
      this.commentErrorMessage = this.getErrorMessage(error);
    } finally {
      this.isCreatingComment = false;
    }
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

      this.$router.push({ name: "tickets" });
    } catch (error) {
      this.deleteErrorMessage = this.getErrorMessage(error);
    } finally {
      this.isDeleting = false;
    }
  }

  public canDeleteComment(comment: CommentResponse): boolean {
    return (
      this.currentUser !== null && comment.author.id === this.currentUser.id
    );
  }

  public getCommentDeleteButtonText(commentId: number): string {
    return this.isDeletingCommentId === commentId ? "Excluindo..." : "Excluir";
  }

  public async handleDeleteComment(comment: CommentResponse): Promise<void> {
    if (
      this.ticketId === null ||
      this.isDeletingCommentId !== null ||
      !this.canDeleteComment(comment)
    ) {
      return;
    }

    const confirmed = window.confirm(
      // eslint-disable-next-line prettier/prettier
      "Tem certeza que deseja excluir este comentário?",
    );

    if (!confirmed) {
      return;
    }

    this.isDeletingCommentId = comment.id;
    this.commentDeleteErrorMessage = "";

    try {
      await commentService.remove(this.ticketId, comment.id);

      this.comments = this.comments.filter(
        // eslint-disable-next-line prettier/prettier
        (currentComment) => currentComment.id !== comment.id,
      );
    } catch (error) {
      this.commentDeleteErrorMessage = this.getErrorMessage(error);
    } finally {
      this.isDeletingCommentId = null;
    }
  }

  public goBack(): void {
    this.$router.push({ name: "tickets" });
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
