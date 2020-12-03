import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Platform} from "ionic-angular/index";
import {FCM} from "@ionic-native/fcm";

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  signUpForm: FormGroup;
  error_messages: any = {};
  firebaseToken: any = '';
  constructor(public navCtrl: NavController,
              public formBuilder: FormBuilder,
              public platform : Platform,
              public fcm : FCM,
              public navParams: NavParams) {
    platform.ready().then(() => {
      if (platform.is('cordova')) {
        this.getFirebaseToken();
      }
    });
    this.setupSignUpForm();
  }

  ionViewDidLoad() {
  }

  login() {
    this.navCtrl.setRoot('LoginPage')
  }
  signup() {
    let requestData = {
      email : this.signUpForm.value.email,
      password : this.signUpForm.value.password,
      fcm_token : this.signUpForm.value.firebaseToken,
    }
    this.navCtrl.push('UserDetailsPage',{requestData:requestData});
  }

  setupSignUpForm() {
    this.error_messages = {
      email: [
        { type: "required", message: 'Email is required' },
        { type: "pattern", message: '*Enter valid email' },
      ],
      password: [
        { type: "required", message: 'Password is required' },
        { type: "minlength", message: '*Minimum length should be 8' },
        { type: "maxlength", message: '*Maximum length should be 12' }
      ]
    };
    this.signUpForm = this.formBuilder.group(
      {
        email: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
          ])
        ),
        password: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(12)
          ])
        )
      },
    );
  }
  getFirebaseToken() {
    this.fcm.subscribeToTopic('marketing');
    this.fcm.getToken().then(token => {
      this.firebaseToken = token;
      console.log('token >>>',this.firebaseToken);
    });

    this.fcm.onNotification().subscribe(data => {
      if(data.wasTapped){
        console.log("Received in background",data);
      } else {
        console.log("Received in foreground",data);
      }
    });

    this.fcm.onTokenRefresh().subscribe(token => {
      // console.log('onTokenRefresh called !!!',token);
    });
    this.fcm.unsubscribeFromTopic('marketing');
  }
}
