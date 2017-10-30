// Get the DOM elements to interact with.
const leftColumnStreamTarget = document.querySelector("#left-column-stream")
const rightColumnStreamTarget = document.querySelector("#right-column-stream")
const leftColumnStreamButton = document.querySelector("#left-column-stream-button")
const rightColumnStreamButton = document.querySelector("#right-column-stream-button")
const resetButton = document.querySelector("#reset-button")

// Here's the dummy stream data.
const employees = [
  { id: 1, name: "Goober Jones" },
  { id: 2, name: "Tejas Indiana" },
  { id: 3, name: "Foo Barrington" },
  { id: 4, name: "Celso Quilala" },
  { id: 5, name: "Magic Mahanake" },
]

// This is the source stream. It's a really simple push-style stream that gives employees.
const sourceStream = new ReadableStream({
  start(controller) {
    employees.forEach(employee => controller.enqueue(employee))
    controller.close()
  },
})

/*
  Here's the fun! We've teed (forked) the sourceStream
  into a leftColumnStream and a rightColumnStream
*/
const [leftColumnStream, rightColumnStream] = sourceStream.tee()

// For fun, we'll have a writeStream for the leftColumnStream
const leftColumnWriteStream = new WritableStream({
  // On write, it'll simply add list items per employee, showing only the ID.
  write(data) {
    const li = document.createElement("li")
    li.innerHTML = data.value.id
    leftColumnStreamTarget.appendChild(li)
  },
})

/*
  Same drill for the right column.

  Notice how the close() is used here, because this stream is piped
  to instead of explicitly read().
*/
const rightColumnWriteStream = new WritableStream({
  write(data) {
    const li = document.createElement("li")
    li.innerHTML = data.name
    rightColumnStreamTarget.appendChild(li)
  },
  close() {
    rightColumnStreamButton.disabled = true
    rightColumnStreamButton.innerHTML = "Stream Closed"
  },
})

// So the writer needs a reader to write to it
const leftColumnReader = leftColumnStream.getReader()

const leftColumnWriter = leftColumnWriteStream.getWriter()
const writeToLeftColumn = async () => {
  // First read,
  const employee = await leftColumnReader.read()

  // then write
  await leftColumnWriter.write(employee)

  /*
    ReadableStreamDefaultReader.closed is a promise that resolves when the stream closes.
    Let's wait until it closes.
  */
  await leftColumnReader.closed

  // Then, disable the button and let the user know it closed.
  leftColumnStreamButton.disabled = true
  leftColumnStreamButton.innerHTML = "Stream closed"
}

// Finally, hook everything up by adding event listeners.
leftColumnStreamButton.addEventListener("click", () => writeToLeftColumn())
rightColumnStreamButton.addEventListener("click", () => rightColumnStream.pipeTo(rightColumnWriteStream))

resetButton.addEventListener("click", () => location.reload())
