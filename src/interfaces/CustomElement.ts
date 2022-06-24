export const CustomElement = (tag: string) => (cls: any) => {
  window.customElements.define(tag, cls)
}
