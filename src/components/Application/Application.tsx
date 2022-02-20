/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Route, Routes, Link, Navigate } from 'react-router-dom';
import { useAppInit } from './hooks/init';

import { CurrentUser } from './contexts/CurrentUser';
import * as Pages from './pages';

import { SignOut } from '#components/SignOut';
import { CurrentUserInHeader } from '#components/CurrentUserInHeader';

import { AuthorActions } from './pages/Librarian/components/AuthorActions';
import { BookActions } from './pages/Librarian/components/BookActions';

import './styles/buttons.css';
import './styles.css';

export const Application = (): JSX.Element => {
  const { isAppInitialized, currentUserContextValue } = useAppInit();

  if (!isAppInitialized) {
    return <p>Loading ...</p>;
  }

  return (
    <CurrentUser.Provider value={currentUserContextValue}>
      <div className="application">
        <div className="application__header">
          <h1>
            <Link to="/books">Library</Link>
          </h1>
          {currentUserContextValue.user ? (
            <span className="application__header-service-pages-links">
              <Link to="/librarian">Librarian menu</Link>
            </span>
          ) : null}
          {currentUserContextValue.user ? <CurrentUserInHeader /> : null}
          {currentUserContextValue.user ? <SignOut /> : null}
        </div>
        {currentUserContextValue.user ? (
          <Routes>
            <Route path="/" element={<Navigate to="/books" />} />
            <Route path="librarian" element={<Pages.Librarian />}>
              <Route path="authors" element={<AuthorActions />} />
              <Route path="books" element={<BookActions />} />
            </Route>
            <Route path="books" element={<Pages.Books />} />
            <Route path="book/:bookId" element={<Pages.Book />} />
            <Route path="user/:userId" element={<Pages.User />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/*" element={<Navigate to="/sign-in" />} />
            <Route path="/sign-in" element={<Pages.SignIn />} />
          </Routes>
        )}
      </div>
    </CurrentUser.Provider>
  );
};
