import { FirebaseKeys } from "../../../app.config";
import { FirebaseApp, initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  FirebaseFirestore,
  setDoc,
  doc,
  deleteDoc,
  addDoc,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { IDbClient } from "../../interfaces/DbClient";
import { Category, DbDoc, Serie } from "../../interfaces/Models";
export default class FirebaseClient implements IDbClient {
  private readonly db: FirebaseFirestore;
  onInitialize?(): void;
  constructor(private readonly app: FirebaseApp) {
    this.db = getFirestore(this.app);
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
    const categories = await this.getAllCategories();
    let toret: Serie[] = [];
    categories.forEach(async (categ) => {
      if (categ._id == undefined) {
        throw new Error("Category is undefined");
      }
      (await this.getSeriesByCategoryId(categ._id)).forEach((ser) => {
        toret.push(ser);
      });
    });
    return toret;
  }
  async getAllCategories(): Promise<Category[]> {
    let toret: Category[] = [];

    console.log("Fetching all categories...");
    console.time("Fetching categories");

    const q = query(collection(this.db, "categories"));
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      toret.push(Object.assign({ _id: doc.id }, doc.data()) as Category);
    });

    console.timeEnd("Fetching categories");
    console.log("Categories fetched:", toret);

    return toret;
  }
  async getSeriesByCategoryId(categId: string): Promise<Serie[]> {
    let toret: Serie[] = [];

    if (categId == undefined) {
      throw new Error("Category id is undefined");
    }

    console.time("Fetching series");

    const q = query(collection(this.db, categId));
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      toret.push(Object.assign({ _id: doc.id }, doc.data()) as Serie);
    });

    console.timeEnd("Fetching series");
    console.log("Series:", toret);

    return toret;
  }

  async addSerie(serie: Serie, categId: string): Promise<string> {
    const res = await addDoc(
      collection(this.db, categId),
      Object.assign(serie, { timestamp: Timestamp.fromDate(new Date()) })
    );
    return res.id;
  }
  async addCategory(categ: Category): Promise<string> {
    console.time("Creating category:");
    const doc = await addDoc(
      collection(this.db, "categories"),
      Object.assign(categ, { timestamp: new Date() })
    );
    console.timeEnd("Creating category:");
    return doc.id;
  }
  async deleteCategoryById(categId: string): Promise<void> {
    await deleteDoc(doc(this.db, "categories", categId));
  }
  async deleteSerieById(serieId: string, categId: string): Promise<void> {
    await deleteDoc(doc(this.db, categId, serieId));
  }
}
