import { IDbClient } from "../interfaces/DbClient";
import { Category, Serie } from "../interfaces/Models";

export default class BackupController {
  constructor(private client: IDbClient) {}

  async save(): Promise<void> {
    const categs = await this.client.getAllCategories();
    const toSave = new Map<string, Serie[]>();
    for await (const c of categs) {
      toSave.set(c._id!, await this.client.getSeriesByCategoryId(c._id!));
    }
    console.log("Saving", Object.fromEntries(toSave));
    const blob = new Blob(
      [JSON.stringify(Object.assign(Object.fromEntries(toSave), { categs }))],
      {
        type: "application/json",
      }
    );
    const link = document.createElement("a");
    link.download = "backup.json";
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = [
      "application/json",
      link.download,
      link.href,
    ].join(":");
    link.click();
  }

  async load(file: File): Promise<void> {
    console.log("Loading file", file);
    const text = await file.text();
    console.log("Text", text);
    const obj = JSON.parse(text);
    console.log("Obj", obj);
    const categs = obj.categs as Category[];
    console.log(categs);
    console.time("Loading backup");
    for await (const c of categs) {
      await this.client.addCategory(c);
      const series = obj[c._id!] as Serie[];
      for await (const s of series) {
        delete s._id;
        await this.client.addSerie(s, c._id!);
      }
    }
    console.timeEnd("Loading backup");
  }
}
