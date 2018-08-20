import {Component, NgZone} from '@angular/core';
import {NavController} from 'ionic-angular';

declare var ApiAIPromises: any;
declare var ApiAIPlugin: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  answers = [];

  constructor(public navCtrl: NavController, public ngZone: NgZone) {

  }


  ionViewWillEnter() {
    ApiAIPlugin.init({
      clientAccessToken: "0f07404dd2794eaca1bab324dfad94b0"
    }).then(result => console.log(result));




    ApiAIPromises.setListeningStartCallback(function () {
      console.log("listening started");
    });

    ApiAIPromises.setListeningFinishCallback(function () {
      console.log("listening stopped");
    });

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
    try {
      ApiAIPlugin.levelMeterCallback(function(level) {
        console.log(level);
      });

      ApiAIPlugin.requestVoice(
        {}, // empty for simple requests, some optional parameters can be here
         (response) => {
          // place your result processing here
           console.log(JSON.stringify(response));
          alert(JSON.stringify(response));
        },
         (error) => {
          // place your error processing here
          alert(error);
        });
    } catch (e) {
      alert(e);
    }
  }

  stopListening() {
    try {
      ApiAIPlugin.stopListening();

    } catch (e) {
      alert(e);
    }
  }


}
