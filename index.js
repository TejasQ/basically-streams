// Get the text content.
const textToMove = document.querySelector("#text-to-move").textContent
const moveButton = document.querySelector("#move-button")

const startStream = () => {
  /*
    "I want to move" -> ["I", " ", "w", "a" ...]
    This turns the text into an array
  */
  const charactersToMove = textToMove.split("")

  /*
    A function to help us know if we're on the last element of this array.
    If we are, we'll enqueue it and then CLOSE THE STREAM!
  */
  const isLast = index => length => index === length - 1

  /*
    We'll call this function LAST in our stream.
    Basically, do something (enqueue, more about that in a second)
    and CLOSE THE STREAM!
  */
  const enqueueAndClose = (controller, character) => {
    controller.enqueue(character)
    controller.close("lol")
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
          () =>
            // with this function that checks
            !isLast(index)(charactersToMove.length) // are we NOT the last?
              ? controller.enqueue(character) // Good! Add things to the stream and send away!
              : // Are we the last now? Cool, enqueue the last thing and close the stream!
                enqueueAndClose(controller, character),
          index * 50 // Do this every (index * 50) milliseconds
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

    /*
      Overwrite the HTML of the "I'm so bored I want to move" div
      with the same text, but without this character we have just
      received as `data` in the argument here.
    */
    document.querySelector("#text-to-move").innerHTML = document
      .querySelector("#text-to-move")
      .textContent.replace(data, "")

    // Add the same character to the other box.
    document.querySelector("#text-to-move_target").appendChild(textNode)
  },

  // When the stream is done,
  close(data) {
    // WOOOO
    moveButton.disabled = true
    moveButton.innerHTML = "Now <em>I'm</em> lonely :("
    console.log("%c STREAM CLOSED WOOO!", "color:#0af;font-size:20px")
  },
})

/*
  Finally, wire it all up by listening for a click on the move button
  that starts the stream and pipes it into our receiver WritableStream.
*/
moveButton.addEventListener("click", () => startStream().pipeTo(receiverStream))
