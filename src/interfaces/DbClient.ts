import { Category, Serie } from "./Models";

export interface IDbClient {
  onInitialize?(): void;

  moveSerie(
    oldCategId: string,
    newCategId: string,
    serie: Serie
  ): Promise<string>;

  updateSerieInfo(categId: string, serie: Serie): Promise<void>;
  updateSerieChapter(
    serieId: string,
    categId: string,
    chapter: number
  ): Promise<void>;
  updateCategory(newCateg: Category): Promise<void>;
  getAllSeries(): Promise<Serie[]>;
  getSeriesLimitFirst(x: { categId: string }): Promise<Serie[]>;
  getSeriesLimitAfter(x: { categId: string; start: Date }): Promise<Serie[]>;
  getAllCategories(): Promise<Category[]>;
  getSeriesByCategoryId(categId: string): Promise<Serie[]>;
  addSerie(serie: Serie, categId: string): Promise<string>;
  addCategory(categ: Category): Promise<string>;
  deleteCategoryById(categId: string): Promise<void>;
  deleteSerieById(serieId: string, categId: string): Promise<void>;
}
