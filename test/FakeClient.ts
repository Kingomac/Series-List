import { IDbClient } from "../src/interfaces/DbClient";
import { Serie, Category } from "../src/interfaces/Models";

type SerieCategRef = {
  serie: Serie;
  categ: Category;
};

export class FakeClient implements IDbClient {
  private series: SerieCategRef[];
  private categs: Category[];

  onInitialize?(): void;

  constructor() {
    this.series = [];
    this.categs = [];
    this.initialize();
  }

  private async initialize() {
    for (let i = 0; i < 6; i++) {
      const c = await this.getRandomCategory();
      this.categs.push(c);
      for (let j = 0; j < 20; j++) {
        const s = await this.getRandomSerie();
        this.series.push({ serie: s, categ: c });
      }
    }
    if (this.onInitialize !== undefined) this.onInitialize();
  }

  updateSerie(
    oldSerie: Serie,
    oldCateg: Category,
    newSerie: Serie,
    newCateg: Category
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  updateCategory(oldCateg: Category, newCateg: Category): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async getAllSeries(): Promise<Serie[]> {
    return this.series.map((i) => {
      return i.serie;
    });
  }
  async getAllCategories(): Promise<Category[]> {
    return this.categs;
  }
  async getSeriesByCategoryId(categ: string): Promise<Serie[]> {
    let toret: Serie[] = [];
    this.series.forEach((i) => {
      if (i.categ._id == categ) {
        toret.push(i.serie);
      }
    });
    return toret;
  }

  async getLastCategory(): Promise<Category> {
    return this.categs[this.categs.length - 1];
  }

  private async getCategById(id: string): Promise<Category | null> {
    this.categs.forEach((i) => {
      if (i._id == id) {
        return i;
      }
    });
    return null;
  }

  async addSerie(serie: Serie, categ: string): Promise<void> {
    const category = await this.getCategById(categ);
    if (category == null) throw new Error("Not a category id");
    this.series.push({ categ: category, serie });
  }
  async sumChapter(serie: Serie, categ: Category, num: number): Promise<void> {}
  async addCategory(categ: Category): Promise<void> {
    this.categs.push(categ);
  }
  async deleteCategoryById(categ: string): Promise<void> {}
  async deleteSerieById(serie: string, categ: string): Promise<void> {}

  async getRandomText(length: number = 32): Promise<string> {
    const letters = "abcdefghijklnmopqrstuvwxyz ";
    let toret: string = "";
    for (let i = 0; i < length; i++) {
      toret += letters[Math.floor(Math.random() * letters.length)];
    }
    return toret;
  }

  async getRandomSerie(): Promise<Serie> {
    return {
      _id: await this.getRandomText(),
      name: await this.getRandomText(),
      nameAlt: await this.getRandomText(),
      image: await this.getRandomImage(),
      chapter: Math.floor(Math.random() * 64),
      createdAt: new Date(),
      updatedAt: new Date(),
      url: await this.getRandomText(),
    };
  }

  async getRandomCategory(): Promise<Category> {
    return {
      _id: await this.getRandomText(),
      name: await this.getRandomText(10),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async getRandomImage(): Promise<string> {
    const imgs: string[] = [
      "https://i.pinimg.com/originals/aa/51/1e/aa511e80be8d6ef44320eea30a2cabcd.jpg",
      "https://images-na.ssl-images-amazon.com/images/I/51px6kztymL.jpg",
      "https://i.redd.it/lxky74puiz451.jpg",
      "https://i.pinimg.com/originals/cd/2d/77/cd2d77c2a3b6590d2b769b5a5a6cea80.jpg",
      "https://i.pinimg.com/originals/79/fb/31/79fb31c4f7ec9ffe3cce8818c9697f68.jpg",
      "https://ramenparados.com/wp-content/uploads/2020/08/Strike-Witches-Road-to-Berlin-poster.jpg",
      "https://i.pinimg.com/originals/c2/70/6b/c2706bf6b85492a402684783e451ee69.jpg",
      "https://www.thathashtagshow.com/wp-content/uploads/2020/04/7248ec774d4f91631258716f171298ef66494e6av2_00.jpg",
      "https://pm1.narvii.com/6492/e322c1313c4408b96a733f3ab48c2da4adb6fcbb_hq.jpg",
      "https://pm1.narvii.com/6378/3d976cd19e6254d6f7dea1d8fb4597425d9c651c_hq.jpg",
    ];
    return imgs[Math.floor(Math.random() * imgs.length)];
  }
}