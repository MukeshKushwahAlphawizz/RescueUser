import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";
import {Events} from "ionic-angular/index";

@IonicPage()
@Component({
  selector: 'page-summary',
  templateUrl: 'summary.html',
})
export class SummaryPage {

  summaryData : any = {}
  userData : any = {}
  bookingId : any = {};
  isRequestAccepted : boolean = false;
  constructor(public navCtrl: NavController,
              public util:UtilProvider,
              public storage:Storage,
              public event:Events,
              public user:User,
              public navParams: NavParams) {
    this.userData = navParams.data.userData;
    this.summaryData = navParams.data.summaryData;
    this.bookingId = navParams.data.bookingId;
    this.event.subscribe('isRequestAccepted',(res)=>{
      if (res){
        this.isRequestAccepted = true;
      }
    })
  }

  ionViewDidLoad() {

  }

  sendRequest(){
      let data = {
        "user_id":this.userData.id,
        "booking_id":this.bookingId
      }
      this.util.presentLoader();
      this.user.bookingRequestConfirm(data).subscribe(res=>{
        let resp : any = res;
        this.util.dismissLoader();
        if (resp.status){
          // this.navCtrl.setRoot('LiveTrackingPage');
          setTimeout(()=>{
            this.util.presentLoader('Your request is sent to the driver, please wait until he confirm...');
          },500)
          setTimeout(()=>{
            if (!this.isRequestAccepted){
              this.util.dismissLoader();
              this.util.presentAlert('Your Request Not Accepted Yet','Please try again!').then(()=>{
                this.navCtrl.popToRoot();
              });
            }
          },30000);
        }else {
          this.util.presentToast(resp.message);
        }

      },error => {
        console.error(error);
        this.util.dismissLoader();
      })
  }
}
