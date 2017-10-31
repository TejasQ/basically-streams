# Basically, [_(Really)_ Progressive Web App](https://server-bqgfmiyvni.now.sh)s
![Lighthouse Report](https://tejasq.github.io/basically-streams/examples/streaming-pwa/lighthouse-report.png)

This project contains a [Progressive Web App](https://en.wikipedia.org/wiki/Progressive_web_app) (PWA from this point on), that:

- Caches data, and
- Works offline

Both of these things are pretty much basic prerequisites to call something a PWA. However, this project has some extra bells and whistles that make it _really_ progressive. It:

- Uses [ReactDOM](https://reactjs.org/docs/react-dom.html)'s streaming renderer on the server to provide streaming HTML responses that leverage the browser's streaming HTML parser 🔥
- Uses its serviceWorker to intercept requests for data and returns more streaming HTML when a request is made. 🔥

This makes the entire application a _truly streamed_ application that delivers data incredibly fast (fastest I've seen).

## The Project
The project itself is fairly trivial: it is a simply book search, that queries Google's Books API and returns books that you search for. The interesting part is that it returns streams, that are then processed in the client. The even more interesting part is that if the repsonses are cached, the service worker returns the stream instead, creating a `1-4ms` request-response cycle for all of this data. This is pretty cool. :D

## Getting Started

There's a [live demo](https://server-bqgfmiyvni.now.sh) hosted on [now](https://now.sh/) that you can check out. If you'd like to run it locally, it's as simple as:

- `git clone <URL>`
- `cd basically-streams/examples/streaming-pwa`
- `yarn install`
- `yarn start`

The app will be accessible on `http://localhost:3000/`

## Why?

This is part of my _Basically_ series that seeks to make concepts that could be scary to newer developers accessible and easy to grasp, in order to empower, enable, and inspire developers to create beautiful things all over the internet.

I hope this helped you. :)
