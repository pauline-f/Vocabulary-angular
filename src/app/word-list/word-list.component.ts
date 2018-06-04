import { Component, OnInit, OnDestroy } from '@angular/core';
import { Word } from '../models/Word.model';
import { Subscription } from 'rxjs/Subscription';
import { WordsService } from '../services/words.service';
import { Router } from '@angular/router/';


@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.scss']
})
export class WordListComponent implements OnInit, OnDestroy {
  words: Word[];
  lists: String[];
  wordsSubscription: Subscription;
  listsSubscription: Subscription;

  selected:any;
  filtered :any;
  
  constructor(private wordsService: WordsService, private router: Router) { }

  ngOnInit() {
    this.wordsSubscription = this.wordsService.wordsSubject.subscribe(
      (words: Word[]) => {
        this.words = words;

        this.lists = [];
        for (let item of this.words) {
          if(this.lists.indexOf(item.list) < 0) { 
            this.lists.push(item.list);
          }
        }
      }
    );
    this.wordsService.getWords();
  }

  onNewWord() {
    this.router.navigate(['/word', 'new']);
  }

  onDeleteWord(word: Word) {
    this.wordsService.removeWords(word);
    this.onOptionsSelected();
  }

  onViewWord(word: Word) {
    const wordIndexToView = this.words.findIndex(
      (wordEl) => {
        if (wordEl === word) {
          return true;
        }
      }
    );
    this.router.navigate(['/words', 'view', wordIndexToView]);
  }

  onOptionsSelected() {
    this.filtered = this.words.filter(value=>value.list === this.selected);
  }

  ngOnDestroy() {
    this.wordsSubscription.unsubscribe();
  }
}
