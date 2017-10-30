// Get the DOM elements we interact with.
const startButton = document.querySelector("#start-button")
const resetButton = document.querySelector("#reset-button")
const backpressureIndicator = document.querySelector("#backpressure-indicator")
const doneIndicator = document.querySelector("#done-indicator")
const progressBar = document.querySelector("#bar-fill")

// How many things do we want to write to the WritableStream?
const thingsToWrite = 5000

// Our WritableStream should be able to only process this many things at a time.
const thresholdToApplyBackpressure = 1000

/*
  This defines a QueuingStrategy that basically defines the `highWaterMark`: the point at which
  the stream applies backpressure.
*/
const backpressure = new CountQueuingStrategy({ highWaterMark: thresholdToApplyBackpressure })

// This is our receiver stream
const receiverStream = new WritableStream(
  {
    // When someone writes data to it,
    write(data) {
      // Fill the progress bar with a percentage of the total count
      progressBar.style.width = `${data / thingsToWrite * 100}%`
    },

    // When the source closes,
    close() {
      // Update the startButton
      startButton.innerHTML = "Stream Closed."

      // Show the resetButton (thanks @ricea)
      resetButton.style.display = "block"
    },
  },
  /*
    The second argument to the WritableStream constructor is the
    QueuingStrategy.
  */
  backpressure
)

// We need an instance of this writer that we'll use.
const writer = receiverStream.getWriter()

/*
  This FILLS the writer's sync `limit` times.
  The second argument helps it keep track of which iteration it's on
*/
const fill = async (limit = thingsToWrite, count = 0) => {
  // If the writer's highWaterMark is reached,
  if (writer.desiredSize === 0) {
    // Set the backpressureIndicator and show it.
    backpressureIndicator.innerHTML = `Backpressure Detected (after ${count} items processed)`
    backpressureIndicator.style.visibility = "visible"

    // Wait for it to be free again to process more things.
    await writer.write(
      /*
        Make the next thing take a while to process
        in order to give the browser time to catch up,
        for demonstration purposes.
      */
      await new Promise(resolve =>
        setTimeout(() => {
          backpressureIndicator.style.visibility = "hidden"
          resolve(count)
        }, 1000)
      )
    )

    /*
    If the writer's highWaterMark isn't reached,
    as in, if it has room to breathe,
  */
  } else {
    // Don't show the indicator
    backpressureIndicator.style.visibility = "hidden"

    // Write to the writer (that updates the width of the progress bar)
    writer.write(count)
  }

  // Increment the `count` so this function doesn't run infinitely
  count++

  // If we've reached the limit, close the writer and stop the stream.
  if (count === limit) return writer.close()

  /*
    If not, repeat ALL these steps again, rewriting to the
    WritableStream instantly unless it applies backpressure.
  */
  fill(limit, count++)
}

// Finally, when one clicks the start button, start things!
startButton.addEventListener("click", () => {
  startButton.disabled = true
  fill()
})

// Simple reset
resetButton.addEventListener("click", () => location.reload())
