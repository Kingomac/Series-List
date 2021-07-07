export default abstract class IComponent extends HTMLElement {
  /**
   * @description Attributes that fire the attributeChangedCallback()
   * @example static get observedAttributes() { return ["enabled", "foo"] }
   * @returns string[]
   */
  observedAttributes?(): string[];

  /**
   * @description It's called when the component is loaded
   * @returns void
   */
  connectedCallback?(): void;

  /**
   * @description It's called when the component is removed
   * @returns void
   */
  disconnectedCallback?(): void;

  /**
   * @description It's called when an attribute in the observedAttributes() is changed
   * @param name Name of the attribute changed
   * @param lastValue Previous value of the attribute
   * @param newValue New value of the attribute
   */
  attributeChangedCallback?(name: string, lastValue: any, newValue: any): void;

  /**
   * @description It's called when the component is moved to a new document
   * @param lastDocument
   * @param newDocument
   */
  adoptedCallback?(lastDocument: HTMLDocument, newDocument: HTMLDocument): void;
}
