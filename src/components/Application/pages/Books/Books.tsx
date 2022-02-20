import React, { useCallback, useEffect, useState } from 'react';

import * as booksApi from '#api/books';
import { Book } from '#components/Book';
import { IBook } from '#entities/Book';
import { BookSearch } from '#components/BookSearch/BookSearch';
import { IBookSearchCriteria } from '#entities/BookSearchCriteria';

import './styles.css';

export function Books() {
  const [books, setBooks] = useState<IBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { response, responseBody } = await booksApi.getBooks({ latest: 10 });
        if (responseBody) {
          setBooks(responseBody);
        } else {
          setIsError(true);
        }
      } catch (e) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleSearchRequest = useCallback((searchRequest: IBookSearchCriteria) => {
    (async () => {
      setIsLoading(true);
      try {
        const { response, responseBody } = await booksApi.getBooks(searchRequest);
        if (response.ok) {
          setBooks(responseBody);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.error(e);
      }
      setBooks(null);
      setIsError(true);
      setIsLoading(false);
    })();
  }, []);

  return (
    <>
      <div className="books-page__book-search">
        <BookSearch onSearchRequest={handleSearchRequest} />
      </div>
      {isLoading ? <p>Loading ...</p> : null}
      {isError ? <p>Unable to fetch books</p> : null}
      {books?.length > 0
        ? books.map((book) => (
            <div key={book.id} className="books-page__book">
              <Book book={book} />
            </div>
          ))
        : null}
      {books?.length === 0 ? <p>No books found</p> : null}
    </>
  );
}
