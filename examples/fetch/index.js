// Get DOM elements to interact with.
const fetchButton = document.querySelector("#fetch-button")
const resetButton = document.querySelector("#reset-button")
const barFill = document.querySelector("#bar-fill")

// Called when `fetch` is clicked.
const fetchURL = async () => {
  // Reset the bar to empty.
  barFill.style.width = 0
  barFill.style.background = "red"

  // Get the URL.
  const url = document.querySelector("#url-to-fetch").value

  // Fetch!
  fetch(url).then(response => {
    // `response` is a stream!
    const reader = response.body.getReader()

    // Find out how big the response is.
    const length = response.headers.get("Content-Length")

    // Initialize how much we've received. Nothing so far.
    let received = 0

    // What happens when the stream delivers a chunk?
    const onReadChunk = chunk => {
      // Each chunk has a `done` property. If it's done,
      if (chunk.done) {
        // Update the UI so people know it's done.
        document.body.style.backgroundImage = `url(${url})`
        barFill.style.background = "green"
        resetButton.style.display = "block"
        return
      }

      // If it's not done, increment the received variable, and the bar's fill.
      received += chunk.value.length
      barFill.style.width = `${received / length * 100}%`

      // Keep reading, and keep doing this AS LONG AS IT'S NOT DONE.
      reader.read().then(onReadChunk)
    }

    // Do the first read().
    reader.read().then(onReadChunk)
  })
}

// Make the fetch button clickable.
fetchButton.addEventListener("click", () => fetchURL())

// Make the click-to-copy links copiable.
document.querySelectorAll(".click-to-copy").forEach(element =>
  element.addEventListener("click", e => {
    e.target.select()
    document.execCommand("copy")
    document.querySelector(".data-copied").style.visibility = "visible"
  })
)

// Reset is essential
resetButton.addEventListener("click", () => location.reload())
