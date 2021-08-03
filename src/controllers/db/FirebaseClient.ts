import { APP_MODE, AppModes } from "../../../app.config";
import { FirebaseApp } from "firebase/app";
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
  updateDoc,
  useFirestoreEmulator,
} from "firebase/firestore";
import { IDbClient } from "../../interfaces/DbClient";
import { Category, DbDoc, Serie } from "../../interfaces/Models";

export default class FirebaseClient implements IDbClient {
  private readonly db: FirebaseFirestore;
  onInitialize?(): void;
  constructor(private readonly app: FirebaseApp) {
    this.db = getFirestore(this.app);
    if (APP_MODE == AppModes.DEBUG) {
      useFirestoreEmulator(this.db, "localhost", 8080);
    }
  }

  async moveSerie(
    oldCategId: string,
    newCategId: string,
    serie: Serie
  ): Promise<string> {
    if (serie._id === undefined) throw new Error("Serie id must be defined");
    const oldSerieId = serie._id;
    delete serie._id;
    serie.timestamp = new Date();
    const newSerie = await addDoc(collection(this.db, newCategId), serie);
    await deleteDoc(doc(this.db, oldCategId, oldSerieId));
    serie._id = newSerie.id;
    return newSerie.id;
  }

  async updateSerieInfo(categId: string, serie: Serie): Promise<void> {
    if (serie._id === undefined) throw new Error("Serie id must be defined");
    const serieId = serie._id;
    delete serie._id;
    serie.timestamp = new Date();
    await updateDoc(doc(this.db, categId, serieId), serie);
    serie._id = serieId;
  }

  async updateSerieChapter(serieId: string, categId: string, chapter: number) {
    const ref = doc(this.db, categId, serieId);
    await updateDoc(ref, {
      chapter,
    });
  }
  async updateCategory(oldCategId: string, newCateg: Category): Promise<void> {
    delete newCateg._id;
    newCateg.timestamp = new Date();
    const newDoc = await addDoc(collection(this.db, "categories"), newCateg);
    const newId = newDoc.id;

    const q = query(collection(this.db, oldCategId));
    const snapshot = await getDocs(q);
    const newCollection = collection(this.db, newId);
    snapshot.forEach((i) => {
      addDoc(newCollection, i.data());
    });
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
