import { defineConfig } from "wxt"

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],

  manifest: {
    name: "Minimark",
    description: "Save links, notes and files in one place",
  },
})
