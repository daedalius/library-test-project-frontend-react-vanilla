import React from 'react';
import { Link } from 'react-router-dom';

import { IBook } from '#entities';

import './styles.css';

export function Book(props: { book: IBook }) {
  const { id, title, authors, description, coverUrl } = props.book;

  return (
    <div className="book">
      {coverUrl ? <img className="book__cover" src={coverUrl}></img> : null}
      <div className="book__details">
        <h3 className="book__title">
          <Link to={'/book/' + id}>{title}</Link>
        </h3>
        <p className="book__authors">Authors: {authors.map((a) => a.name).join(', ')}</p>
        {description ? <p className="book__description">{description}</p> : null}
      </div>
    </div>
  );
}
