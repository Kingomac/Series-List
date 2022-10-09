'use strict'

/**
 *
 * @param {string} term
 * @param {string[]} input
 * @returns
 */
async function searchStart (term, input) {
  let start = 0
  while (!input[start].toLocaleLowerCase().startsWith(term)) {
    start++
    console.log(input)
    console.log(start)
    console.log(input[start])
  }
  return start
}

/**
 *
 * @param {string} term
 * @param {string[]} input
 * @returns
 */
async function searchEnd (term, input) {
  let end = input.length - 1
  while (end > 0 && !input[end].toLocaleLowerCase().startsWith(term)) {
    end--
  }
  return end
}
async function searchStartWith (term, input) {
  const results = await Promise.all([searchStart(term, input), searchEnd(term, input)])
  return input.slice(results[0], results[1] + 1)
}

self.onmessage = async (msg) => {
  /** @type string */
  const term = msg.data
  const firstLet = term.charAt(0) + term.charAt(1)
  const link = `/assets/anime_completions/${firstLet.toLowerCase()}.txt`
  if (link === undefined) {
    postMessage('sadge')
    return
  }
  const req = await fetch(link)
  const res = await req.text()
  const toret = await searchStartWith(term.toLocaleLowerCase(), res.split(/\r?\n|\r|\n/g))
  postMessage(toret)
}
