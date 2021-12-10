import { exec } from "child_process";
import * as uglify from "uglify-js";
import purgecss, { PurgeCSS } from "purgecss";
import * as fs from "fs/promises";
import path from "path";
import { brotliCompress, createBrotliCompress, gzip } from "zlib";
import { argv } from "process";
import { parseArgs } from "./argsParser.js";

try {
  await fs.rm("./dist", { recursive: true });
} catch (e) {
  console.log("Dist directory does not exist");
}
await fs.mkdir("./dist");

const process = exec("npx parcel build ./src/index.html");
process.stdout.on("data", (data) => {
  console.log(data);
});
process.on("exit", async (code) => {
  let jsfiles = [];
  let cssfiles = [];

  for await (const f of await fs.readdir("./dist/")) {
    if (f.endsWith(".js")) jsfiles.push(f);
    else if (f.endsWith(".css")) cssfiles.push(f);
  }

  console.log("Minifying!");
  for await (const js of jsfiles) {
    console.log(js);
    const source = await fs.readFile(path.join("./dist/", js), {
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
    await fs.writeFile(path.join("./dist/", js), code, { encoding: "utf-8" });
    //await fs.writeFile(path.join("./dist/", js), code, "utf-8");
  }

  const purge = new PurgeCSS();
  const res = await purge.purge({
    css: cssfiles.map((i) => `./dist/${i}`),
    content: jsfiles.map((i) => `./dist/${i}`),
    output: cssfiles.map((i) => `./dist/${i}`),
  });
  console.log(res);

  const args = await parseArgs(argv.slice(2));

  /**  @type {BuildOptions} */
  const options = {
    compression: args.compression | null,
  };

  if (options.compression == "brotli") {
    for await (const c of await fs.readdir("./dist", { encoding: "utf-8" })) {
      brotliCompress(
        await fs.readFile(path.join("./dist", c)),
        async (err, res) => {
          if (err) console.log(err);
          else {
            await fs.rm(path.join("./dist", c));
            await fs.writeFile(path.join("./dist", c), new Uint8Array(res), {
              encoding: "utf-8",
            });
            console.log(`${c} Brotli zipped`);
          }
        }
      );
    }
  } else if (options.compression == "gzip") {
    for await (const c of await fs.readdir("./dist", { encoding: "utf-8" })) {
      gzip(await fs.readFile(path.join("./dist", c)), async (err, res) => {
        if (err) console.log(err);
        else {
          await fs.writeFile(path.join("./dist", c), new Uint8Array(res), {
            encoding: "utf-8",
          });
          console.log(`${c} gzipped`);
        }
      });
    }
  }
});
