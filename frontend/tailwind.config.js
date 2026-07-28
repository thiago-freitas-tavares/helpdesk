/** @type {import('tailwindcss').Config} */
// exporta a configuração no padrão CommonJS
module.exports = {
  // o Tailwind funciona escaneando o arquivos especificados, encontrando as classes usadas no HTML/template e gerando o CSS final correspondente
  content: ["./public/index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {}, // configurações de tema - cores, fontes, espaçamentos personalizados, etc
  },
  plugins: [],
};
