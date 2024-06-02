import fs from "fs/promises"

import express from "express"
import ViteExpress from "vite-express"

const app = express()

app.get("/data", async (_, res) => {
  const data = await fs.readFile("./data.txt", "utf-8")
  res.send(data.split("\n"))
})

async function deleteLine(line: string) {
  const data = await fs.readFile("./data.txt", "utf-8")
  const lines = data.split("\n")
  lines.splice(lines.indexOf(line), 1)
  await fs.writeFile("./data.txt", lines.join("\n"))
}

app.post("/delete", async (req, res) => {
  req.addListener("data", (chunk) => {
    const line = chunk.toString()
    deleteLine(line)
    res.sendStatus(200)
  })
})

app.post("/add", async (req, res) => {
  req.addListener("data", async (chunk) => {
    const line = chunk.toString()
    await fs.appendFile("./data.txt", "\n" + line)
    res.sendStatus(200)
  })
})

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
)
