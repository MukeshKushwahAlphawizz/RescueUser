import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Content} from "ionic-angular/index";
import {UtilProvider} from "../../providers/util/util";
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {Storage} from "@ionic/storage";


@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild(Content) content: Content;

  chatRef:any={}
  chats: any[] = [];
  isListEmpty: boolean = false;
  msg: any = '';
  driver:any='';
  customer:any='';
  toggled: boolean = false;
  constructor(public navCtrl: NavController,
              public storage:Storage,
              public util:UtilProvider,
              public firedb:FirebaseProvider,
              public navParams: NavParams) {
    this.chatRef = navParams.data.chatRef;
    // console.log('check chat ref >>>',this.chatRef);
    this.customer = navParams.data.customer;
    this.driver = navParams.data.driver;
  }

  ionViewDidLoad() {
    this.getAllChats();
  }

  notification() {
    this.navCtrl.push('NotificationsPage')
  }

  getAllChats() {
    this.util.presentLoader();
    this.firedb.getAllUserChats(this.chatRef).subscribe(data=>{
      if (data && data.length){
        this.chats = data;
      }
      this.chats.length && this.chats.length>0?this.isListEmpty=false:this.isListEmpty=true;
      setTimeout(()=>{
        this.scrollBottom();
        this.util.dismissLoader();
      },500);
    });
  }

  sendMessage() {
    if (this.msg.trim() ===''){
      return;
    }
    let message = {
      message:this.msg.trim(),
      date:new Date().getTime(),
      isDriver:false,
      isRead:false
    }
    this.firedb.addMessage(message,this.chatRef).then(res=>{
      this.msg = '';
      this.scrollBottom();
      let customer = {
        date_of_join:new Date().getTime(),
        id:this.customer.id+'_C',
        image:this.customer.image,
        isDriver:false,
        name:this.customer.first_name+' '+this.customer.last_name
      }
      //adding a customer user into driver
      this.firedb.addUser(customer,this.driver.id);
    }).catch(err=>{})
  }

  handleSelection(event) {
    this.msg += event.char;
  }

  scrollBottom(){
    if (this.content){
      setTimeout(()=>{
        this.content.scrollToBottom();
      },200)
    }
  }
}
