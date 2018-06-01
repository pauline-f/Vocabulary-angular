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
  
  constructor(private wordsService: WordsService, private router: Router) { }

  ngOnInit() {
    this.wordsSubscription = this.wordsService.wordsSubject.subscribe(
      (words: Word[]) => {
        this.words = words;
      }
    );
    this.listsSubscription = this.wordsService.listsSubject.subscribe(
      (lists: String[]) => {
        this.lists = lists;
      }
    );
    this.wordsService.getWords();
  }

  onNewWord() {
    this.router.navigate(['/words', 'new']);
  }

  onDeleteWord(word: Word) {
    this.wordsService.removeWords(word);
  }

  onViewWord(id:number) {
    this.router.navigate(['/words', 'view', id]);
  }

  

  ngOnDestroy() {
    this.wordsSubscription.unsubscribe();
  }
}
