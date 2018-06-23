import { Injectable } from '@angular/core';
import { Languages } from '../models/Languages.model';
import { Subject } from 'rxjs/Subject';
import * as firebase from 'firebase';
import { AuthGuardService } from '../services/auth-guard.service';
import { Observable } from 'rxjs/Rx';


@Injectable()
export class LanguagesService {

  languages: Languages[] = [];
  languagesSubject = new Subject<Languages[]>();

  constructor(private authGuardService: AuthGuardService) { }

  emitLanguages() {
    this.languagesSubject.next(this.languages);
  }

  getLanguages() {
    firebase.database().ref('/languages/' + this.getUserUid())
      .on('value', (data) => {
        this.languages = data.val() ? data.val() : [];
        this.emitLanguages();
      });
  }

  saveLanguages() {
    let waitTime = Observable.timer(3000);
    waitTime.subscribe( x => {
      firebase.database().ref('/languages/' + this.getUserUid()).set(this.languages);
     } 
    );
  }

  createLanguages(newLanguages: Languages) {
    this.languages.push(newLanguages);  
    this.saveLanguages();
    this.emitLanguages();
  }

  getUserUid() {
    return this.authGuardService.getUid();
  }

}
