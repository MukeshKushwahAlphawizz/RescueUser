import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular';
import {Config, Events} from "ionic-angular/index";
import {Storage} from "@ionic/storage";
import {FCM} from "@ionic-native/fcm";
import {UtilProvider} from "../providers/util/util";
import {FirebaseProvider} from "../providers/firebase/firebase";


@Component({
  template: `
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = '';


  constructor(private translate: TranslateService, platform: Platform,
              private statusBar: StatusBar,
              private config: Config,
              public fcm : FCM,
              public util : UtilProvider,
              public fireDb : FirebaseProvider,
              public events : Events,
              private storage: Storage,
              private splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      if (platform.is('cordova')) {
        this.getFirebaseToken();
      }
      storage.get('userData').then(userData=>{
        if (userData){
          this.rootPage = 'MenuPage';
        }else {
          this.rootPage = 'LoginPage';
        }
      })
      // this.fireDb.getAll();
    });
    this.initTranslate();
  }

  initTranslate() {
    this.translate.setDefaultLang('en');
    this.translate.use('en'); // Set your language here

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  getFirebaseToken() {
    this.fcm.subscribeToTopic('marketing');
    this.fcm.getToken().then(token => {
    });

    this.fcm.onNotification().subscribe(data => {
      if(data.wasTapped){
        console.log("Received in background",JSON.stringify(data));
      } else {
        console.log("Received in foreground",JSON.stringify(data));
        if (data.types === '2'){
          //booking request accepted
          this.util.presentAlert('Notification',data.body);
          this.events.publish('bookingAccepted',data);
        }else if (data.types === '3'){
          //booking request declined
          this.util.presentAlert('Notification',data.body);
          this.events.publish('bookingRejected',true);
        }else if (data.types === '4'){
          //Trip Started
          this.util.presentAlert('Notification',data.body);
          this.events.publish('tripStarted',data);
        }else if (data.types === '5'){
          //Trip End
          this.util.presentAlert('Notification',data.body+' Now you can do payment');
          this.events.publish('tripEnded',true);
        }
      }
    });

    this.fcm.onTokenRefresh().subscribe(token => {
      // console.log('onTokenRefresh called !!!',token);
    });
    this.fcm.unsubscribeFromTopic('marketing');
  }
}
