// Literally just to server render and deliver to the client side.
import React from "react"

const App = () => (
  <main>
    <div className="search">
      <h1>🕵️ ‍📖</h1>
      <div className="search-field">
        <div className="input-container">
          <label className="label" htmlFor="search-field">
            What interests you?
          </label>
          <input id="search-field" type="text" placeholder="Find a book..." />
        </div>
        <button id="search-button">Find</button>
      </div>
    </div>
    <div id="error" className="hidden">
      <h2>Oops</h2>
      <p>Your current browser doesn't support streaming :(</p>
    </div>
    <div id="results" className="results-container" />
  </main>
)

export default App
