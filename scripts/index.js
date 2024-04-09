import fs from "fs"
import path from "path"
import { execSync } from "child_process"

const distPath = path.resolve("dist")
const charactersPath = path.join(distPath, "characters")
const charactersSourcesPath = path.resolve("sources", "characters.map.json")

const generator = () => {
    if (!fs.existsSync(charactersPath)) {
        fs.mkdirSync(charactersPath, { recursive: true })
    }

    JSON.parse(fs.readFileSync(charactersSourcesPath, "utf8")).forEach(
        ({ hapin, cyrillic }) => {
            execSync(
                `edge-tts --text ${cyrillic} --voice kk-KZ-DauletNeural --write-media ${path.join(
                    charactersPath,
                    `${hapin}.mp3`
                )}`
            )
        }
    )
}

generator()
