import React from "react"

const Book = ({ image, link, title, subtitle, author, description }) => (
  <div className="book">
    <div className="book__image">
      <img alt={title} src={image} />
    </div>
    <div className="book__info">
      <h2>
        <a target="_blank" href={link} title={title}>
          {title} {subtitle && `&mdash; ${subtitle}`}
        </a>
      </h2>
      <h3>{author}</h3>
      <p>{`${description ? description.slice(0, 550) : "No description"}...`}</p>
    </div>
  </div>
)

export default Book
