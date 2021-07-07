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
    console.time("Fetching categories:");

    const q = query(collection(this.db, "categories"));
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      toret.push(Object.assign({ _id: doc.id }, doc.data()) as Category);
    });

    console.timeEnd("Fetching categories:");
    console.log("Categories fetched:", toret);

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

  async getLastCategory(): Promise<Category> {
    throw new Error("not implemented");
  }
  async addSerie(serie: Serie, categId: string): Promise<void> {
    await setDoc(doc(this.db, categId), serie);
  }
  async addCategory(categ: Category): Promise<void> {
    console.time("Creating category:");
    await addDoc(collection(this.db, "categories"), categ);
    console.timeEnd("Creating category:");
  }
  async deleteCategoryById(categId: string): Promise<void> {
    await deleteDoc(doc(this.db, "categories", categId));
  }
  async deleteSerieById(serieId: string, categId: string): Promise<void> {
    await deleteDoc(doc(this.db, categId, serieId));
  }
}
