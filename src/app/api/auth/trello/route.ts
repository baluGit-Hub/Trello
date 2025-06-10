import { type NextRequest, NextResponse } from 'next/server';
import { getOAuthRequestToken } from '@/lib/trello-oauth';
import { OAUTH_AUTHORIZE_URL, REQUEST_TOKEN_COOKIE_NAME, REQUEST_TOKEN_SECRET_COOKIE_NAME, APP_NAME, OAUTH_SCOPES, OAUTH_EXPIRATION } from '@/lib/constants';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const { oauthToken, oauthTokenSecret } = await getOAuthRequestToken();

    cookies().set(REQUEST_TOKEN_COOKIE_NAME, oauthToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 15, // 15 minutes
    });
    cookies().set(REQUEST_TOKEN_SECRET_COOKIE_NAME, oauthTokenSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 15, // 15 minutes
    });
    
    const authorizeUrl = `${OAUTH_AUTHORIZE_URL}?oauth_token=${oauthToken}&name=${encodeURIComponent(APP_NAME)}&scope=${OAUTH_SCOPES}&expiration=${OAUTH_EXPIRATION}`;
    
    return NextResponse.redirect(authorizeUrl);
  } catch (error) {
    console.error("Error initiating Trello OAuth:", error);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || '/';
    // Redirect to an error page or home with an error query param
    const errorRedirectUrl = new URL(appUrl);
    errorRedirectUrl.searchParams.set('error', 'oauth_init_failed');
    if (error instanceof Error) {
      errorRedirectUrl.searchParams.set('message', error.message);
    }
    return NextResponse.redirect(errorRedirectUrl.toString());
  }
}
