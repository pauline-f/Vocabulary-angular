import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LanguagesService } from '../../services/languages.service';
import { Languages } from '../../models/Languages.model'
import { Router } from '@angular/router';
import { error } from 'util';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;
  errorMessage: string;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private languagesService: LanguagesService,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signUpForm = this.formBuilder.group( {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      baseLanguage: ['', [Validators.required]],
      languageToLearn: ['', [Validators.required]]
    });
  }

  onSubmit() {
    const email = this.signUpForm.get('email').value;
    const password = this.signUpForm.get('password').value;
    const baseLanguage = this.signUpForm.get('baseLanguage').value;
    const languageToLearn = this.signUpForm.get('languageToLearn').value;
    const languages = new Languages(baseLanguage, languageToLearn);
    this.authService.createNewUser(email, password).then (
      () => {
        this.router.navigate(['/words']);
      },
      (error) => {
        this.errorMessage = error;
      }
    );
    this.languagesService.createLanguages(languages);
  }

}
