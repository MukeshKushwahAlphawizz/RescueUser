import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {App} from "ionic-angular/index";

/**
 * Generated class for the CancelPaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cancel-payment',
  templateUrl: 'cancel-payment.html',
})
export class CancelPaymentPage {

  constructor(public navCtrl: NavController, public app : App, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CancelPaymentPage');
  }
  notification(){
    this.app.getRootNav().push('NotificationsPage');
  }
}
