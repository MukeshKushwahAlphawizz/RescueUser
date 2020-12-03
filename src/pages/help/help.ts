import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {User} from "../../providers";
import {UtilProvider} from "../../providers/util/util";

/**
 * Generated class for the HelpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {
  helpContent: any = '';
  constructor(public navCtrl: NavController,
              public util : UtilProvider,
              public user : User,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.getHelp()
  }
  notification() {
    this.navCtrl.push('NotificationsPage')
  }
  getHelp(){
    this.util.presentLoader();
    let data = {
      page_title:'help'
    }
    this.user.getContent(data).subscribe(res=>{
      let resp : any = res;
      this.util.presentToast(resp.message);
      setTimeout(()=>{
        this.util.dismissLoader();
      },500)
      if (resp.status){
        this.helpContent = resp.data[0].description
      }
    },error => {
      console.log(error);
      this.util.dismissLoader();
    })
  }
}
