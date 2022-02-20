import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getBooks } from '#api/books';
import { Book as BookDetails } from '#components/Book';
import { IBook, IBookCopy } from '#entities';
import { CurrentUser } from '#components/Application/contexts/CurrentUser';

import './styles.css';
import { borrowBookCopy, getFreeBookCopies, returnBookCopy } from '#api/copies';
import { BookComments } from '#components/BookComments';

export function Book() {
  const { bookId } = useParams();
  const userContext = useContext(CurrentUser);

  const [book, setBook] = useState<IBook | null>(null);
  const [freeBookCopies, setFreeBookCopies] = useState<IBookCopy[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // fetching book and book copies
  useEffect(() => {
    (async () => {
      if (!bookId) {
        setIsError(true);
        return;
      }

      try {
        const { response, responseBody } = await getBooks({ ids: [bookId] });
        if (response.ok && responseBody?.length) {
          setBook(responseBody[0]);

          {
            const { response, responseBody } = await getFreeBookCopies(bookId);
            if (response.ok && Array.isArray(responseBody)) {
              setFreeBookCopies(responseBody);
            }
          }

          setIsError(false);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
      setIsError(true);
    })();
  }, [bookId]);

  const [isCopyStatusLoading, setIsCopyStatusLoading] = useState(false);
  const [isCopyStatusError, setIsCopyStatusError] = useState(false);
  const handleReturnBookButtonClick = useCallback(() => {
    (async () => {
      try {
        const bookCopyId = userContext.borrowedBookCopies.find((bc) => bc.bookId === book.id).id;
        const { response, responseBody } = await returnBookCopy(bookCopyId);
        if (response.ok) {
          console.assert(responseBody.id === bookCopyId);
          userContext.setBorrowedBookCopies((copies) => copies.filter((bc) => bc.id !== bookCopyId));

          setFreeBookCopies((bc) => [...bc, responseBody]);
          setIsCopyStatusLoading(false);
          setIsCopyStatusError(false);
          return;
        }
      } catch (e) {
        console.error(e);
      }

      setIsCopyStatusLoading(false);
      setIsCopyStatusError(true);
    })();
  }, [book?.id, userContext]);

  const handleBorrowBookButtonClick = useCallback(() => {
    (async () => {
      try {
        const { response, responseBody } = await borrowBookCopy(book.id, userContext.user.id);
        if (response.ok) {
          userContext.setBorrowedBookCopies((copies) => [...copies, responseBody]);

          setIsCopyStatusLoading(false);
          setIsCopyStatusError(false);
          return;
        }
      } catch (e) {
        console.error(e);
      }

      setIsCopyStatusLoading(false);
      setIsCopyStatusError(true);
    })();
  }, [book?.id, userContext]);

  const copyStatus = useMemo(() => {
    if (!book || !userContext.borrowedBookCopies) return <p>Loading ...</p>;
    const isBookBorrowedByUser = (userContext.borrowedBookCopies || []).find((bc) => bc.bookId === book.id);

    if (isCopyStatusLoading) return <p>Loading ...</p>;
    if (isCopyStatusError) return <p>Unable to check book availability status. Please try later</p>;
    if (isBookBorrowedByUser) return <input type="button" onClick={handleReturnBookButtonClick} value="Return" />;
    if (freeBookCopies?.length === 0) return <p>No free book copies available</p>;
    return <input type="button" onClick={handleBorrowBookButtonClick} value="Borrow" />;
  }, [
    book,
    userContext.borrowedBookCopies,
    isCopyStatusLoading,
    isCopyStatusError,
    freeBookCopies,
    handleReturnBookButtonClick,
    handleBorrowBookButtonClick,
  ]);

  if (isLoading) return <p>Loading ...</p>;
  if (isError) return <p>Unable to fetch book data</p>;

  return (
    <>
      <div className="book-page">
        <BookDetails book={book} />
        <div className="book-page__buttons">{copyStatus}</div>
      </div>
      <div className="book-page__comments">
        <BookComments book={book} />
      </div>
    </>
  );
}
