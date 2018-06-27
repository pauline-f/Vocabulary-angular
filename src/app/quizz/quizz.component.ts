import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WordsService } from '../services/words.service';
import { Router } from '@angular/router';
import { Word } from '../models/Word.model';
import { Languages } from '../models/Languages.model';
import { Subscription } from 'rxjs/Subscription';
import { LanguagesService } from '../services/languages.service';
import { Observable } from 'rxjs/Rx';

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
  languages: Languages[];
  baseLanguage: string;
  languageToLearn: string;
  languagesSubscription: Subscription;
  questionLanguage: string;
  answerLanguage: string;

  wordsList: Word[];
  oneWord: Word;
  question: String;
  answer: String;
  quizz: number;
  goodAnswer: boolean;
  badAnswer: boolean;
  theAnswer: string;

  constructor(private formBuilder: FormBuilder,
              private wordsService: WordsService,
              private router: Router,
              private languagesService: LanguagesService) { }

  ngOnInit() {
    this.languagesSubscription = this.languagesService.languagesSubject.subscribe(
      (languages: Languages[]) => {
        this.languages = languages;
        this.baseLanguage = this.languages[0].baseLanguage;
        this.languageToLearn = this.languages[0].languageToLearn;
      }
    );
    this.languagesService.getLanguages();

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

  initForm() {
    this.quizzForm = this.formBuilder.group( {
      list: ['', Validators.required],
      answer: ['', Validators.required]
    });
  }

  quizzRandom() {
    this.chooseOneWord();
    this.quizz = Math.floor(Math.random() * 3);
    this.loadFlags();
    this.displayQuestion();
    }

  loadFlags() {
    if (this.quizz === 0) {
      this.questionLanguage = this.baseLanguage;
      this.answerLanguage = this.languageToLearn;
    } else if (this.quizz === 1) {
      this.questionLanguage = this.languageToLearn;
      this.answerLanguage = this.baseLanguage;
    } else if (this.quizz === 2) {
      this.questionLanguage = this.languageToLearn;
      this.answerLanguage = this.baseLanguage;
    }
  }

  wordsOfList() {
    this.wordsList = [];
    var list = this.quizzForm.get('list').value
    for (let word of this.words) {
      if (word.list === list) {
        this.wordsList.push(word);
      }
    }
    this.quizzRandom();
  }

  chooseOneWord() {
    this.oneWord = this.wordsList[Math.floor(Math.random() * this.wordsList.length)];
  }

  displayQuestion() {
    if (this.quizz === 0) {
      this.question = this.oneWord.word;
    } else if (this.quizz === 1) {
      this.question = this.oneWord.translation;
    } else if (this.quizz === 2) {
      this.question = "";
      this.audioQuestion();
    }
  }

  findAnswer(): String {
    if (this.quizz === 0) {
      this.theAnswer = this.oneWord.translation;
    } else if (this.quizz === 1) {
      this.theAnswer = this.oneWord.word;
    } else if (this.quizz === 2) {
      this.theAnswer = this.oneWord.word;
    }
    return this.theAnswer;
  }

  checkAnswer() {
    var answer = this.quizzForm.get('answer').value;

    if (this.findAnswer() === answer) {
      this.goodAnswer = true; 
      let waitTime = Observable.timer(2000);
      waitTime.subscribe( x => {
          this.goodAnswer = false;
          this.quizzRandom();
          this.quizzForm.get('answer').setValue('');
        } 
      );        
    } else {
      this.badAnswer = true; 
      let waitTime = Observable.timer(2000);
      waitTime.subscribe( x => {
          this.badAnswer = false;
          this.quizzRandom();
          this.quizzForm.get('answer').setValue('');
        } 
      );  
    }
  }

  audioQuestion() {
    var audio = new SpeechSynthesisUtterance(this.oneWord.translation);
    audio.lang = this.questionLanguage;
    window.speechSynthesis.speak(audio);
  }

}
