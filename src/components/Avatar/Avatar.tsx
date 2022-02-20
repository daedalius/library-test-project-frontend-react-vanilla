import React from 'react';

import './styles.css'

export const Avatar = React.memo((props: { size: 'small' | 'medium' | 'large'; login: string; avatarUrl?: string }) => {
  if (!props.avatarUrl) return null;

  return (
    <img
      className={'avatar' + ' avatar_' + props.size}
      src={props.avatarUrl}
      alt={'user ' + props.login + ' profile image'}
    />
  );
});
Avatar.displayName = 'Avatar';
