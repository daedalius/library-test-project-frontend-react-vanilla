import React, { FormEvent, useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as credentialsApi from '#api/credentials';

import { CurrentUser } from '../../contexts/CurrentUser/CurrentUser';

import './styles.css';

export function SignIn() {
  const navigate = useNavigate();
  const userContext = useContext(CurrentUser);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginChange = useCallback((e) => {
    setLogin(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const handleFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const { response, responseBody } = await credentialsApi.signIn({ login, password });
      if (response.status == 200) {
        userContext.setUser(responseBody);
        navigate('/books');
      } else {
        if (response.status === 400) {
          alert('Credentials entered are incorrect');
        } else {
          alert('Error occured while calling backend API');
        }
      }
    },
    [login, navigate, password, userContext]
  );

  return (
    <form className="sign-in" onSubmit={handleFormSubmit}>
      <label htmlFor="login">Login: </label>
      <input type="text" id="login" value={login} onChange={handleLoginChange} />
      <label htmlFor="password">Password: </label>
      <input type="password" id="password" value={password} onChange={handlePasswordChange} />
      <input type="submit" value="Sign In" />
    </form>
  );
}
