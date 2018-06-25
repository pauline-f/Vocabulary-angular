import { Injectable } from '@angular/core';
import { Languages } from '../models/Languages.model';
import { Subject } from 'rxjs/Subject';
import * as firebase from 'firebase';
import { AuthGuardService } from '../services/auth-guard.service';

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
      firebase.database().ref('/languages/' + this.getUserUid()).set(this.languages);
  }

  createLanguages(newLanguages: Languages) {
    this.languages.push(newLanguages);  
    this.saveLanguages();
    this.emitLanguages();
  }

  getUserUid() {
    return this.authGuardService.getUid();
  }

  deleteLanguages() {
    this.languages = [];
  }

}
