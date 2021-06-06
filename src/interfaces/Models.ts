export interface DbDoc {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Serie extends DbDoc {
  name: string;
  nameAlt: string;
  image: string;
  url: string;
  chapter: number;
}

export interface Category extends DbDoc {
  name: string;
}
