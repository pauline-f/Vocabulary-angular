import { Injectable } from '@angular/core';
import { Word } from '../models/Word.model';
import { Subject } from 'rxjs/Subject';
import * as firebase from 'firebase';

@Injectable()
export class WordsService {

  words: Word[] = [];
  wordsSubject = new Subject<Word[]>();

  constructor() { }

  emitWords() {
    this.wordsSubject.next(this.words);
  }

  saveWords() {
    firebase.database().ref('/words').set(this.words);
  }

  getWords() {
    firebase.database().ref('/words')
      .on('value', (data) => {
        this.words = data.val() ? data.val() : [];
        this.emitWords();
      });
  }

  getSingleWord(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/words/+id').once('value').then(
          (data) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
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
