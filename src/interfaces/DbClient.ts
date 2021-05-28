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
   * @param  {Category} categ category to fetch all series from
   * @returns Promise every serie that belongs to categ
   */
  getSeriesByCategory(categ: Category): Promise<Serie[]>;
  // POST
  /**
   * @param  {Serie} serie new serie data
   * @param  {Category} categ category data (if not exists it's created)
   * @returns Promise
   */
  addSerie(serie: Serie, categ: Category): Promise<void>;
  /**
   * @param  {Category} categ new category data
   * @returns Promise
   */
  addCategory(categ: Category): Promise<void>;
  // UPDATE
  /**
   * @param  {Serie} oldSerie old serie data
   * @param  {Category} oldCateg old category data
   * @param  {Serie} newSerie new serie data
   * @param  {Category} newCateg new category data
   * @returns Promise
   */
  updateSerie(
    oldSerie: Serie,
    oldCateg: Category,
    newSerie: Serie,
    newCateg: Category
  ): Promise<void>;
  /**
   * Should move every serie in that category
   * @param  {Category} oldCateg old category data
   * @param  {Category} newCateg new category data
   * @returns Promise
   */
  updateCategory(oldCateg: Category, newCateg: Category): Promise<void>;
  //DELETE
  /**
   * Should delete every serie in the category
   * @param  {Category} categ to delete
   * @returns Promise
   */
  deleteCategory(categ: Category): Promise<void>;
  /**
   * @param  {Serie} serie to delete
   * @param  {Category} categ the serie belongs to
   * @returns Promise
   */
  deleteSerie(serie: Serie, categ: Category): Promise<void>;
}
