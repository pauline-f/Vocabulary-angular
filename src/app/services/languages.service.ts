import { Injectable } from '@angular/core';
import { Languages } from '../models/Languages.model';
import { Subject } from 'rxjs/Subject';
import * as firebase from 'firebase';

@Injectable()
export class LanguagesService {

  languages: Languages[] = [];
  languagesSubject = new Subject<Languages[]>();

  constructor() { }

  emitLanguages() {
    this.languagesSubject.next(this.languages);
  }

  getLanguages() {
    firebase.database().ref('/languages')
      .on('value', (data) => {
        this.languages = data.val() ? data.val() : [];
        this.emitLanguages();
      });
  }

  saveLanguages() {
    firebase.database().ref('/languages').set(this.languages);
  }

  createLanguages(newLanguages: Languages) {
    this.languages.push(newLanguages);    
    this.saveLanguages();
    this.emitLanguages();
  }

}
