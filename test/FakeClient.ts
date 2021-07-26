import { IDbClient } from "../src/interfaces/DbClient";
import { Serie, Category } from "../src/interfaces/Models";
import Placeholders from "./Placeholders";

export class FakeClient implements IDbClient {
  private categs: Category[] = [];
  private data: Map<string, Serie[]> = new Map();

  constructor() {}

  async setup(): Promise<void> {
    for (let i = 0; i < Math.floor(Math.random() * 20); i++) {
      let series = [];
      for (let j = 0; j < Math.floor(Math.random() * 100); i++) {
        series.push(await Placeholders.getRandomSerie());
      }
      const categ = await Placeholders.getRandomCategory();
      this.categs.push(categ);
      this.data.set(categ._id!!, series);
    }
  }

  moveSerie(
    oldCategId: string,
    newCategId: string,
    serie: Serie
  ): Promise<string> {
    throw new Error("Method not implemented.");
  }
  updateSerieInfo(categId: string, serie: Serie): Promise<void> {
    throw new Error("Method not implemented.");
  }
  updateSerieChapter(
    serieId: string,
    categId: string,
    chapter: number
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  updateCategory(oldCategId: string, newCateg: Category): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async getAllSeries(): Promise<Serie[]> {
    let total: Serie[] = [];
    this.data.forEach((s) => {
      total = total.concat(s);
    });
    return total;
  }
  async getAllCategories(): Promise<Category[]> {
    return this.categs;
  }
  async getSeriesByCategoryId(categ: string): Promise<Serie[]> {
    return this.data.get(categ) || [];
  }

  async addSerie(serie: Serie, categ: string): Promise<string> {
    serie._id = await Placeholders.getRandomText();
    this.data.set(categ, this.data.get(categ)?.concat(serie)!!);
    return serie._id;
  }
  async sumChapter(serie: Serie, categ: Category, num: number): Promise<void> {}
  async addCategory(categ: Category): Promise<string> {
    this.categs.push(categ);
    return await Placeholders.getRandomText();
  }
  async deleteCategoryById(categ: string): Promise<void> {}
  async deleteSerieById(serie: string, categ: string): Promise<void> {}
}
