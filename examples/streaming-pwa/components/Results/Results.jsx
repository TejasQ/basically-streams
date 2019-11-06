import React from "react"

import Book from "../Book/Book"

const Results = ({ results }) => (
  <div className="results">
    {results.map(result => (
      <Book
        key={result.infoLink}
        link={result.infoLink}
        image={result.imageLinks && result.imageLinks.thumbnail}
        title={result.title}
        author={result.authors && result.authors[0]}
        description={result.description}
      />
    ))}
  </div>
)

export default Results
