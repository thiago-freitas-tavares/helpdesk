<template>
  <!-- neste caso o disabled é necessário para evitar quando o usuário for enviar uma requisição para o backend, que ele clique várias vezes e várias requisições sejam enviadas -->
  <!-- $emit é um método do Vue usado para um componente filho avisar o componente pai que algo aconteceu -->
  <!-- este @click emite um evento chamado click (poderia chamar outroNome) para o componente pai, assim ele pode usar '<BaseButton @click="nomeDaFuncao">' (@outroNome="nomeDaFuncao")-->
  <!-- eu poderia colocar @click="$emit('click', $event)", mas nesse caso, o componente pai não precisa receber nenhuma informação do evento, só precisa saber que o botão foi clicado -->
  <!-- o <slot /> é um espaço reservado para conteúdo vindo do componente pai - uma prop label funcionaria, mas slot é mais flexível  -->
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class BaseButton extends Vue {
  @Prop({ type: String, default: "button" })
  public type!: "button" | "submit" | "reset";

  @Prop({ type: String, default: "primary" })
  public variant!: "primary" | "secondary";

  @Prop({ type: Boolean, default: false })
  public fullWidth!: boolean;

  @Prop({ type: Boolean, default: false })
  public disabled!: boolean;

  // uma computed serve para calcular valor a partir de dados reativos vindos do component, component pai, props, Vuex, Vue Router
  // só recalcula quando as dependências mudam, ou seja, se for chamado várias vezes sem alteração de dados, não precisa recalcular (cache), já um método calcula todas as vezes
  // a classe CSS do botão será resultado desta computed
  get buttonClasses(): string {
    const baseClasses =
      "rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";

    const widthClasses = this.fullWidth ? "w-full" : "";

    const variantClasses =
      this.variant === "secondary"
        ? "border border-blue-600 text-blue-600 hover:bg-blue-50"
        : "bg-blue-600 text-white hover:bg-blue-700";

    return [baseClasses, widthClasses, variantClasses]
      .filter(Boolean) // remove valores "falsy" do array (false, 0, "", null, undefined, NaN) - neste caso string vazia
      .join(" "); // junta os itens do array em uma string, colocando um espaço entre eles
  }
}
</script>
