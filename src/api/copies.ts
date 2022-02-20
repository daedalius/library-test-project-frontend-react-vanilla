import { IBookCopy } from '#entities';

import { backendBaseUrl } from './backendBaseUrl';

export async function getBookCopies(bookId: string) {
  const response = await fetch(`${backendBaseUrl}/copies/book/${bookId}`, {
    method: 'GET',
    credentials: 'include',
  });

  return {
    response,
    responseBody: response.status === 200 ? ((await response.json()) as IBookCopy[]) : null,
  };
}

export async function getBookCopiesOnUser(userId: string) {
  const response = await fetch(`${backendBaseUrl}/copies/user/${userId}`, {
    method: 'GET',
    credentials: 'include',
  });

  return {
    response,
    responseBody: response.status === 200 ? ((await response.json()) as IBookCopy[]) : null,
  };
}

export async function getFreeBookCopies(bookId: string) {
  const response = await fetch(`${backendBaseUrl}/copies/book/free?bookIds=${bookId}`, {
    method: 'GET',
    credentials: 'include',
  });

  return {
    response,
    responseBody: response.status === 200 ? ((await response.json()) as IBookCopy[]) : null,
  };
}

export async function getBookCopiesBorrowedByUser(userId: string) {
  const response = await fetch(`${backendBaseUrl}/copies/user/${userId}`, {
    method: 'GET',
    credentials: 'include',
  });

  return {
    response,
    responseBody: response.status === 200 ? ((await response.json()) as IBookCopy[]) : null,
  };
}

export async function borrowBookCopy(bookId: string, userId: string) {
  const response = await fetch(`${backendBaseUrl}/copies/borrow/${bookId}/user/${userId}`, {
    method: 'POST',
    credentials: 'include',
  });

  return {
    response,
    responseBody: response.status === 200 ? ((await response.json()) as IBookCopy) : null,
  };
}

export async function returnBookCopy(copyId: string) {
  const response = await fetch(`${backendBaseUrl}/copies/return/${copyId}`, {
    method: 'POST',
    credentials: 'include',
  });

  return {
    response,
    responseBody: response.status === 200 ? ((await response.json()) as IBookCopy) : null,
  };
}

export async function postBookCopies(copies: IBookCopy[]) {
  const response = await fetch(`${backendBaseUrl}/copies`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(copies),
  });

  return {
    response,
    responseBody: response.status === 200 ? ((await response.json()) as IBookCopy[]) : null,
  };
}

export async function deleteBookCopies(copiesIds: string[]) {
  const response = await fetch(`${backendBaseUrl}/copies`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(copiesIds),
  });

  return {
    response,
  };
}
