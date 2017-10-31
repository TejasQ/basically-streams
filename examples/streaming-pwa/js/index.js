// Static JS file.

// First up, get DOM things we'll interact with.
const searchField = document.querySelector("#search-field")
const searchButton = document.querySelector("#search-button")
const resultsContainer = document.querySelector("#results")

// A function to get our books.
const getBooks = () => {

  // Reset the results container.
  resultsContainer.innerHTML = ""

  // Make a note of the start time.
  const start = performance.now()

  // Fetch stuff.
  fetch(`/books/${searchField.value}`).then(response => {

    // Make a note of when we get the Response object.
    let firstResponse = performance.now()
    console.log(`Done! 🔥 Took ${firstResponse - start}ms`)

    // Pipe its stream to a new WritableStream, that
    response.body.pipeTo(
      new WritableStream({

        // on write, updates the DOM with decoded HTML.
        write(piece) {
          const decoder = new TextDecoder()
          resultsContainer.innerHTML += decoder.decode(piece, { stream: true })
        },

        // When its finished,
        close() {

          // Make a note of how long it took from getting the stream, to rendering it.
          console.log(`Streaming done! 🔥 ${performance.now() - firstResponse}ms after request.`)
        },
      }),
    )
  })
}

// On click, or on Enter, find books!
searchButton.addEventListener("click", () => getBooks())
document.addEventListener("keyup", e => e.keyCode === 13 && getBooks())

// Set up our serviceWorker for offline things and faster streaming.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("../sw.js")
    .then(() => console.log("serviceWorker registered. 😉"))
    .catch(error => console.error(`serviceWorker Registration failed with ${error} ☹️`))
}
