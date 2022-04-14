import * as uglify from "uglify-js";
import { PurgeCSS } from "purgecss";
import * as fs from "fs/promises";
import path from "path";

let jsfiles = [];
let cssfiles = [];

for await (const f of await fs.readdir("./dist/")) {
  if (f.endsWith(".js")) jsfiles.push("./dist/" + f);
  else if (f.endsWith(".css")) cssfiles.push("./dist/" + f);
}
for await (const f of await fs.readdir("./dist/assets/")) {
  if (f.endsWith(".js")) jsfiles.push("./dist/assets/" + f);
  else if (f.endsWith(".css")) cssfiles.push("./dist/assets/" + f);
}

console.log("Minifying!");
for await (const js of jsfiles) {
  console.log(js);
  const source = await fs.readFile(js, {
    encoding: "utf-8",
  });

  const code = uglify.minify(
    { js: source },
    {
      compress: { collapse_vars: true, drop_console: true, unused: true },
      warnings: "verbose",
      sourceMap: true,
      toplevel: true,
    }
  ).code;
  await fs.writeFile(js, code, { encoding: "utf-8" });
  //await fs.writeFile(path.join("./dist/", js), code, "utf-8");
}

const purge = new PurgeCSS();
const res = await purge.purge({
  css: cssfiles.map((i) => `${i}`),
  content: jsfiles.map((i) => `${i}`),
  output: cssfiles.map((i) => `${i}`),
});
console.log(res);
