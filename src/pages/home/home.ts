import {Component, NgZone} from '@angular/core';
import {SpeechRecognition} from "@ionic-native/speech-recognition";
import {NavController} from 'ionic-angular';

declare var ApiAIPromises: any;
declare var ApiAIPlugin: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  answers = [];

  constructor(public navCtrl: NavController, public ngZone: NgZone, private speechRecognition: SpeechRecognition) {

  }


  ionViewWillEnter() {
    ApiAIPlugin.init({
      clientAccessToken: "0f07404dd2794eaca1bab324dfad94b0"
    }).then(result => console.log(result));


    this.speechRecognition.requestPermission()
      .then(
        () => console.log('Granted'),
        () => console.log('Denied')
      )
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
    this.speechRecognition.startListening()
      .subscribe(
        (matches: Array<string>) => {
          console.log(matches);
          alert(matches);
        },
        (onerror) => console.log('error:', onerror)
      )
  }

  stopListening() {
    this.speechRecognition.stopListening()
  }
}
