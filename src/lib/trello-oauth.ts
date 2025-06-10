import { OAuth } from 'oauth';
import {
  TRELLO_API_KEY_ENV,
  TRELLO_API_SECRET_ENV,
  APP_URL_ENV,
  OAUTH_REQUEST_TOKEN_URL,
  OAUTH_ACCESS_TOKEN_URL,
} from './constants';

const trelloApiKey = process.env[TRELLO_API_KEY_ENV];
const trelloApiSecret = process.env[TRELLO_API_SECRET_ENV];
const appUrl = process.env[APP_URL_ENV];

if (!trelloApiKey) {
  console.error("Missing Trello API Key (TRELLO_API_KEY) in environment variables.");
}
if (!trelloApiSecret) {
  console.error("Missing Trello API Secret (TRELLO_API_SECRET) in environment variables.");
}
if (!appUrl) {
  console.error("Missing App URL (NEXT_PUBLIC_APP_URL) in environment variables.");
}
// Allow execution to continue for build steps, but functionality will be broken.

const callbackUrl = `${appUrl || 'http://localhost:3000'}/api/auth/trello/callback`;

export const getOAuthClient = () => {
  if (!trelloApiKey || !trelloApiSecret) {
    // This check is important at runtime
    throw new Error("Trello API Key or Secret is not configured. Please check your environment variables.");
  }
  return new OAuth(
    OAUTH_REQUEST_TOKEN_URL,
    OAUTH_ACCESS_TOKEN_URL,
    trelloApiKey,
    trelloApiSecret,
    "1.0A",
    callbackUrl,
    "HMAC-SHA1"
  );
};

export const getOAuthRequestToken = (): Promise<{ oauthToken: string, oauthTokenSecret: string }> => {
  return new Promise((resolve, reject) => {
    try {
      const client = getOAuthClient();
      client.getOAuthRequestToken((error, oauthToken, oauthTokenSecret, results) => {
        if (error) {
          console.error("Error getting OAuth request token:", error);
          reject(new Error(`Error getting OAuth request token: ${error.statusCode} ${JSON.stringify(error.data)}`));
        } else {
          resolve({ oauthToken, oauthTokenSecret });
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};

export const getOAuthAccessToken = (
  oauthToken: string,
  oauthTokenSecret: string,
  oauthVerifier: string
): Promise<{ accessToken: string, accessTokenSecret: string }> => {
  return new Promise((resolve, reject) => {
    try {
      const client = getOAuthClient();
      client.getOAuthAccessToken(oauthToken, oauthTokenSecret, oauthVerifier, (error, accessToken, accessTokenSecret, results) => {
        if (error) {
          console.error("Error getting OAuth access token:", error);
          reject(new Error(`Error getting OAuth access token: ${error.statusCode} ${JSON.stringify(error.data)}`));
        } else {
          resolve({ accessToken, accessTokenSecret });
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};
