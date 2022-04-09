import AuthStatus from "./AuthStatus";

export interface IAuthController {
  onAuthChange?(x: {}): void;
  getStatus(): AuthStatus;
  login(x: { pass: string; url: string }): void;
  logout(): void;
  remember(): void;
}
