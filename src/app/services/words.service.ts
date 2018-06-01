import { Injectable } from '@angular/core';
import { Word } from '../models/Word.model';
import { Subject } from 'rxjs/Subject';
import * as firebase from 'firebase';

@Injectable()
export class WordsService {

  words: Word[] = [];
  lists: String[] = [];
  wordsSubject = new Subject<Word[]>();
  listsSubject = new Subject<String[]>();

  constructor() { }

  emitWords() {
    this.wordsSubject.next(this.words);
  }
  
  emitLists() {
    this.listsSubject.next(this.lists);
  }

  getWords() {
    firebase.database().ref('/words')
      .on('value', (data) => {
        this.words = data.val() ? data.val() : [];
        this.lists = [];

        for (let item of this.words) {
          if(this.lists.indexOf(item.list) < 0) { 
            this.lists.push(item.list);
          }
        }

        this.emitWords();
        this.emitLists();
      });
  }

  getSingleWord(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/words/' + id).once('value').then(
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
    firebase.database().ref('/words').set(this.words);
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
