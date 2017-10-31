// Make a list of things to cache.
const thingsToCache = ["/", "/manifest.json", "/index.html", "/css/main.css", "/js/index.js"]

// Let's name our active cache.
const activeCache = "myApp"

// This function fetches a request and adds its response to the cache for later. :D
const fetchAndCache = request =>
  fetch(request).then(response => {
    caches.open(activeCache).then(cache => {
      cache.put(request, response)
    })

    return response.clone()
  })

/*
  This function checks the cache for a cached response.
  If there isn't one, it fetches and then caches. :D
*/
const responseFromCacheOrFetchAndCache = request =>
  caches.match(request).then(cachedItem => cachedItem || fetchAndCache(request))

// Here's what makes our app nice and fast
const makeBookStream = request => {

  // Let's create a stream.
  const stream = new ReadableStream({

    // On start,
    start(controller) {

      // This function processes a stream coming in (from a Response object)
      const processStream = response => {

        // Get the reader.
        const reader = response.getReader()

        /*
          This function is called everytime the reader reads.
          It enqueues a chunk and then calls itself.
          This is a concept called recursion. Also, it's fun. :D
        */
        const processChunk = chunk => {
          if (chunk.done) return controller.close()
          controller.enqueue(chunk.value)
          return reader.read().then(processChunk)
        }
        reader.read().then(processChunk)
      }

      // This kicks things off!
      responseFromCacheOrFetchAndCache(request).then(response => processStream(response.body))
    },
  })

  return stream
}


// On install, cache all the things!
this.addEventListener("install", event =>
  event.waitUntil(caches.open(activeCache).then(cache => cache.addAll(thingsToCache))),
)

// On fetch,
this.addEventListener("fetch", async event => {
  const { request } = event

  // If we're looking for books,
  if (request.url.indexOf("localhost:3000/books/") > -1) {
    const headers = new Headers({ "Content-Type": "text/html" })
    const response = new Response(makeBookStream(request), headers)

    // Respond with a HTML stream
    return event.respondWith(response)
  }

  // If we're looking for something else (css/js/etc.), get it from the cache, or fetch it.
  return event.respondWith(responseFromCacheOrFetchAndCache(request))
})
