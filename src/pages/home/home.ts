import {Component, NgZone} from '@angular/core';
import {SpeechRecognition} from "@ionic-native/speech-recognition";
import {NavController} from 'ionic-angular';

declare var ApiAIPromises: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  answers = [];
  question = '';

  constructor(public navCtrl: NavController, public ngZone: NgZone, private speechRecognition: SpeechRecognition) {

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
    ApiAIPromises.requestText({
      query: question
    })
      .then(({result: {fulfillment: {speech}}}) => {
        this.ngZone.run(() => {
          this.answers.push(speech);
        });
      })
  }

  sendVoice() {

    let options = {
      language: 'de-DE',
      matches:1
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
    this.speechRecognition.stopListening()
  }
}
