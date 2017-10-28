# _Basically_, [Streams](https://streams.spec.whatwg.org) 🌊
So something (relatively) new and fun in browsers, are these two APIs: ReadableStream and WritableStream. 😮

What they allow you to do, is basically send and receive chunks of _things_ progressively (that then combine into the final large _thing_), as opposed to moving around _entire things_ from server -> browser -> user.

This is really cool.

Streams have some fancy bells and whistles that we'll get to talk about in this project. I'll list them below, but I'd highly recommend starting with the root-level project ([index.html](https://github.com/TejasQ/basically-streams/blob/master/index.html), [index.js](https://github.com/TejasQ/basically-streams/blob/master/index.js), [index.css](https://github.com/TejasQ/basically-streams/blob/master/index.css)), and moving into the examples from there.

## Why?
The answer to this question is _basically_ the same answer to _all the things_ in my "Basically" series: this project aims to explain streams to any level of developer: beginner, intermediate or advanced, focused primarly on the beginners.

The hope is that the concept of streams within a browser would not be scary, causing developers to shy away from it; but rather, that this concept would be dispalyed for how simple it really is, enabling developers to embrace it and run with it, allowing the creation beautiful, streamy things.

## Examples (work in progress)
In the next few hours, I am to push examples of cool stream features, such as:
- Backpressure
- Teeing (Forked streams)
- _(Really)_ Progressive Web Apps
- AJAX Requests with Streams (and progress bars)

If you'd like to contribute _your_ use case or examples, pull requests are welcome! Wooo!
