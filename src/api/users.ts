import { IUser } from '#entities';

import { backendBaseUrl } from './backendBaseUrl';

export async function getUsers(ids?: string[]) {
  let query = '';
  if (ids?.length) {
    const idsParams = `ids=${ids.join(',')}`;
    query = '?' + idsParams;
  } else {
    throw new Error('No users ids provided');
  }

  const response = await fetch(`${backendBaseUrl}/users${query}`, {
    method: 'GET',
    credentials: 'include',
  });

  return {
    response,
    responseBody: response.status === 200 ? ((await response.json()) as IUser[]) : null,
  };
}
