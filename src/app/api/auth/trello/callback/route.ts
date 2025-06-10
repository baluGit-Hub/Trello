import { type NextRequest, NextResponse } from 'next/server';
import { getOAuthAccessToken } from '@/lib/trello-oauth';
import { 
  REQUEST_TOKEN_COOKIE_NAME, 
  REQUEST_TOKEN_SECRET_COOKIE_NAME, 
  ACCESS_TOKEN_COOKIE_NAME, 
  ACCESS_TOKEN_SECRET_COOKIE_NAME 
} from '@/lib/constants';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const oauthTokenFromCallback = searchParams.get('oauth_token');
  const oauthVerifier = searchParams.get('oauth_verifier');

  const cookieStore = cookies();
  const oauthRequestToken = cookieStore.get(REQUEST_TOKEN_COOKIE_NAME)?.value;
  const oauthRequestTokenSecret = cookieStore.get(REQUEST_TOKEN_SECRET_COOKIE_NAME)?.value;

  // Clear temporary request token cookies
  cookieStore.delete(REQUEST_TOKEN_COOKIE_NAME);
  cookieStore.delete(REQUEST_TOKEN_SECRET_COOKIE_NAME);
  
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '/';
  const errorRedirectUrl = new URL(appUrl);
  errorRedirectUrl.searchParams.set('error', 'oauth_callback_failed');

  if (!oauthTokenFromCallback || !oauthVerifier || !oauthRequestToken || !oauthRequestTokenSecret) {
    console.error("Missing OAuth parameters in callback or cookies.");
    errorRedirectUrl.searchParams.set('message', 'Missing OAuth parameters.');
    return NextResponse.redirect(errorRedirectUrl.toString());
  }

  if (oauthTokenFromCallback !== oauthRequestToken) {
    console.error("OAuth token mismatch.");
     errorRedirectUrl.searchParams.set('message', 'OAuth token mismatch.');
    return NextResponse.redirect(errorRedirectUrl.toString());
  }

  try {
    const { accessToken, accessTokenSecret } = await getOAuthAccessToken(
      oauthRequestToken,
      oauthRequestTokenSecret,
      oauthVerifier
    );

    cookieStore.set(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    cookieStore.set(ACCESS_TOKEN_SECRET_COOKIE_NAME, accessTokenSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.redirect(new URL('/dashboard', appUrl).toString());
  } catch (error) {
    console.error("Error processing Trello OAuth callback:", error);
    if (error instanceof Error) {
      errorRedirectUrl.searchParams.set('message', error.message);
    }
    return NextResponse.redirect(errorRedirectUrl.toString());
  }
}
