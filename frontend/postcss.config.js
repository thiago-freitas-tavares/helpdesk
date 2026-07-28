// PostCSS é como um processador que pega um arquivo CSS de entrada, passa esse CSS por plugins, e gera um CSS final que o navegador entende
// fluxo: tailwind.css -> PostCSS -> plugins: tailwindcss, autoprefixer -> CSS final usado pelo navegador
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
