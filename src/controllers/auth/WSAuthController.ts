import AuthStatus from '../../interfaces/AuthStatus'
import { IAuthController } from '../../interfaces/IAuthController'

enum Permission {
  R = 'read',
  RW = 'read-write',
}

export default class WSAuthController implements IAuthController {
  private permission: Permission = Permission.R
  static readonly AUTH_ITEM: string = 'auth'

  onAuthChange?(x: { newAuth: Permission }): void;

  constructor () {
    const auth = window.localStorage.getItem(WSAuthController.AUTH_ITEM)
    if (auth != null) {
      this.permission = Permission.RW
    }
  }

  getStatus (): AuthStatus {
    throw new Error('Method not implemented.')
  }

  isSudo (): boolean {
    return this.permission === Permission.RW
  }

  login (x: { pass: string; url: string }): void {
    const ws = new WebSocket(x.url)
    ws.onopen = () => {
      ws.send(JSON.stringify({ pass: x.pass }))
    }
    ws.onmessage = (ev) => {
      if (ev.data === 'OK') {
        this.permission = Permission.RW
      } else {
        this.permission = Permission.R
      }
      ws.close(1000)
      if (this.onAuthChange !== undefined) {
        this.onAuthChange({ newAuth: this.permission })
      }
    }
  }

  logout (): void {
    this.permission = Permission.R
  }

  remember (): void {
    throw new Error('Method not implemented.')
  }
}
