import {Component, NgZone} from '@angular/core';
import {SpeechRecognition} from "@ionic-native/speech-recognition";
import {NavController} from 'ionic-angular';
import {Answer} from "./dataTypes/answerType";
import { TextToSpeech } from '@ionic-native/text-to-speech';

declare var ApiAIPromises: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  answers: Array<Answer> = [];
  question = '';

  constructor(public navCtrl: NavController, public ngZone: NgZone, private speechRecognition: SpeechRecognition, private tts: TextToSpeech) {

  }


  ionViewWillEnter() {
    this.speechRecognition.requestPermission()
      .then(
        () => console.log('Granted'),
        () => console.log('Denied')
      )


    ApiAIPromises.init({
      clientAccessToken: "0f07404dd2794eaca1bab324dfad94b0"
    }).then(result => console.log(result));
  }


  ask(question) {
    this.answers.push({message: question, bot: false});
    ApiAIPromises.requestText({
      query: question
    })
      .then(({result: {fulfillment: {speech}}}) => {
        this.ngZone.run(() => {
          this.answers.push({message: speech, bot: true});
          this.tts.speak({text: speech, locale:'de-DE'})
            .then(() => console.log('Text to speech Success'))
            .catch((reason: any) => console.log(reason));
        });
      })
  }

  sendVoice() {
    console.log('start listening...');

    let options = {
      language: 'de-DE',
      matches: 1
    }

    this.speechRecognition.startListening(options)
      .subscribe(
        (matches: Array<string>) => {
          console.log(matches);
          this.question = matches[0];
          this.ask(matches[0]);
        },
        (onerror) => console.log('error:', onerror)
      )
  }

  stopListening() {
    console.log('stop listening...');

    this.speechRecognition.stopListening()
  }
}
