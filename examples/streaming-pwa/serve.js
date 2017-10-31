import fetch from "node-fetch"
import express from "express"
import React from "react"
import { renderToStaticNodeStream } from "react-dom/server"

import { startPage, endPage } from "./js/template"

import App from "./components/App"
import Results from "./components/Results/Results"

const app = express()

// Static things.
app.use("/manifest.json", express.static("manifest.json"))
app.use("/sw.js", express.static("sw.js"))
app.use("/js", express.static("js"))
app.use("/css", express.static("css"))
app.use("/icons", express.static("icons"))

// Our books endpoint.
app.get("/books/:book", async (req, res) => {

  // It's HTML!
  res.set("Content-Type", "text/html")

  // Get our results and shape them.
  const results = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=title:${req.params.book}`,
  )
    .then(r => r.json())
    .then(r => r.items.map(item => item.volumeInfo))

  // Create a stream from this component, and
  const stream = renderToStaticNodeStream(<Results results={results} />)

  // Pipe it into the response.
  stream.pipe(res)
})

// index.html
app.use("/", (req, res) => {

  // We're serving HTML.
  res.set("Content-Type", "text/html")

  // Write just the first bit.
  res.write(startPage)

  // Create a stream from the HTML of this component
  const stream = renderToStaticNodeStream(<App />)

  /*
    Pipe it into the response.
    { end: false } doesn't close the stream when its finished
    so we can </body></html> ourselves.
  */
  stream.pipe(res, { end: false })

  stream.on("end", () => {

    // We do that here.
    res.write(endPage)
    res.end()
  })
})

// Start!
app.listen(3000, () => console.log("You can open the app at http://localhost:3000/ 😄"))
