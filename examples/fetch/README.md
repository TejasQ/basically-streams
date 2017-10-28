# Basically, Streaming Fetch

Historically, most progress bars for content loading type activity have been illusions: animations which fill up over a predetermined duration by the designer that do not actually relate to data being transferred at all. I've built some of these myself.

With ReadableStreams in the WHATWG's Fetch API, we're able to have real deal progress bars. [Check it out!](https://tejasq.github.io/basically-streams/examples/fetch) On that page, enter an Image URL (preferably of a LARGE uncached image or something), and watch the progress bar ACTUALLY REFLECT the load status! So cool!

Don't forget to [check out the source](https://github.com/TejasQ/basically-streams/blob/master/examples/fetch/index.js)!
