import { cookies } from 'next/headers';
import { ACCESS_TOKEN_COOKIE_NAME, ACCESS_TOKEN_SECRET_COOKIE_NAME } from './constants';

export interface TrelloAuthTokens {
  accessToken: string;
  accessTokenSecret: string;
}

export function getTrelloAuthTokens(): TrelloAuthTokens | null {
  const cookieStore = cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
  const accessTokenSecret = cookieStore.get(ACCESS_TOKEN_SECRET_COOKIE_NAME)?.value;

  if (accessToken && accessTokenSecret) {
    return { accessToken, accessTokenSecret };
  }
  return null;
}

export function isAuthenticated(): boolean {
  return !!getTrelloAuthTokens();
}
