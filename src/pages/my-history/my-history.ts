import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {App} from "ionic-angular/index";
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";
import {FirebaseProvider} from "../../providers/firebase/firebase";

@IonicPage()
@Component({
  selector: 'page-my-history',
  templateUrl: 'my-history.html',
})
export class MyHistoryPage {
  historyList: any = [];
  isListEmpty:boolean=false;
  userData:any={};
  constructor(public navCtrl: NavController,
              public util : UtilProvider,
              public user : User,
              public firedb : FirebaseProvider,
              public storage : Storage,
              public app : App,
              public navParams: NavParams) {
  }

  ionViewDidEnter() {
    this.getHistoryList();
  }

  getHistoryList() {
    this.storage.get('userData').then(userData=>{
      this.userData = JSON.parse(userData);
      this.util.presentLoader();
      let data = {
        "user_id":this.userData.id,
        "status":"1"
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

  chat(driver) {
    let driverData = {
      date_of_join:new Date().getTime(),
      id:driver.driver_id+'_D',
      image:driver.driver_image,
      isDriver:true,
      name:driver.driver_name,
    }
    this.firedb.addUser(driverData,this.userData.id+'_C');
    let chatRef = this.userData.id+'_C'+'-'+driverData.id;
    this.app.getRootNav().push("ChatPage",{chatRef:chatRef,driver:driverData,customer:this.userData});
  }

  startTracking(item: any) {
    item.types_id = item.id; //set booking id into types_id for live tracking page
    this.storage.set('currentRoute',item).then(()=>{
      this.app.getRootNav().setRoot('MenuPage');
    })
  }
}
