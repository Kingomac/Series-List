
self.onmessage = async (msg) => {
  /** @type string */
  const term = msg.data
  const firstLet = term.charAt(0) + term.charAt(1)
  const link = `/assets/anime_completions/${firstLet.toLowerCase()}.txt`
  if (link === undefined) {
    postMessage('sadge')
  } else {
    const req = await fetch(link)
    const res = await req.text()
    const toret = []
    for await (const line of res.split(/\r?\n/)) {
      if (line.toLowerCase().startsWith(term.toLowerCase())) {
        toret.push(line)
      }
    }
    postMessage(toret)
  }
}
