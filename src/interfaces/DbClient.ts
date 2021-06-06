import { Category, Serie } from "./Models";

export interface DbClient {
  //GET
  /**
   * Think about using it with limits
   * @returns Promise all documents of series
   */
  getAllSeries(): Promise<Serie[]>;
  /**
   * @returns Promise all categories
   */
  getAllCategories(): Promise<Category[]>;

  /**
   *
   * @param categId
   */
  getSeriesByCategoryId(categId: string): Promise<Serie[]>;
  // POST

  addSerie(serie: Serie, categId: string): Promise<void>;

  addCategory(categ: Category): Promise<void>;
  // UPDATE

  updateSerie(
    oldSerie: Serie,
    oldCateg: Category,
    newSerie: Serie,
    newCateg: Category
  ): Promise<void>;

  updateCategory(oldCateg: Category, newCateg: Category): Promise<void>;
  //DELETE
  /**
   *
   * @param categId
   */
  deleteCategoryById(categId: string): Promise<void>;

  /**
   *
   * @param serieId
   * @param categId
   */
  deleteSerieById(serieId: string, categId: string): Promise<void>;
}
