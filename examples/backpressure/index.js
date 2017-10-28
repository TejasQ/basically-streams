// Get the text content.
const startButton = document.querySelector("#start-button")
const queueSize = document.querySelector("#queue-size").value
const backpressureIndicator = document.querySelector("#backpressure-indicator")
const doneIndicator = document.querySelector("#done-indicator")

const backpressure = new CountQueuingStrategy({ highWaterMark: parseInt(queueSize) || 1000 })

const receiverStream = new WritableStream(
  {
    write(data) {
      document.querySelector("#bar-fill").style.width = `${data / 5000 * 100}%`
    },
    close() {
      startButton.disabled = false
    },
  },
  backpressure
)

const writer = receiverStream.getWriter()

const fill = async (limit = 0, count = 0) => {
  console.log(writer.desiredSize)
  if (writer.desiredSize < -1) {
    backpressureIndicator.style.visibility = "visible"
    await writer.write(
      await new Promise(resolve =>
        setTimeout(() => {
          backpressureIndicator.style.visibility = "hidden"
          resolve(count)
        }, 2000)
      )
    )
  } else {
    backpressureIndicator.style.visibility = "hidden"
    writer.write(count)
  }
  count++
  if (count === limit) {
    return writer.close()
  }
  fill(limit, count++)
}

startButton.addEventListener("click", () => {
  startButton.disabled = true
  fill(5000)
})
