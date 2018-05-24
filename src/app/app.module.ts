import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { WordListComponent } from './word-list/word-list.component';
import { SingleWordComponent } from './word-list/single-word/single-word.component';
import { WordFormComponent } from './word-list/word-form/word-form.component';
import { HeaderComponent } from './header/header.component';
import { AuthService } from './services/auth.service';
import { WordsService } from './services/words.service';
import { AuthGuardService } from './services/auth-guard.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/signin', component: SigninComponent },
  { path: 'words', component: WordListComponent },
  { path: 'words/new', component: WordFormComponent },
  { path: 'words/view/:id', component: SingleWordComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    WordListComponent,
    SingleWordComponent,
    WordFormComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AuthService,
    WordsService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
