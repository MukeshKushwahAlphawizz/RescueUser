import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {User} from "../../providers";
import {UtilProvider} from "../../providers/util/util";
import {Storage} from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  userData: any = {};
  pageSize: number = 10;
  pageNumber: number = 1;
  notificationList: any[] = [];
  isListEmpty: boolean = false;
  isTodayAvailable: boolean = false;
  isYesterdayAvailable: boolean = false;
  isPast: boolean = false;
  isFromLiveTracking:boolean=false;
  constructor(public navCtrl: NavController,
              public user: User,
              public util: UtilProvider,
              public storage: Storage,
              public navParams: NavParams) {
    this.isFromLiveTracking = navParams.data.fromLiveTracking;
  }

  ionViewDidLoad() {
    this.getUserData();
  }
  notification() {

  }
  getUserData() {
    this.storage.get('userData').then(userData=>{
      this.userData = JSON.parse(userData);
      this.pageNumber = 1;
      this.getAllNotification(this.pageNumber,true).then(res=>{
      }).catch(err=>{});
    })
  }

  getAllNotification(pageNumber,isShowLoader) {
    return new Promise((resolve, reject) => {
      if (isShowLoader){
        this.util.presentLoader();
      }
      let data = {
        "user_id":this.userData.id,
        "user_type":"1",
        "pageNumber":this.pageNumber,
        "pageSize":this.pageSize
      }
      this.user.getAllNotificationList(data).subscribe(res=>{
        let response : any = res;
        if (response.status){
          pageNumber == 1?this.notificationList = response.data:
            this.notificationList = [...this.notificationList,...response.data];

          this.notificationList = this.notificationList.filter(item=>{
            if (this.checkIsToday(parseInt(item.create_dt))){
              item.isToday = true;
              item.isYesterday = false;
              item.isOld = false;
              this.isTodayAvailable = true
            }else if (this.checkIsYesterday(parseInt(item.create_dt))){
              item.isToday = false;
              item.isYesterday = true;
              item.isOld = false;
              this.isYesterdayAvailable = true;
            }else {
              item.isOld = true;
              item.isToday = false;
              item.isYesterday = false;
              this.isPast = true;
            }
            return item;
          })
          this.notificationList.length > 0 ? this.isListEmpty = false: this.isListEmpty = true;
          this.pageNumber = this.pageNumber + 1;
          resolve('');
        }else {
          pageNumber==1? this.notificationList = []:'';
          this.notificationList.length > 0 ? this.isListEmpty = false: this.isListEmpty = true;
          reject('');
        }
        if (isShowLoader){
          setTimeout(()=>{
            this.util.dismissLoader();
          },500);
        }
      },error => {
        reject('');
        console.error(error);
        if (isShowLoader){
          this.util.dismissLoader();
        }
      })
    })
  }

  doRefresh(refresher) {
    this.pageNumber = 1;
    this.getAllNotification(this.pageNumber,false).then(succ=>{
      // console.log('succ',succ);
      refresher.complete();
    }).catch(err=>{
      console.log(err);
      refresher.complete();
    })
  }
  doInfinite(infiniteScroll) {
    this.getAllNotification(this.pageNumber,false).then(succ=>{
      infiniteScroll.complete();
    }).catch(err=>{
      infiniteScroll.complete();
    })
  }

  clear(isClearAll: boolean) {
    let d : any = new Date();
    let yesterday : any = '';
    if (isClearAll){
       yesterday = d.setDate(d.getDate() - 1);
    }
    let data = {
      "user_id":this.userData.id,
      "user_type":"1",
      "is_clear":isClearAll?'1':'2',
      "notification_date":isClearAll?yesterday.getTime():d.getTime()
    }
    this.util.presentConfirm('Clear notification','Are you sure want to clear?').then(succ=>{
      this.util.presentLoader('Clearing..');
      this.user.clearNotification(data).subscribe(succ=>{
        this.util.dismissLoader();
        let response : any = succ;
        if (response.status){
          this.util.presentToast(response.message);
        }
        this.pageNumber = 1;
        this.getAllNotification(this.pageNumber,true).then(succ=>{
        }).catch(err=>{
        })
      },err=>{
        console.log(err);
        this.util.dismissLoader();
      })

    }).catch(err=>{})
  }

  checkIsToday(date:any){
    const today = new Date();
    const someDate = new Date(parseInt(date));
    if (someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()){
      return true;
    }else {
      return false;
    }
  }
  checkIsYesterday(date:any){
    const today = new Date();
    const someDate = new Date(parseInt(date));
    let date1_tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    if (date1_tomorrow.getFullYear() == someDate.getFullYear() && date1_tomorrow.getMonth() == someDate.getMonth()
      && date1_tomorrow.getDate() == someDate.getDate()) {
      // console.log('1.yesterday date');
      return true;
    }else {
      return false;
    }
  }

  startLiveTracking(item: any) {
    this.storage.set('currentRoute',item).then(()=>{
      if (this.isFromLiveTracking){
        this.navCtrl.pop();
      }else {
        this.navCtrl.setRoot('MenuPage');
      }
    })
  }
}
