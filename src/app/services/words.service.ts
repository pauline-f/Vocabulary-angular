import { Injectable } from '@angular/core';
import { Word } from '../models/Word.model';
import { Subject } from 'rxjs/Subject';
import * as firebase from 'firebase';
import { AuthGuardService } from './auth-guard.service';

@Injectable()
export class WordsService {

  words: Word[] = [];
  wordsSubject = new Subject<Word[]>();
  listsSubject = new Subject<String[]>();  

  constructor(private authGuardService: AuthGuardService) { }

  emitWords() {
    this.wordsSubject.next(this.words);
  }

  getWords() {
    firebase.database().ref('/words/' + this.getUserUid())
      .on('value', (data) => {
        this.words = data.val() ? data.val() : [];
        this.emitWords();
      });
  }

  getUserUid() {
    return this.authGuardService.getUid();
  }

  getSingleWord(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/words/' + this.getUserUid() + "/" + id).once('value').then(
          (data) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  saveWords() {
    firebase.database().ref('/words/' + this.getUserUid()).set(this.words);
  }

  createNewWord(newWord: Word) {
    this.words.push(newWord);    
    this.saveWords();
    this.emitWords();
  }

  removeWords(word: Word) {
    const wordIndexToRemove = this.words.findIndex(
      (wordEl) => {
        if (wordEl === word) {
          return true;
        }
      }
    );
    this.words.splice(wordIndexToRemove, 1);
    this.saveWords();
    this.emitWords();
  }

}
