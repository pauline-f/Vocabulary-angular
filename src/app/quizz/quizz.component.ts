import { Component, OnInit, ElementRef, ViewChild, Renderer } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WordsService } from '../services/words.service';
import { Router, ActivatedRoute } from '@angular/router';
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
  @ViewChild('answer') answer: ElementRef;
  words: Word[];
  quizzForm: FormGroup;
  lists: String[];
  wordsSubscription: Subscription;  
  listsSubscription: Subscription;
  routeSubscription: Subscription;
  languages: Languages[];
  baseLanguage: string;
  languageToLearn: string;
  languagesSubscription: Subscription;
  questionLanguage: string;
  answerLanguage: string;
  baseLanguageConvert: string = "";
  languageToLearnConvert: string = "";

  wordsList: Word[];
  oneWord: Word;
  question: String;
  quizz: number;
  goodAnswer: boolean;
  badAnswer: boolean;
  theAnswer: string;
  numQuizz: number;
  labelQuizz: string;
  quizzNames: String[] = new Array("from-your-language", "from-learned-language", "speech", "random");

  constructor(private formBuilder: FormBuilder,
              private wordsService: WordsService,
              private router: Router,
              private languagesService: LanguagesService,
              private renderer: Renderer,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.languagesSubscription = this.languagesService.languagesSubject.subscribe(
      (languages: Languages[]) => {
        this.languages = languages;
        this.baseLanguage = this.languages[0].baseLanguage;
        this.languageToLearn = this.languages[0].languageToLearn;
        this.convertLanguage();
        this.routeSubscription = this.route.params.subscribe(
          params => {
            this.displayQuizzName(params);
            this.resetQuizz();
          });
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

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
}

  initForm() {
    this.quizzForm = this.formBuilder.group( {
      list: ['', Validators.required],
      answer: ['', Validators.required]
    });
  }

  displayQuizzName(params) {
    const name = params['quizz-type'];
    this.numQuizz = this.quizzNames.findIndex(x => x === name);
    if (this.numQuizz === 3) {
      this.labelQuizz = "Random quizz";
    } else if (this.numQuizz === 2) {
      this.labelQuizz = "Speech quizz";
    } else if (this.numQuizz === 1) {
      this.labelQuizz = this.languageToLearnConvert + " ⇾ " + this.baseLanguageConvert + " quizz";
    } else if (this.numQuizz === 0) {
      this.labelQuizz = this.baseLanguageConvert + " ⇾ " + this.languageToLearnConvert + " quizz";
    }
  }

  playQuizz() {
    if (this.numQuizz === 3) {
      this.quizz = Math.floor(Math.random() * 3);
      this.labelQuizz = "Random quizz";
    } else  {
      this.quizz = this.numQuizz;
    }
    this.chooseOneWord();
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
    this.answer.nativeElement.focus();
    this.playQuizz();
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

  resetQuizz() {
    if(!this.quizzForm)
      return;
    this.quizzForm.get('list').setValue('');
    this.question = "";
    this.quizzForm.get('answer').setValue('');
    this.questionLanguage = "";
    this.answerLanguage = "";
  }

  checkAnswer() {
    var answer = this.quizzForm.get('answer').value;

    if (this.findAnswer() === answer.trim()) {
      this.goodAnswer = true; 
      let waitTime = Observable.timer(2000);
      waitTime.subscribe( x => {
          this.goodAnswer = false;
          this.playQuizz();
          this.quizzForm.get('answer').setValue('');
        } 
      );        
    } else {
      this.badAnswer = true; 
      let waitTime = Observable.timer(2000);
      waitTime.subscribe( x => {
          this.badAnswer = false;
          this.playQuizz();
          this.quizzForm.get('answer').setValue('');
        } 
      );  
    }
    this.answer.nativeElement.focus();
  }

  audioQuestion() {
    var audio = new SpeechSynthesisUtterance(this.oneWord.translation);
    audio.lang = this.questionLanguage;
    window.speechSynthesis.speak(audio);
  }

  convertLanguage() {
    if (this.baseLanguage === "en") {
      this.baseLanguageConvert = "English";
    }
    if (this.baseLanguage === "fr") {
      this.baseLanguageConvert = "French";
    }
    if (this.baseLanguage === "de") {
      this.baseLanguageConvert = "German";
    }
    if (this.baseLanguage === "it") {
      this.baseLanguageConvert = "Italian";
    }
    if (this.baseLanguage === "es") {
      this.baseLanguageConvert = "Spanish";
    }
    if (this.baseLanguage === "sv") {
      this.baseLanguageConvert = "Swedish";
    }

    if (this.languageToLearn === "en") {
      this.languageToLearnConvert = "English";
    }
    if (this.languageToLearn === "fr") {
      this.languageToLearnConvert = "French";
    }
    if (this.languageToLearn === "de") {
      this.languageToLearnConvert = "German";
    }
    if (this.languageToLearn === "it") {
      this.languageToLearnConvert = "Italian";
    }
    if (this.languageToLearn === "es") {
      this.languageToLearnConvert = "Spanish";
    }
    if (this.languageToLearn === "sv") {
      this.languageToLearnConvert = "Swedish";
    }
  }

}
