import { IAuthController } from "../../interfaces/IAuthController";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithRedirect,
  onAuthStateChanged,
} from "firebase/auth";
import { FirebaseApp } from "firebase/app";

export default class FirebaseAuthController implements IAuthController {
  private readonly auth;
  private logged = false;

  onAuthChange?(): void;

  constructor(private readonly app: FirebaseApp) {
    this.auth = getAuth(this.app);
    onAuthStateChanged(this.auth, (user) => {
      this.logged = user != null;
      console.log("Firebase logged:", user);
      if (this.onAuthChange) this.onAuthChange();
    });
  }
  isSudo(): boolean {
    return this.logged;
  }
  async login(): Promise<void> {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(this.auth, provider);
  }
  async logout(): Promise<void> {
    await this.auth.signOut();
  }
  remember(): void {
    throw new Error("Method not implemented.");
  }
}
