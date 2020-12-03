import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ViewChild, ElementRef } from '@angular/core';
import {App} from "ionic-angular/index";
declare var google;

@IonicPage()
@Component({
  selector: 'page-tow-list',
  templateUrl: 'tow-list.html',
})
export class TowListPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  constructor(public viewCtrl: ViewController,
              public navCtrl: NavController,
              public app: App,
              public navParams: NavParams) {
  }
  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap(){
    let latLng = new google.maps.LatLng(-34.9290, 138.6010);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker()
  }
  addMarker(){
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
  }

  openMenuPage() {
    this.app.getActiveNav().push('RestaurentDetailsPage');
  }
  request() {
    this.navCtrl.push('FillDetailsPage')
  }
  notification() {
    this.navCtrl.push('NotificationsPage')
  } 
  // request() {
  //   this.navCtrl.setRoot('MenuPage')
  // }
}
 