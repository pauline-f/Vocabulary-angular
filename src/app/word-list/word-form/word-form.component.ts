import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WordsService } from '../../services/words.service';
import { Router } from '@angular/router';
import { Word } from '../../models/Word.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-word-form',
  templateUrl: './word-form.component.html',
  styleUrls: ['./word-form.component.scss']
})
export class WordFormComponent implements OnInit {

  wordForm: FormGroup;
  lists: String[];
  listsSubscription: Subscription;
  newList: boolean;

  constructor(private formBuilder: FormBuilder,
              private wordsService: WordsService,
              private router: Router) { }

  ngOnInit() {
    this.listsSubscription = this.wordsService.listsSubject.subscribe(
      (lists: String[]) => {
        this.lists = lists;
      }
    );
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

    
    //this.initForm();
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
    this.router.navigate(['/words']);
  }

}
