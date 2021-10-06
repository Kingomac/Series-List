/**
 *
 * @param {string[]} argv
 */
export async function parseArgs(argv) {
  let toret = {};
  while (argv.length > 0) {
    const splitted = argv.shift().split("=");
    if (splitted.length > 1) {
      toret[splitted.shift()] = splitted.join("=");
    } else {
      if (splitted[0].startsWith("!")) {
        toret[splitted[0].replace("!", "")] = false;
      } else {
        toret[splitted] = true;
      }
    }
  }
  return toret;
}
