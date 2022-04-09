import { AuthChangeEvent } from "../controllers/auth/FirebaseAuthController";
import IComponent from "./Component";

export default abstract class View extends IComponent {
  abstract authChangeEvent(x: AuthChangeEvent): Promise<void>;
}
