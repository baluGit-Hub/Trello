export interface TrelloUser {
  id: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  [key: string]: any;
}

export interface TrelloBoard {
  id: string;
  name: string;
  desc?: string;
  closed?: boolean;
  url?: string;
  prefs?: {
    backgroundImage?: string | null;
    backgroundColor?: string | null;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface TrelloList {
  id: string;
  name: string;
  idBoard: string;
  closed?: boolean;
  pos?: number;
  cards?: TrelloCard[]; // For combined fetching
  [key: string]: any;
}

export interface TrelloCard {
  id: string;
  name: string;
  desc?: string;
  idList: string;
  idBoard: string;
  closed?: boolean;
  due?: string | null;
  labels?: TrelloLabel[];
  shortUrl?: string;
  [key: string]: any;
}

export interface TrelloLabel {
  id: string;
  idBoard: string;
  name: string;
  color: string | null;
  [key: string]: any;
}
