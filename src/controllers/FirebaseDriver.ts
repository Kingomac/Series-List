import { FirebaseKeys } from "../../app.config";
import { FirebaseApp, initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  FirebaseFirestore,
  setDoc,
  doc,
} from "firebase/firestore";
import { DbClient } from "../interfaces/DbClient";
import { Category, DbDoc, Serie } from "../interfaces/Models";
export default class FirebaseDriver implements DbClient {
  readonly app: FirebaseApp;
  readonly db: FirebaseFirestore;
  constructor() {
    this.app = initializeApp(FirebaseKeys);
    this.db = getFirestore(this.app);
  }
  async getAllSeries(): Promise<Serie[]> {
    const categories = await this.getAllCategories();
    let toret: Serie[] = [];
    categories.forEach(async (categ) => {
      (await this.getSeriesByCategory(categ)).forEach((ser) => {
        toret.push(ser);
      });
    });
    return toret;
  }
  async getAllCategories(): Promise<Category[]> {
    let toret: Category[] = [];

    const q = query(collection(this.db, "categories"));
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      toret.push(Object.assign({ _id: doc.id }, doc.data()) as Category);
    });

    return toret;
  }
  async getSeriesByCategory(categ: Category): Promise<Serie[]> {
    let toret: Serie[] = [];

    const q = query(collection(this.db, categ._id));
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      toret.push(Object.assign({ _id: doc.id }, doc.data()) as Serie);
    });
    return toret;
  }
  async addSerie(serie: Serie, categ: Category): Promise<void> {
    await setDoc(doc(this.db, categ._id), serie);
  }
  sumChapter(serie: Serie, categ: Category, num: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
  addCategory(categ: Category): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deleteCategory(categ: Category): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deleteSerie(serie: Serie, categ: Category): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
