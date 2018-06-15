import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WordsService } from '../services/words.service';
import { Router } from '@angular/router';
import { Word } from '../models/Word.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.scss']
})
export class QuizzComponent implements OnInit {
  words: Word[];
  quizzForm: FormGroup;
  lists: String[];
  wordsSubscription: Subscription;  
  listsSubscription: Subscription;

  wordsList: String[];
  oneWord: String;
  translation: String;

  constructor(private formBuilder: FormBuilder,
              private wordsService: WordsService,
              private router: Router) { }

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
    this.initForm();
  }

  displayOneWord() {
    this.wordsList = [];
    var list = this.quizzForm.get('list').value
    for (let word of this.words) {
      if (word.list === list) {
        this.wordsList.push(word.word);
      }
    }
    this.oneWord = this.wordsList[Math.floor(Math.random() * this.wordsList.length)]
  }

  initForm() {
    this.quizzForm = this.formBuilder.group( {
      list: ['', Validators.required],
      translation: ['', Validators.required]
    });
  }

  findTranslation(): String {
    var list = this.quizzForm.get('list').value;
    for (let word of this.words) {
      if ((word.list === list) && (word.word === this.oneWord))  {
        return word.translation;
      }
    }
  }

  checkTranslation() {
    var translation = this.quizzForm.get('translation').value;

    if (this.findTranslation() === translation) {
      alert("Good answer!");
    } else {
      alert("The good answer was: " + this.findTranslation() + "!");
    }

    this.displayOneWord();
    this.quizzForm.get('translation').setValue('');
  }

}
