import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { AppComponent } from '../app.component';
//import { Globals } from 'globals'; 

@Injectable()
export class TranslateService {
  private authToken;
  private languages = [
    { "code": "af", "name": "Afrikaans" },
    { "code": "ar", "name": "Arabic" },
    { "code": "bn", "name": "Bangla" },
    { "code": "bs-Latn", "name": "Bosnian (Latin)" },
    { "code": "bg", "name": "Bulgarian" },
    { "code": "ca", "name": "Catalan" },
    { "code": "zh-CHS", "name": "Chinese Simplified" },
    { "code": "zh-CHT", "name": "Chinese Traditional" },
    { "code": "yue", "name": "Cantonese (Traditional)" },
    { "code": "hr", "name": "Croatian" },
    { "code": "cs", "name": "Czech" },
    { "code": "da", "name": "Danish" },
    { "code": "nl", "name": "Dutch" },
    { "code": "en", "name": "English" },
    { "code": "et", "name": "Estonian" },
    { "code": "fj", "name": "Fijian" },
    { "code": "fil", "name": "Filipino" },
    { "code": "fi", "name": "Finnish" },
    { "code": "fr", "name": "French" },
    { "code": "de", "name": " German" },
    { "code": "el", "name": "Greek" },
    { "code": "ht", "name": "Haitian Creole" },
    { "code": "he", "name": "Hebrew" },
    { "code": "hi", "name": "Hindi" },
    { "code": "mww", "name": "Hmong Daw" },
    { "code": "hu", "name": "Hungarian" },
    { "code": "id", "name": "Indonesian" },
    { "code": "it", "name": "Italian" },
    { "code": "ja", "name": "Japanese" },
    { "code": "sw", "name": "Kiswahili" },
    { "code": "tlh", "name": "Klingon" },
    { "code": "tlh-Qaak", "name": "Klingon (pIqaD)" },
    { "code": "ko", "name": "Korean" },
    { "code": "lv", "name": " Latvian" },
    { "code": "lt", "name": "Lithuanian" },
    { "code": "mg", "name": "Malagasy" },
    { "code": "ms", "name": "Malay" },
    { "code": "mt", "name": "Maltese" },
    { "code": "yua", "name": "Yucatec Maya" },
    { "code": "no", "name": "Norwegian Bokmål" },
    { "code": "otq", "name": "Querétaro Otomi" },
    { "code": "fa", "name": "Persian" },
    { "code": "pl", "name": "Polish" },
    { "code": "pt", "name": "Portuguese" },
    { "code": "ro", "name": "Romanian" },
    { "code": "ru", "name": "Russian" },
    { "code": "sm", "name": "Samoan" },
    { "code": "sr-Cyrl", "name": "Serbian (Cyrillic)" },
    { "code": "sr-Latn", "name": "Serbian (Latin)" },
    { "code": "sk", "name": "Slovak" },
    { "code": "sl", "name": "Slovenian" },
    { "code": "es", "name": "Spanish" },
    { "code": "sv", "name": "Swedish" },
    { "code": "ty", "name": " Tahitian" },
    { "code": "ta", "name": "Tamil" },
    { "code": "th", "name": "Thai" },
    { "code": "to", "name": "Tongan" },
    { "code": "tr", "name": "Turkish" },
    { "code": "uk", "name": "Ukranian" },
    { "code": "ur", "name": "Urdu" },
    { "code": "vi", "name": " Vietnamese" },
    { "code": "cy", "name": "Welsh" }
  ];

  constructor(private http: HttpClient) { }

  getLanguages()
  {
    return this.languages;
  }

  // calls API to translate the inputted text
  translate(fromLang: string, toLang: string, text: string)
  {
    // gets the AuthN token
    this.http.post(
      'https://api.cognitive.microsoft.com/sts/v1.0/issueToken',
      {
        // no body for this call
      },
      {
        headers:
        {
          'Ocp-Apim-Subscription-Key': ''
        },
        'responseType': 'text'
      }
    ).subscribe(
      (token) => {
        this.authToken = token;
        let params = new HttpParams().set('to', toLang)
              .set('text', text)
              .set('from', fromLang)
              .set('appid', 'Bearer ' + this.authToken);

        // gets the translated text
        return this.http.get(
          'https://api.microsofttranslator.com/V2/Http.svc/Translate',
          {
            params,
            'responseType': 'text'
          }
        ).subscribe(
          res => {
            //Globals.TRANSLATED_TEXT = res.toString();
            console.log(res.toString());
          },
          err => {
            console.log("Error in translation");
          },
        );
      },
      err => {
        console.log("Error in getting the token");
      },
      () => {
      }
    );
  }
}