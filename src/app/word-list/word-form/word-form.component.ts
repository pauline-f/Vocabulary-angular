import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WordsService } from '../../services/words.service';
import { Router } from '@angular/router';
import { Word } from '../../models/Word.model';

@Component({
  selector: 'app-word-form',
  templateUrl: './word-form.component.html',
  styleUrls: ['./word-form.component.scss']
})
export class WordFormComponent implements OnInit {

  wordForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private wordsService: WordsService,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
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
