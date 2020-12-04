import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {App} from "ionic-angular/index";
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";

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

  historyList: any = [];
  isListEmpty:boolean=false;
  constructor(public navCtrl: NavController,
              public util : UtilProvider,
              public user : User,
              public storage : Storage,
              public app : App,
              public navParams: NavParams) {
  }

  ionViewDidEnter() {
    this.getHistoryList();
  }
  getHistoryList() {
    this.storage.get('userData').then(userData=>{
      let user : any = JSON.parse(userData);
      this.util.presentLoader();
      let data = {
        "user_id":user.id,
        "status":"2"
      }
      this.user.getHistory(data).subscribe(res=>{
        let resp : any =res;
        if (resp.status){
          this.historyList = resp.data;
        }
        this.historyList && this.historyList.length>0?this.isListEmpty=false:this.isListEmpty=true;
        setTimeout(()=>{
          this.util.dismissLoader();
        },500)
      },error => {
        console.error(error);
        this.util.dismissLoader();
        this.historyList && this.historyList.length>0?this.isListEmpty=false:this.isListEmpty=true;
      })
    })
  }
  notification(){
    this.app.getRootNav().push('NotificationsPage');
  }
}
