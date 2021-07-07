export interface IAuthController {
  onAuthChange?(x: {}): void;
  isSudo(): boolean;
  login(x: { pass: string; url: string }): void;
  logout(): void;
  remember(): void;
}
