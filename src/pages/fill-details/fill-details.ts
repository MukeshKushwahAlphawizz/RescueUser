import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";


@IonicPage()
@Component({
  selector: 'page-fill-details',
  templateUrl: 'fill-details.html',
})
export class FillDetailsPage {

  requestData:any= {};
  userData:any= {};
  source:any= {};
  destination:any= {};
  isPickupLater: boolean = false;
  constructor(public navCtrl: NavController,
              public util:UtilProvider,
              public user:User,
              public storage:Storage,
              public navParams: NavParams) {
    this.requestData=navParams.data.requestData;
    this.source = this.navParams.data.source;
    this.destination = this.navParams.data.destination;
  }
  getUserData() {
    this.storage.get('userData').then(userData=>{
      this.userData = JSON.parse(userData);
    })
  }

  ionViewDidLoad() {
    this.getUserData();
  }
  confirm() {
    this.util.presentLoader();
    this.user.bookingRequest(this.requestData).subscribe(res=>{
      let resp : any =res;
      if (resp.status){
        this.navCtrl.push('SummaryPage',{summaryData:resp.data,bookingId:this.requestData.booking_id,userData:this.userData})
      }
      setTimeout(()=>{
        this.util.dismissLoader();
      },500);
    },error => {
      console.log(error);
      this.util.dismissLoader();
    })
  }
  notification() {
    this.navCtrl.push('NotificationsPage')
  }
}
