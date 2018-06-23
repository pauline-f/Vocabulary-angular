import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WordsService } from '../../services/words.service';
import { Router } from '@angular/router';
import { Word } from '../../models/Word.model';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '../../services/translate.service';
import { Globals } from '../../globals';
import { Observable } from 'rxjs/Rx';
import { Languages } from '../../models/Languages.model';
import { LanguagesService } from '../../services/languages.service';

@Component({
  selector: 'app-word-form',
  templateUrl: './word-form.component.html',
  styleUrls: ['./word-form.component.scss'],
  providers: [Globals]
})
export class WordFormComponent implements OnInit {
  words: Word[];
  wordForm: FormGroup;
  languages: Languages[];
  lists: String[];
  wordsSubscription: Subscription;  
  listsSubscription: Subscription;
  languagesSubscription: Subscription;
  newList: boolean;

  constructor(private formBuilder: FormBuilder,
              private wordsService: WordsService,
              private router: Router,
              private translateService: TranslateService, 
              private globals: Globals,
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

    this.languagesSubscription = this.languagesService.languagesSubject.subscribe(
      (languages: Languages[]) => {
        this.languages = languages;
      }
    );
    
    this.languagesService.getLanguages();
    this.wordsService.getWords();
    this.newList = false;
    this.initForm();
  }

  addNewList() {
    if (this.wordForm.get('list').value === "Add a new list") {
      this.wordForm.get('list').setValue("");
      this.newList = true;
    } else {
      this.newList = false;
    }
  }

  initForm() {
    this.wordForm = this.formBuilder.group( {
      list: ['', Validators.required],
      word: ['', Validators.required],
      translation: ['', Validators.required]
    });
  }

  onSaveWord() {
    const list = this.wordForm.get('list').value;
    const word = this.wordForm.get('word').value;
    const translation = this.wordForm.get('translation').value;
    const newWord = new Word(list, word, translation);
    this.wordsService.createNewWord(newWord);
    this.wordForm.get('word').setValue('');
    this.wordForm.get('translation').setValue('');
  }

  translateOneWord() {
    const word = this.wordForm.get('word').value;
    this.translateService.translate(this.languages[0].baseLanguage, this.languages[0].languageToLearn, word);
    let waitTime = Observable.timer(2000);
    waitTime.subscribe( x => {
      this.wordForm.get('translation').setValue(Globals.TRANSLATED_TEXT);
     } 
    );    
    
  }
  

}
