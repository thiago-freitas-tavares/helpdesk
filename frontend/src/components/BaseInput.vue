<template>
  <div>
    <!-- for liga o label ao input através do seu id - v-bind (:) significa que o atributo for receberá o valor da @Prop id -->
    <label :for="id" class="mb-1 block text-sm font-medium text-slate-700">
      <!-- interpolação de texto serve para exibir dados dinâmicos dentro do conteúdo de uma tag, para atributos usamos v-bind -->
      {{ label }}
    </label>

    <!-- o v-bind serve para ligar um valor do TypeScript a um atributo HTML (ex: atributo HTML :placeholder recebe o valor da variável TypeScript "placeholder") ou uma prop de componente -->
    <!-- neste caso id, type, value, placeholder são atributos HTML, class é propriedade aplicada ao input HTML e @input é listener do evento HTML -->
    <!-- no Vue 2, um componente customizado com v-model usa, por padrão: prop chamada value e evento chamado input -->
    <!-- escuta evento input, que acontece sempre que o usuário digita, apaga ou altera o valor do campo, e sempre que isso acontece chama o método handleInput -->
    <input
      :id="id"
      :type="type"
      :value="value"
      :placeholder="placeholder"
      class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      @input="handleInput"
    />
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from "vue-property-decorator";

@Component
export default class BaseInput extends Vue {
  @Prop({ type: String, required: true }) // diz ao Vue que essa prop chamada id deve ser uma String e é obrigatória, para validação do Vue em runtime
  public id!: string; // diz ao TypeScript que essa classe tem uma propriedade id, e ela é do tipo string, para poder ser usada dentro da classe

  @Prop({ type: String, required: true })
  public label!: string; // usamos ! porque a prop não recebe valor diretamente na classe, será preenchida pelo Vue no component pai

  @Prop({ type: String, default: "text" })
  public type!: "text" | "email" | "password";

  @Model("input", { type: String, default: "" }) // input é o nome do evento que o v-model vai escutar
  public readonly value!: string; // value é o nome da prop usada pelo v-model

  @Prop({ type: String, default: "" })
  public placeholder!: string;

  public handleInput(event: Event): void {
    // a propriedade .value é do HTMLInputElement, mas o evento pode vir de um input, botão, div, document, etc
    const target = event.target as HTMLInputElement; // informamos ao TypeScript que o elemento que originou o evento (event.target) deve ser tratado como um input HTML
    this.$emit("input", target.value); // (nome, valor) emite um evento chamado input para o componente pai com o valor atual digitado no campo
  }
}
</script>
