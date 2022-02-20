import { useEffect, useMemo, useState } from 'react';

import { getBookCopiesBorrowedByUser } from '#api/copies';
import { fetchCurrentUser } from '#api/credentials';
import { IBookCopy } from '#entities/BookCopy';
import { IUser } from '#entities/User';
import { ICurrentUserContextValue } from '../contexts/CurrentUser/CurrentUser';

import { cookies } from '#utils/cookies';

export function useAppInit(): { isAppInitialized: boolean; currentUserContextValue: ICurrentUserContextValue } {
  const [isAppInitialized, setIsAppInitialized] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<IUser>(null);
  const [borrowedBookCopies, setBorrowedBookCopies] = useState<IBookCopy[]>(null);

  useEffect(() => {
    const sessionId = cookies.get('session-id');
    if (sessionId) {
      (async () => {
        try {
          const currentUserResponse = await fetchCurrentUser();
          if (currentUserResponse.responseBody) {
            const borrowedBookCopiesResponse = await getBookCopiesBorrowedByUser(currentUserResponse.responseBody.id);
            if (borrowedBookCopiesResponse.responseBody) {
              setCurrentUser(currentUserResponse.responseBody);
              setBorrowedBookCopies(borrowedBookCopiesResponse.responseBody);
              return;
            }
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsAppInitialized(true);
        }
      })();
    } else {
      setIsAppInitialized(true);
    }
  }, [currentUser?.login]);

  const contextValue = useMemo(
    () => ({
      user: currentUser,
      setUser: setCurrentUser,
      borrowedBookCopies: borrowedBookCopies,
      setBorrowedBookCopies: setBorrowedBookCopies,
    }),
    [currentUser, borrowedBookCopies]
  );

  return {
    isAppInitialized,
    currentUserContextValue: contextValue,
  };
}
