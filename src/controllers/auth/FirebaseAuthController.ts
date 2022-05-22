import { IAuthController } from '../../interfaces/IAuthController'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { FirebaseApp } from 'firebase/app'
import AuthStatus from '../../interfaces/AuthStatus'
import { isEmailSudo } from './AuthUtil'
import { isDebug } from '../../../app.config'

export type AuthChangeEvent = {
  status: AuthStatus;
};

export default class FirebaseAuthController implements IAuthController {
  private readonly auth
  private status = AuthStatus.ANONYMOUS

  onAuthChange?(x: AuthChangeEvent): void;

  constructor (private readonly app: FirebaseApp) {
    this.auth = getAuth(this.app)
    if (isDebug()) {
      import('firebase/auth').then(({ connectAuthEmulator }) => {
        connectAuthEmulator(this.auth, 'http://localhost:9099', {
          disableWarnings: true
        })
      })
    }
    onAuthStateChanged(this.auth, async (user) => {
      if (user === null) {
        this.status = AuthStatus.ANONYMOUS
      } else {
        const isSudo = user.email ? await isEmailSudo(user.email) : false
        this.status = isSudo ? AuthStatus.SUDO : AuthStatus.SIGNED
      }
      if (this.onAuthChange) this.onAuthChange({ status: this.status })
      console.log(
        'Firebase logged:',
        user,
        'with status',
        AuthStatus[this.status].toString()
      )
    })
  }

  getStatus (): AuthStatus {
    return this.status
  }

  async login (): Promise<void> {
    const { GoogleAuthProvider, signInWithRedirect } = await import(
      'firebase/auth'
    )
    const provider = new GoogleAuthProvider()
    await signInWithRedirect(this.auth, provider)
  }

  async logout (): Promise<void> {
    await this.auth.signOut()
  }

  remember (): void {
    throw new Error('Method not implemented.')
  }
}
