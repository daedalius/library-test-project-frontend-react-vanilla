import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import './styles.css';

export const Librarian = React.memo(() => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/librarian') navigate('authors');
  }, [location, navigate]);

  const isAuthorsLinkActive = location.pathname === '/librarian/authors';
  const isBooksLinkActive = location.pathname === '/librarian/books';

  return (
    <div className="librarian-page">
      <Link className={`librarian-page__link ${isAuthorsLinkActive ? 'librarian-page__link_active' : ''}`} to="authors">
        Authors
      </Link>
      <Link className={`librarian-page__link ${isBooksLinkActive ? 'librarian-page__link_active' : ''}`} to="books">
        Books
      </Link>
      <div className="librarian-page__content">
        <Outlet />
      </div>
    </div>
  );
});
Librarian.displayName = 'Librarian';
