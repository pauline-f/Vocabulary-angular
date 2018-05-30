import { Component, OnInit } from '@angular/core';
import { Word } from '../../models/Word.model';
import { ActivatedRoute, Router } from '@angular/router';
import { WordsService } from '../../services/words.service';

@Component({
  selector: 'app-single-word',
  templateUrl: './single-word.component.html',
  styleUrls: ['./single-word.component.scss']
})
export class SingleWordComponent implements OnInit {

  word: Word;

  constructor(private route: ActivatedRoute,
              private wordsService: WordsService,
              private router: Router) { }

  ngOnInit() {
    this.word = new Word('', '');
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
