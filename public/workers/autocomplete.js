
self.onmessage = async (msg) => {
  /** @type string */
  const term = msg.data
  const firstLet = term.charAt(0)
  const link = `/assets/anime_completions/filtered_${firstLet.toUpperCase()}.csv`
  if (link === undefined) {
    postMessage('sadge')
  } else {
    const req = await fetch(link)
    const res = await req.text()
    const toret = []
    for await (const line of res.split(/\r?\n/)) {
      if (line.toLowerCase().startsWith(term.toLowerCase())) {
        for await (const i of line.split('\t')) {
          if (i !== '') toret.push(i)
        }
      }
    }
    postMessage(toret)
  }
}
