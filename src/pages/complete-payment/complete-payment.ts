import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {App} from "ionic-angular/index";

/**
 * Generated class for the CompletePaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-complete-payment',
  templateUrl: 'complete-payment.html',
})
export class CompletePaymentPage {

  constructor(public navCtrl: NavController, public app : App, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompletePaymentPage');
  }
  notification(){
    this.app.getRootNav().push('NotificationsPage');
  }
}
