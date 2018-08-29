
import firebase from '@/database';

export class Auth {
  private static instance: Auth;
  private constructor() {
    firebase.auth().signInAnonymously().catch(err => console.error);
  }
  static getInstance() {
    if (!Auth.instance) {
      Auth.instance = new Auth();
    }
    return Auth.instance;
  }
  public checkLoggedIn() {
    return true;
  }
}
