// este arquivo define os erros esperados da aplicação com mensagem e status HTTP
export class AppError extends Error { // Error é uma classe nativa do JavaScript, não precisa ser importada
  public readonly statusCode: number; // propriedade que guardará o status HTTP que quero retornar

  constructor(message: string, statusCode = 400) { // este 400 representa o statusCode padrão, caso nenhum seja informado
    super(message); // chama o construtor da classe Error e entrega a mensagem para ela
    this.statusCode = statusCode;
  }
}
