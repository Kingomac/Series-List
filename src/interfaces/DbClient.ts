import { Category, Serie } from "./Models";

export interface DbClient {
  //GET
  getAllSeries(): Promise<Serie[]>;
  getAllCategories(): Promise<Category[]>;
  getSeriesByCategory(categ: Category): Promise<Serie[]>;
  // POST
  addSerie(serie: Serie, categ: Category): Promise<void>;
  sumChapter(serie: Serie, categ: Category, num: number): Promise<void>;
  addCategory(categ: Category): Promise<void>;
  //DELETE
  deleteCategory(categ: Category): Promise<void>;
  deleteSerie(serie: Serie, categ: Category): Promise<void>;
}
