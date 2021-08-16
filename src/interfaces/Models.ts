export interface DbDoc {
  _id?: string;
  timestamp?: Date;
}

export interface Serie extends DbDoc {
  name: string;
  image: string;
  url: string;
  chapter: number;
}

export interface Category extends DbDoc {
  name: string;
}
