import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { CurrentUser } from '#components/Application/contexts/CurrentUser';
import { Avatar } from '#components/Avatar';

import './styles.css';

export function CurrentUserInHeader() {
  const userContext = useContext(CurrentUser);

  return (
    <Link className="current-user-in-header" to={'/user/' + userContext.user.id} data-element="current-user-in-header">
      <Avatar {...userContext.user} size="medium" />
      <span>{userContext.user.login}</span>
    </Link>
  );
}
