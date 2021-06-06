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
  deleteDoc,
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

    const q = query(collection(this.db, "categories"));
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      toret.push(Object.assign({ _id: doc.id }, doc.data()) as Category);
    });

    return toret;
  }
  async getSeriesByCategoryId(categId: string): Promise<Serie[]> {
    let toret: Serie[] = [];

    if (categId == undefined) {
      throw new Error("Category id is undefined");
    }

    const q = query(collection(this.db, categId));
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      toret.push(Object.assign({ _id: doc.id }, doc.data()) as Serie);
    });
    return toret;
  }
  async addSerie(serie: Serie, categId: string): Promise<void> {
    await setDoc(doc(this.db, categId), serie);
  }
  async addCategory(categ: Category): Promise<void> {
    await setDoc(doc(this.db, "categories"), categ);
  }
  async deleteCategoryById(categId: string): Promise<void> {
    await deleteDoc(doc(this.db, "categories", categId));
  }
  async deleteSerieById(serieId: string, categId: string): Promise<void> {
    await deleteDoc(doc(this.db, categId, serieId));
  }
}
