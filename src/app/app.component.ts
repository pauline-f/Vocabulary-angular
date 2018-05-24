import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() {
    var config = {
      apiKey: "AIzaSyATt5bvHWUUYfbPBeYRrhrIc0T0n8xN94I",
      authDomain: "vocabulary-cd6bb.firebaseapp.com",
      databaseURL: "https://vocabulary-cd6bb.firebaseio.com",
      projectId: "vocabulary-cd6bb",
      storageBucket: "",
      messagingSenderId: "1017780856383"
    };
    firebase.initializeApp(config);
  }
}
