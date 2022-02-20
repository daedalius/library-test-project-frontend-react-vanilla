import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getBookCopiesOnUser } from '#api/copies';
import { getUsers } from '#api/users';
import { getBooks } from '#api/books';
import { IBook, IUser } from '#entities';
import { Avatar } from '#components/Avatar';

import './styles.css';

export const User = React.memo(() => {
  const { userId } = useParams();

  const [user, setUser] = useState<IUser>(null);
  const [books, setBooks] = useState<IBook[]>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const [usersQuery, bookCopiesQuery] = await Promise.all([getUsers([userId]), getBookCopiesOnUser(userId)]);
        if (usersQuery.response.ok && bookCopiesQuery.response.ok) {
          setUser(usersQuery.responseBody[0]);

          if (bookCopiesQuery.responseBody.length > 0) {
            const bookIds = bookCopiesQuery.responseBody.map((bc) => bc.bookId);
            const userBooksQuery = await getBooks({ ids: bookIds });
            if (userBooksQuery.response.ok) {
              setBooks(userBooksQuery.responseBody);
            } else {
              throw new Error('Unable to fetch borrowed books data');
            }
          } else {
            setBooks([]);
          }

          setIsLoading(false);
          setIsError(false);

          return;
        }
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
      setIsError(true);
    })();
  }, []);

  if (isLoading) return <p>Loading ...</p>;
  if (isError) return <p>Unable to fetch user data</p>;

  return (
    <div className="user-profile" data-element="user-profile">
      <div className="user-profile__avatar">
        <Avatar size="large" avatarUrl={user.avatarUrl} login={user.login} />
      </div>
      <div className="user-profile__info">
        <div className="user-profile__login">{user.login}</div>
        <div className='user-profile__borrowed-copies'>
          Borrowed book copies:
          {!books || books.length === 0 ? <p>User has no borrowed book copies</p> : null}
          {books && books.length ? (
            <ul>
              {books.map((b) => (
                <ul key={b.id}>
                  <Link to={`/book/${b.id}`}>{b.title}</Link>
                </ul>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
});
User.displayName = 'User';
