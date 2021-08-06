import { IAuthController } from "../../interfaces/IAuthController";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithRedirect,
  onAuthStateChanged,
  useAuthEmulator,
} from "firebase/auth";
import { FirebaseApp } from "firebase/app";
import { APP_MODE, AppModes } from "../../../app.modes";

export type AuthChangeEvent = {
  isSudo: boolean;
};

export default class FirebaseAuthController implements IAuthController {
  private readonly auth;
  private logged = false;

  onAuthChange?(x: AuthChangeEvent): void;

  constructor(private readonly app: FirebaseApp) {
    this.auth = getAuth(this.app);
    if (APP_MODE == AppModes.DEBUG) {
      useAuthEmulator(this.auth, "http://localhost:9099", {
        disableWarnings: true,
      });
    }
    onAuthStateChanged(this.auth, (user) => {
      this.logged = user != null;
      console.log("Firebase logged:", user);
      if (this.onAuthChange) this.onAuthChange({ isSudo: user != null });
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
