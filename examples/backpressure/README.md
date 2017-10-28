# Basically, Backpressure

Streams support a cool thing called [backpressure](https://streams.spec.whatwg.org/#pipe-chains). This amazing concept basically enables two-way communication within a stream, where the consumer of the stream can speak to its source and be like _HEY MAN SLOW DOWN I CAN'T PROCESS THINGS THAT FAST_.

Basically, you give a stream a maxiumum number of _things_ it can hold in its [underlying sink](https://streams.spec.whatwg.org/#ws-model), any more than that, and it says _dude, wait_.

## For example,

Basically, [in this example](https://tejasq.github.io/basically-streams/examples/backpressure), we try and write to our WritableStream 5000 times in quick succession. We've configured the WritableStream to only be able to handle 1000 things in its queue, using what is called a CountQueuingStrategy's highWaterMark, which is the point at which the WritableStream starts applying backpressure, saying back off, bro.

When you click Start, you should be able to see it all in action.

Each time the progress bar stops, the WritableStream is applying backpressure.
