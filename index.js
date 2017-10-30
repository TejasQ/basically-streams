// Get the source div.
const textToMove = document.querySelector("#text-to-move")

// Get DOM things to interact with
const moveButton = document.querySelector("#move-button")
const resetButton = document.querySelector("#reset-button")

const startStream = () => {
  /*
    "I want to move" -> ["I", " ", "w", "a" ...]
    This turns the text into an array
  */
  const charactersToMove = textToMove.textContent.split("")

  /*
    A function to help us know if we're on the last element of this array.
    If we are, we'll enqueue it and then CLOSE THE STREAM!
  */
  const isLast = index => length => index === length - 1

  /*
    Removes a character from the left column and
    moves it (enqueues it) into the stream, to be piped to the
    right column. (Thanks, @ricea)
  */
  const removeAndEnqueue = (controller, character) => {
    textToMove.innerHTML = textToMove.textContent.replace(character, "")
    controller.enqueue(character)
  }

  /*
  Create and return a ReadableStream from our text.
  ReadableStreams have methods in them that each get a controller (ReadableStreamController)
  that allow you to control your stream.

  Controllers can enqueue things (add them to the stream),
  close the stream, throw errors, and get the desired size of the stream.

  It's a nice piece of kit.
*/
  return new ReadableStream({
    start(controller) {
      /*
      For each letter, set a timeout to `enqueue` a piece of data,
      in this case a letter, every (index * 50) seconds.

      So,
        - I will be enqueued immediately,
        - " " will be enqueued after 50ms,
        - "w" will be enqueud after 100ms,
        - you get the picture.
    */
      charactersToMove.forEach((character, index) =>
        // Set a timeout,
        setTimeout(
          // With this function that,
          () => {
            /*
              Removes and enqueues a character into the stream (for relocation),
              see line 26.
            */
            removeAndEnqueue(controller, character)

            // If we're at the last character,
            if (isLast(index)(charactersToMove.length)) {
              // Close the stream
              controller.close()
            }
          },
          index * 50 // Do this every (`index` * 50) milliseconds
        )
      )
    },
  })
}

/*
  Create a WritableStream that we'll pipe the ReadableStream into!

  The WritableStream also has methods, with a controller (WritableStreamWriter).
  This thing can:
  - check if the stream has closed
  - get the desired size
  - get a ready status
  - abort the stream
  - do something when the stream pouring into it finishes
  - release its lock on a ReadableStream
  - and of course, do something when it receives data (write()).

  For brevity, we'll check out the write() and close() methods.
*/
const receiverStream = new WritableStream({
  // On Write (when we get data),
  write(data) {
    // Create a text node,
    const textNode = document.createTextNode(data)

    // Add the same character to the other box.
    document.querySelector("#text-to-move_target").appendChild(textNode)
  },

  // When the stream is done,
  close(data) {
    // WOOOO
    moveButton.disabled = true
    moveButton.innerHTML = "Now <em>I'm</em> lonely :("
    resetButton.style.display = "block"
    console.log("%c STREAM CLOSED WOOO!", "color:#0af;font-size:20px")
  },
})

/*
  Finally, wire it all up by listening for a click on the move button
  that starts the stream and pipes it into our receiver WritableStream.
*/
moveButton.addEventListener("click", () => startStream().pipeTo(receiverStream))
resetButton.addEventListener("click", () => location.reload())
