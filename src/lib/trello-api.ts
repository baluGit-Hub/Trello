import { getOAuthClient } from './trello-oauth';
import { TRELLO_API_BASE_URL } from './constants';
import type { TrelloUser, TrelloBoard, TrelloList } from '@/types/trello';

interface MakeRequestOptions {
  accessToken: string;
  accessTokenSecret: string;
}

async function makeTrelloApiRequest<T>(
  endpoint: string,
  options: MakeRequestOptions,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<T> {
  const { accessToken, accessTokenSecret } = options;
  const oauthClient = getOAuthClient(); // This will throw if keys are missing
  const url = `${TRELLO_API_BASE_URL}${endpoint}`;

  return new Promise<T>((resolve, reject) => {
    const callback = (error: any, data: string, response: any) => {
      if (error) {
        console.error(`Trello API Error (${method} ${url}):`, error);
        try {
           const errorData = JSON.parse(error.data);
           reject(new Error(`Trello API Error: ${error.statusCode} - ${errorData.message || error.data}`));
        } catch (e) {
           reject(new Error(`Trello API Error: ${error.statusCode} - ${error.data}`));
        }
      } else {
        try {
          resolve(JSON.parse(data) as T);
        } catch (parseError) {
          console.error('Error parsing Trello API response:', parseError);
          reject(new Error('Failed to parse Trello API response.'));
        }
      }
    };

    switch (method) {
      case 'GET':
        oauthClient.get(url, accessToken, accessTokenSecret, callback);
        break;
      case 'POST':
        oauthClient.post(url, accessToken, accessTokenSecret, body, 'application/json', callback);
        break;
      // Implement PUT and DELETE if needed
      default:
        reject(new Error(`Unsupported HTTP method: ${method}`));
    }
  });
}

export async function getTrelloUser(options: MakeRequestOptions): Promise<TrelloUser> {
  return makeTrelloApiRequest<TrelloUser>('/members/me?fields=id,username,fullName,avatarUrl', options);
}

export async function getTrelloBoards(options: MakeRequestOptions): Promise<TrelloBoard[]> {
  return makeTrelloApiRequest<TrelloBoard[]>('/members/me/boards?fields=id,name,desc,closed,url,prefs&filter=open', options);
}

export async function getBoardListsWithCards(boardId: string, options: MakeRequestOptions): Promise<TrelloList[]> {
  // Fetches lists for a board, and also includes open cards for each list
  return makeTrelloApiRequest<TrelloList[]>(
    `/boards/${boardId}/lists?cards=open&card_fields=id,name,desc,due,labels,shortUrl&fields=id,name,idBoard,pos`, 
    options
  );
}
