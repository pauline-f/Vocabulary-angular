import { Component, OnInit, transition } from '@angular/core';
import * as firebase from 'firebase';
import { AuthService } from '../services/auth.service';
import { fail } from 'assert';
import { Languages } from '../models/Languages.model';
import { Subscription } from 'rxjs/Subscription';
import { LanguagesService } from '../services/languages.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAuth: boolean;
  languages: Languages[];
  baseLanguage: string;
  languageToLearn: string;
  baseLanguageConvert: string;
  languageToLearnConvert: string;
  languagesSubscription: Subscription;

  constructor(private authService: AuthService, private languagesService: LanguagesService) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(
      (user) => {
        if (user) {
          this.isAuth = true;


          let waitTime = Observable.timer(2000);
          waitTime.subscribe( x => {
            this.languagesSubscription = this.languagesService.languagesSubject.subscribe(
              (languages: Languages[]) => {
                this.languages = languages;
                this.baseLanguage = this.languages[0].baseLanguage;
                this.languageToLearn = this.languages[0].languageToLearn;
              }
            );
            this.languagesService.getLanguages();
            this.convertLanguage();
            } 
          );
        } else {
          this.isAuth = false;
        }
      }
    );
  }

  onSignOut() {
    this.authService.signOutUser();
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
