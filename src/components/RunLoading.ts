export async function runLoading (func: () => Promise<void>, el: HTMLElement) {
  el.setAttribute('disabled', '')
  const prevHTML = el.innerHTML
  const prog = document.createElement('progress')
  el.textContent = ''
  el.append(prog)
  await func()
  prog.remove()
  el.innerHTML = prevHTML
  el.removeAttribute('disabled')
}
