import { IAuthController } from '../src/interfaces/IAuthController'

export default class FakeAuth implements IAuthController {
  private sudo: boolean = false
  onAuthChange?(): void;

  isSudo (): boolean {
    return this.sudo
  }

  login (x: { pass: string; url: string }): void {
    this.sudo = true
    this.onAuthChange!()
  }

  logout (): void {
    this.sudo = false
    this.onAuthChange!()
  }

  remember (): void {
    throw new Error('Method not implemented.')
  }
}
