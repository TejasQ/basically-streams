# Basically, Stream Teeing

By design, streams work on the principle of _one source, one consumer_. So if you have a stream that you'd like to be consumed by two consumers, you need help. Enter [Teeing](https://streams.spec.whatwg.org/#rs-tee).

Also known as forking streams, teeing refers to splitting one stream into two identical streams to be read by two distinct readers. It's pretty cool. Under the hood, tee() locks the source stream to the fork, creating two identical, unlocked streams ready for consumption.

[Here's an example](https://tejasq.github.io/basically-streams/examples/teeing/) that, from a source stream, supplies employees in the shape of:

```json
  { id: 1, name: "Something somethington" }
```

This stream is teed to two different streams: the `leftColumnStream` and the `rightColumnStream`.

To read from these split streams, press the correponding button. It's that simple!

Don't forget to check out the [source code](https://github.com/TejasQ/basically-streams/blob/master/examples/teeing/index.js)!
