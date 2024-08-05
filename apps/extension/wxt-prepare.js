import { spawnSync } from "child_process"

if (!process.env.SKIP_WXT_PREPARE) {
  spawnSync("pnpm", ["wxt", "prepare"], { stdio: "inherit" })
}
