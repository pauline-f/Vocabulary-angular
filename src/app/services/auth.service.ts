import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { LanguagesService } from '../services/languages.service';

@Injectable()
export class AuthService {

  constructor(private languagesService: LanguagesService) { }

  createNewUser (email: string, password: string) {
    return new Promise (
      (resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then (
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  signInUser (email: string, password: string) {
    return new Promise (
      (resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then (
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  signOutUser() {
    firebase.auth().signOut();
    this.languagesService.deleteLanguages();
  }


}
