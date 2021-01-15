import { Component, ViewChild } from '@angular/core';
import {Events, IonicPage, Nav,NavParams, NavController, Platform} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {SocialSharing} from "@ionic-native/social-sharing";
import {UtilProvider} from "../../providers/util/util";

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = '';
  userData : any = {};
  constructor(public navCtrl: NavController,
              public platform : Platform,
              public storage : Storage,
              public share : SocialSharing,
              public util : UtilProvider,
              public navParams: NavParams) {
    storage.get('currentRoute').then(currentRoute=>{
      if (currentRoute){
        this.rootPage = 'LiveTrackingPage';
      }else {
        this.rootPage = 'HomePage';
      }
    });
  }

  ionViewDidLoad() {
    this.getUserData();
  }

  openPage(page) {
    this.nav.setRoot(page);
  }
  openHistoryPage(page) {
    this.nav.push(page);
  }
  help() {
    this.navCtrl.push('HelpPage');
  }
  chat_list() {
    this.navCtrl.push('ChatListPage');
  }
  edit_profile() {
    this.navCtrl.push('EditProfilePage');
  }
  openEditProfile() {
    this.navCtrl.push('EditProfilePage');
  }

  exit() {
    this.util.presentConfirm('Are you Sure?','You want to Exit the app.').then(()=>{
      //this.platform.exitApp();
          this.storage.set('userData',null);
          this.navCtrl.setRoot('LoginPage');
    }).catch(()=>{

    })
  }

  shareApp() {
    this.share.share('Rescue Any Car : Check the great app which I am using : ','','','https://play.google.com/store/apps/details?id=com.alpha.rescuecustomer');
    // this.share.share('','','','').then(()=>{}).catch(()=>{});
  }

  openMenu() {
    this.getUserData();
  }

  getUserData() {
    this.storage.get('userData').then(userData=>{
      this.userData = JSON.parse(userData);
      // console.log(this.userData);
    })
  }
}
