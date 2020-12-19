import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})

export class TabsPage {
  tab1Root: any = 'MyHistoryPage';
  tab2Root: any = 'CompletePaymentPage';
  tab3Root: any = 'CancelPaymentPage';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

  }

  notification() {
    this.navCtrl.push('NotificationsPage');
  }
}
