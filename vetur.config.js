/** @type {import('vls').VeturConfig} */

// os arquivos do frontend não estavam conseguindo pegar a referência do @ com a pasta do backend aberta simultaneamente

module.exports = {
  settings: {
    "vetur.useWorkspaceDependencies": true,
    "vetur.experimental.templateInterpolationService": true,
  },
  projects: [
    {
      root: "./frontend",
      package: "./package.json",
      tsconfig: "./tsconfig.json",
      globalComponents: ["./src/**/*.vue"],
    },
  ],
};
