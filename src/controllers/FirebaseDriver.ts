import { FirebaseKeys } from "../../app.config";
import firebase from "firebase";
export default class FirebaseDriver {
  constructor() {
    firebase.initializeApp(FirebaseKeys);
  }
}
