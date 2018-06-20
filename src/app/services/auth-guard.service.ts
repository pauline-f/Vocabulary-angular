import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router/';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';

@Injectable()
export class AuthGuardService implements CanActivate {

  userUid: String;

  constructor(private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise (
      (resolve, reject) => {
        firebase.auth().onAuthStateChanged(
          (user) => {
            if (user) {
              this.userUid = user.uid;              
              resolve(true);
            } else {
              this.router.navigate(['/auth', 'signin']);
              resolve(false);
            }
          }
        );
      }
    );
  }

  getUid() {
    if (this.userUid === "") {
      return null;
    } else {
      return this.userUid;
    }
  }

}
