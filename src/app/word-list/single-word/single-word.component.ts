import { Component, OnInit } from '@angular/core';
import { Word } from '../../models/Word.model';
import { ActivatedRoute, Router } from '@angular/router';
import { WordsService } from '../../services/words.service';
import { LanguagesService } from '../../services/languages.service';
import { Languages } from '../../models/Languages.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-single-word',
  templateUrl: './single-word.component.html',
  styleUrls: ['./single-word.component.scss']
})
export class SingleWordComponent implements OnInit {

  word: Word;
  languages: Languages[];
  baseLanguage: String;
  languageToLearn: String;
  languagesSubscription: Subscription;

  constructor(private route: ActivatedRoute,
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

    this.word = new Word('', '', '');
    const id = this.route.snapshot.params['id'];
    this.wordsService.getSingleWord(+id).then(
      (word: Word) => {
        this.word = word;
      }
    );
  }

  onBack() {
    this.router.navigate(['/words']);
  }

}
