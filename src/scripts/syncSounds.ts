import "dotenv/config"
import fs from "fs"
import path from "path"
import { getSoundPackTargetDir, SOUND_PACK_SOURCE_DIR } from "../sounds/paths"

const SOURCE_DIR = `./${SOUND_PACK_SOURCE_DIR}`

export function syncSoundPack() {
  const files = fs.readdirSync(SOURCE_DIR)
  const targetDir = getSoundPackTargetDir()

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  for (const file of files) {
    fs.copyFileSync(path.join(SOURCE_DIR, file), path.join(targetDir, file))
  }
}

function main() {
  syncSoundPack()
}

if (require.main === module) {
  main()
}
