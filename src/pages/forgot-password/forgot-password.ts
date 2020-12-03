import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";


@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  email: any = '';
  constructor(public navCtrl: NavController,
              public util:UtilProvider,
              public user : User,
              public storage : Storage,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  send() {
    if (this.email.trim() === '') {
      this.util.presentToast('Please Enter Email');
      return;
    }
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(this.email.trim())) {
      let data = {
        email:this.email,
        login_type:1
      }
      this.util.presentLoader('');
      this.user.forgetPassword(data).subscribe((resp) => {
        let response :any= resp;
        this.util.presentToast(response.message);
        if (response.status){
          this.navCtrl.pop();
        }
        setTimeout(()=>{
          this.util.dismissLoader();
        },500);
      }, (err) => {
        console.error('ERROR :', err);
        this.util.dismissLoader();
        this.util.presentToast(err.error.message);
      });
    }else {
      this.util.presentToast('Please enter valid email');
    }
  }
}
