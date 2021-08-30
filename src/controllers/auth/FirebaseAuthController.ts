import { IAuthController } from "../../interfaces/IAuthController";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithRedirect,
  onAuthStateChanged,
  connectAuthEmulator,
} from "firebase/auth";
import { FirebaseApp } from "firebase/app";
import AppModes from "../../interfaces/AppModes";
import AuthStatus from "../../interfaces/AuthStatus";
import { APP_MODE, SUDO_EMAILS } from "../../../app.config";

export type AuthChangeEvent = {
  status: AuthStatus;
};

export default class FirebaseAuthController implements IAuthController {
  private readonly auth;
  private status = AuthStatus.ANONYMOUS;

  onAuthChange?(x: AuthChangeEvent): void;

  constructor(private readonly app: FirebaseApp) {
    this.auth = getAuth(this.app);
    if (APP_MODE == AppModes.DEBUG) {
      connectAuthEmulator(this.auth, "http://localhost:9099", {
        disableWarnings: true,
      });
    }
    onAuthStateChanged(this.auth, (user) => {
      if (user === null) {
        this.status = AuthStatus.ANONYMOUS;
      } else if (user && user.email && SUDO_EMAILS.includes(user.email)) {
        this.status = AuthStatus.SUDO;
      } else {
        this.status = AuthStatus.SIGNED;
      }
      console.log(
        "Firebase logged:",
        user,
        "with status",
        this.status.toString()
      );
      if (this.onAuthChange) this.onAuthChange({ status: this.status });
    });
  }
  getStatus(): AuthStatus {
    return this.status;
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
