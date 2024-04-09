import fs from "fs"
import path from "path"
import { execSync } from "child_process"

const distPath = path.resolve("dist")
const charactersPath = path.join(distPath, "characters")
const charactersSourcesPath = path.resolve("sources", "characters.map.json")

const write_readme = (voices) => {
    const readme_tmp = fs.readFileSync(path.resolve("README.temp.md"), "utf-8")
    const result = readme_tmp.replace(
        "<!-- voices_here -->",
        `| No | Hapin | Cyrillic | Arabic | Voice |\n| --- | --- | --- | --- | --- |\n` +
            voices
                .map(
                    ({ hapin, cyrillic, arabic }, idx) =>
                        `| ${
                            idx + 1
                        } | ${hapin} | ${cyrillic} | ${arabic} | <audio controls src="/characters/${hapin}.mp3"></audio> |`
                )
                .join("\n")
    )

    fs.writeFileSync(path.resolve("dist", "README.md"), result)
}

const generator = () => {
    if (!fs.existsSync(charactersPath)) {
        fs.mkdirSync(charactersPath, { recursive: true })
    }

    const voices = JSON.parse(fs.readFileSync(charactersSourcesPath, "utf8"))

    voices.forEach(({ hapin, cyrillic }) => {
        execSync(
            `edge-tts --text ${cyrillic} --voice kk-KZ-DauletNeural --write-media ${path.join(
                charactersPath,
                `${hapin}.mp3`
            )}`
        )
    })

    write_readme(voices)
}

generator()
