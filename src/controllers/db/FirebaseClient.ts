import AppModes from "../../interfaces/AppModes";
import { FirebaseApp } from "firebase/app";
import {
  getFirestore,
  Firestore,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore/lite";
import { IDbClient } from "../../interfaces/DbClient";
import { Category, Serie } from "../../interfaces/Models";
import { APP_MODE, SERIES_LIMIT } from "../../../app.config";

export default class FirebaseClient implements IDbClient {
  readonly db: Firestore;
  onInitialize?(): void;
  constructor(private readonly app: FirebaseApp) {
    this.db = getFirestore(this.app);
    if (APP_MODE == AppModes.DEBUG) {
      import("firebase/firestore/lite").then(({ connectFirestoreEmulator }) => {
        connectFirestoreEmulator(this.db, "localhost", 8080);
      });
    }
  }
  async getSeriesLimitFirst(x: { categId: string }): Promise<Serie[]> {
    const { query, collection, orderBy, limit, getDocs } = await import(
      "firebase/firestore/lite"
    );
    const q = query(
      collection(this.db, x.categId),
      orderBy("timestamp", "desc"),
      limit(SERIES_LIMIT)
    );
    const docs = await getDocs(q);
    return await FirebaseClient.formatDocsToSeries(docs);
  }
  async getSeriesLimitAfter(x: {
    categId: string;
    start: Date;
  }): Promise<Serie[]> {
    const { query, collection, orderBy, limit, getDocs, startAfter } =
      await import("firebase/firestore/lite");
    const q = query(
      collection(this.db, x.categId),
      orderBy("timestamp", "desc"),
      limit(SERIES_LIMIT),
      startAfter(x.start)
    );
    const docs = await getDocs(q);
    return await FirebaseClient.formatDocsToSeries(docs);
  }

  private static async formatDocsToSeries(
    docs: QuerySnapshot<DocumentData>
  ): Promise<Serie[]> {
    let series: Serie[] = [];
    docs.forEach((d) => {
      series.push(Object.assign({ _id: d.id }, d.data()) as Serie);
    });
    return series;
  }

  async moveSerie(
    oldCategId: string,
    newCategId: string,
    serie: Serie
  ): Promise<string> {
    if (serie._id === undefined) throw new Error("Serie id must be defined");
    const { addDoc, deleteDoc, doc, collection } = await import(
      "firebase/firestore/lite"
    );
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
    const { updateDoc, doc } = await import("firebase/firestore/lite");
    const serieId = serie._id;
    delete serie._id;
    serie.timestamp = new Date();
    await updateDoc(doc(this.db, categId, serieId), serie);
    serie._id = serieId;
  }

  async updateSerieChapter(serieId: string, categId: string, chapter: number) {
    console.log("Requesting chapter update for serie:", serieId);
    const { updateDoc, doc } = await import("firebase/firestore/lite");
    const ref = doc(this.db, categId, serieId);
    await updateDoc(ref, {
      chapter,
    });
  }
  async updateCategory(oldCategId: string, newCateg: Category): Promise<void> {
    const { addDoc, query, collection, getDocs } = await import(
      "firebase/firestore/lite"
    );
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
    const { query, collection, getDocs } = await import(
      "firebase/firestore/lite"
    );

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
    const { query, collection, getDocs } = await import(
      "firebase/firestore/lite"
    );
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
    console.time("Adding serie");
    const { addDoc, Timestamp, collection } = await import(
      "firebase/firestore/lite"
    );
    const res = await addDoc(
      collection(this.db, categId),
      Object.assign(serie, { timestamp: Timestamp.fromDate(new Date()) })
    );
    console.timeEnd("Adding serie");
    return res.id;
  }
  async addCategory(categ: Category): Promise<string> {
    console.time("Creating category:");
    const { addDoc, collection } = await import("firebase/firestore/lite");
    const doc = await addDoc(
      collection(this.db, "categories"),
      Object.assign(categ, { timestamp: new Date() })
    );
    console.timeEnd("Creating category:");
    return doc.id;
  }
  async deleteCategoryById(categId: string): Promise<void> {
    const { deleteDoc, doc } = await import("firebase/firestore/lite");
    await deleteDoc(doc(this.db, "categories", categId));
  }
  async deleteSerieById(serieId: string, categId: string): Promise<void> {
    const { deleteDoc, doc } = await import("firebase/firestore/lite");
    await deleteDoc(doc(this.db, categId, serieId));
  }
}
