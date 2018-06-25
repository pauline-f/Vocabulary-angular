import { Component, OnInit, OnDestroy } from '@angular/core';
import { Word } from '../models/Word.model';
import { Subscription } from 'rxjs/Subscription';
import { WordsService } from '../services/words.service';
import { LanguagesService } from '../services/languages.service';
import { Router } from '@angular/router/';
import { FilterPipe } from '../filter.pipe';
import { Languages } from '../models/Languages.model';

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.scss']
})
export class WordListComponent implements OnInit, OnDestroy {
  words: Word[];
  lists: String[];
  languages: Languages[];
  wordsSubscription: Subscription;
  listsSubscription: Subscription;
  languagesSubscription: Subscription;
  baseLanguage: string;
  languageToLearn: string;
  
  constructor(private wordsService: WordsService, 
              private router: Router, 
              private languagesService: LanguagesService) { }

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

    this.languagesSubscription = this.languagesService.languagesSubject.subscribe(
      (languages: Languages[]) => {
        this.languages = languages;
        this.baseLanguage = this.languages[0].baseLanguage;
        this.languageToLearn = this.languages[0].languageToLearn;
      }
    );
    this.languagesService.getLanguages();
  }

  onNewWord() {
    this.router.navigate(['/word', 'new']);
  }

  onDeleteWord(word: Word) {
    
    if (confirm("Are you sure to delete the word: " + word.word + "?")) {
      this.wordsService.removeWords(word);
    }
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

  ngOnDestroy() {
    this.wordsSubscription.unsubscribe();
  }

  audioWord(word: Word) {
    var audio = new SpeechSynthesisUtterance(word.translation);
    audio.lang = this.languageToLearn;
    window.speechSynthesis.speak(audio);
  }
  

}
