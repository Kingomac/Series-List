import * as fs from 'fs/promises'
import path from 'path'
import { brotliCompress, gzip } from 'zlib'
import { argv } from 'process'
import { parseArgs } from './argsParser.js'

const args = await parseArgs(argv.slice(2))

/**  @type {BuildOptions} */
const options = {
  compression: args.compression | null
}

if (options.compression === 'brotli') {
  for await (const c of await fs.readdir('./dist', { encoding: 'utf-8' })) {
    brotliCompress(
      await fs.readFile(path.join('./dist', c)),
      async (err, res) => {
        if (err) console.log(err)
        else {
          await fs.rm(path.join('./dist', c))
          await fs.writeFile(path.join('./dist', c), new Uint8Array(res), {
            encoding: 'utf-8'
          })
          console.log(`${c} Brotli zipped`)
        }
      }
    )
  }
} else if (options.compression === 'gzip') {
  for await (const c of await fs.readdir('./dist', { encoding: 'utf-8' })) {
    gzip(await fs.readFile(path.join('./dist', c)), async (err, res) => {
      if (err) console.log(err)
      else {
        await fs.writeFile(path.join('./dist', c), new Uint8Array(res), {
          encoding: 'utf-8'
        })
        console.log(`${c} gzipped`)
      }
    })
  }
}
