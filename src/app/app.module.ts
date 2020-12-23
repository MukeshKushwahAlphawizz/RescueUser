import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { User, Api } from '../providers';
import { MyApp } from './app.component';
import { UtilProvider } from '../providers/util/util';
import {FCM} from "@ionic-native/fcm";
import {Geolocation} from "@ionic-native/geolocation";
import { SocialSharing } from '@ionic-native/social-sharing';
import {PayPal} from "@ionic-native/paypal";
import {AngularFireModule} from "angularfire2";
import { FirebaseProvider } from '../providers/firebase/firebase';
import {AngularFireDatabaseModule} from "angularfire2/database";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
/*Client account*/
export const firebaseConfig = {
  apiKey: "AIzaSyDDOPJABmtgSbnE1pO0APWQfqqqus2E3rY",
  authDomain: "reacueanycar.firebaseapp.com",
  databaseURL: "https://reacueanycar.firebaseio.com",
  projectId: "reacueanycar",
  storageBucket: "reacueanycar.appspot.com",
  messagingSenderId: "646728567449",
  appId: "1:646728567449:web:536d70f128cf82fe808608",
  measurementId: "G-L5KGPBMFHG"
};

/*mukesh account*/
/*export const firebaseConfig = {
  apiKey: "AIzaSyA-XfTOLWBWP0-Yeg2jrjsfsbonePzICHk",
  authDomain: "rescuecustomer.firebaseapp.com",
  databaseURL: "https://rescuecustomer.firebaseio.com",
  projectId: "rescuecustomer",
  storageBucket: "rescuecustomer.appspot.com",
  messagingSenderId: "511371251797",
  appId: "1:511371251797:web:238a21448619c4619684dc",
  measurementId: "G-VP9QTPSVJM"
};*/

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    Api,
    User,
    Camera,
    SplashScreen,
    StatusBar,
    FCM,
    PayPal,
    Geolocation,
    SocialSharing,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UtilProvider,
    FirebaseProvider
  ]
})
export class AppModule { }
