const { defineConfig } = require("vite");

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        client: "./src/client.ts",
        styles: "./src/styles.scss",
        background: "/src/background.ts",
        options: "/src/options.ts",
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
});