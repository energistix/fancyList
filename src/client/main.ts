import "./style.css"
import { Signal } from "signal-polyfill"
import { effect } from "../common/effect"

const data = await fetch("/data")
const lines: Signal.State<string[]> = new Signal.State(await data.json())

effect(() => {
  const list = document.getElementById("list")
  if (!list) return
  list.innerHTML = ""

  for (const line of lines.get()) {
    const li = document.createElement("li")

    const deleteButton = document.createElement("button")
    deleteButton.textContent = "Delete"
    deleteButton.addEventListener("click", () => {
      lines.set(lines.get().filter((l) => l !== line))
      fetch("/delete", {
        method: "POST",
        body: line
      })
    })
    deleteButton.style.marginRight = "0.5em"
    li.classList.add(
      "bg-gray-800",
      "p4",
      "rounded-lg",
      "shadow",
      "relative",
      "h-12",
      "flex",
      "items-center",
      "justify-between",
      "pl-4"
    )
    deleteButton.classList.add(
      ..."delete bg-red-500 text-gray-300 px-3 py-1 rounded absolute top-2 right-2 hover:bg-red-700".split(
        " "
      )
    )
    li.appendChild(deleteButton)

    const link = document.createElement("a")
    link.textContent = line
    link.href = `https://www.curseforge.com/minecraft/search?page=1&pageSize=20&sortBy=relevancy&class=mc-mods&search=${line}&version=1.20.1&gameVersionTypeId=4`
    link.classList.add("text-blue-400")
    link.target = "_blank"
    link.rel = "noopener noreferrer"

    li.appendChild(link)

    list.appendChild(li)
  }
})

document.getElementById("add")?.addEventListener("click", (ev) => {
  ev.preventDefault()
  const input = document.getElementById("input") as HTMLInputElement
  if (!input) return
  if (!input.value) return

  lines.set([...lines.get(), input.value])

  fetch("/add", {
    method: "POST",
    body: input.value
  })

  input.value = ""

  input.focus()
})
