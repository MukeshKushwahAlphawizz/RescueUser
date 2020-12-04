import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { User } from '../../providers';
import {UtilProvider} from "../../providers/util/util";
import {Storage} from "@ionic/storage";
import {FCM} from "@ionic-native/fcm";
import {Platform} from "ionic-angular/index";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
    loginForm: FormGroup;
    error_messages: any = {};
    firebaseToken: any = '';
    constructor(public navCtrl: NavController,
                public util:UtilProvider,
                public user : User,
                public fcm : FCM,
                public platform : Platform,
                public storage : Storage,
                public formBuilder: FormBuilder) {
      platform.ready().then(() => {
        if (platform.is('cordova')) {
          this.getFirebaseToken();
        }
      });
      this.setupLoginFormData();
    }
    setupLoginFormData() {
      this.error_messages = {
        email: [
          { type: "required", message: "Email is required" },
          { type: "pattern", message: 'Please enter valid email' }
        ],

        password: [
          { type: "required", message: 'Password is required' },
          { type: "minlength", message: "Minimun length should be 8" },
          { type: "maxlength", message: "Maximum length should be 12" }
        ]
      };
      this.loginForm = this.formBuilder.group(
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
          )},
      );
    }

    ionViewDidLoad() {
    }

    signUp(){
      this.navCtrl.setRoot('SignupPage');
    }

    Forgot_pass(){
      this.navCtrl.push('ForgotPasswordPage');
    }

    doLogin() {
      this.util.presentLoader('');
      let formData = new FormData();
      formData.append('email',this.loginForm.value.email);
      formData.append('password',this.loginForm.value.password);
      formData.append('login_type','1');
      formData.append('fcm_token',this.firebaseToken);

      this.user.login(formData).subscribe(res=>{
        let resp :any = res;
        this.util.presentAlert('',resp.message);
        if (resp.status){
          this.storage.set('userData',JSON.stringify(resp.data)).then(()=>{
            this.navCtrl.setRoot('MenuPage');
          });
        }
        setTimeout(()=>{
          this.util.dismissLoader();
        },500);
      },error => {
        console.error(error);
        this.util.dismissLoader();
      })
    }
  getFirebaseToken() {
    this.fcm.subscribeToTopic('marketing');
    this.fcm.getToken().then(token => {
      this.firebaseToken = token;
      console.log('token >>>',this.firebaseToken);
    });

    /*this.fcm.onNotification().subscribe(data => {
      if(data.wasTapped){
        console.log("Received in background",data);
      } else {
        console.log("Received in foreground",data);
      }
    });*/

    this.fcm.onTokenRefresh().subscribe(token => {
      // console.log('onTokenRefresh called !!!',token);
    });
    this.fcm.unsubscribeFromTopic('marketing');
  }
}
