import FirebaseClient from "./FirebaseClient";

export async function migrateOld(x: { client: FirebaseClient }): Promise<void> {
  console.time("Migrating from old");
  const categs = ["viendo", "vistos", "favoritos", "abandonados", "pendientes"];
  const { getDocs, collection } = await import("firebase/firestore/lite");
  for await (const c of categs) {
    const categId = await x.client.addCategory({ name: c });
    const docs = await getDocs(collection(x.client.db, c));
    docs.forEach(async (d) => {
      const data = d.data();
      await x.client.addSerie(
        {
          name: data.nombre_jp,
          nameAlt: data.nombre_en,
          image: data.imagen,
          chapter: data.capitulo,
          timestamp: data.actualizado_en,
          url: "",
        },
        categId
      );
    });
  }
  console.timeEnd("Migrating from old");
}
