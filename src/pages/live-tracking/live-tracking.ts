import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewChild, ElementRef } from '@angular/core';
import {App} from "ionic-angular/index";
import {Storage} from "@ionic/storage";
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
declare var google;

@IonicPage()
@Component({
  selector: 'page-live-tracking',
  templateUrl: 'live-tracking.html',
})

export class LiveTrackingPage {

  @ViewChild('map') mapElement: ElementRef;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  map: any;

  lat1:any='';
  long1:any='';
  lat2:any='';
  long2:any='';

  constructor(public navCtrl: NavController,
              public app: App,
              public util:UtilProvider,
              public user : User,
              public storage: Storage,
              public navParams: NavParams) {
  }
  ionViewDidEnter(){
    this.storage.get('currentRoute').then(currentRoute=>{
      if (currentRoute && currentRoute.types_id){
        this.getRouteDetail(currentRoute.types_id);
      }else {
        this.loadMap();
      }
    })
  }

  ionViewDidLoad() {

  }

  addMarker(){
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
  }
  chat() {
    this.navCtrl.push('ChatPage')
  }
  payment() {
    this.navCtrl.push('PaymentPage')
  }
  notification() {
    this.navCtrl.push('NotificationsPage',{fromLiveTracking:true})
  }

  getRouteDetail(id) {
    this.util.presentLoader('');
    let data = {
      booking_id:id
    }
    this.user.getRouteDetail(data).subscribe(res=>{
      let resp :any = res;
      if (resp.status){
        this.calculateAndDisplayRoute(resp.data.pick_location,resp.data.drop_location,resp.data);
      }
      setTimeout(()=>{
        this.util.dismissLoader();
      },500);
    },error => {
      console.error(error);
      this.util.dismissLoader();
    })
  }

  calculateAndDisplayRoute(from, to, allData:any) {
    const that = this;
    this.directionsService.route({
      origin:from,
      destination:to,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        this.lat1=allData.pick_latitude;
        this.long1=allData.pick_longitude;
        this.lat2=allData.drop_latitude;
        this.long2=allData.drop_longitude;
        that.directionsDisplay.setDirections(response);
        this.loadMap();
      } else {
        // window.alert('Directions request failed due to ' + status);
      }
    });
  }
  loadMap(){
    let mapOptions = {
      zoom: 7,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    let startMarker = new google.maps.Marker({ position: {
        lat:parseFloat(this.lat1),
        lng:parseFloat(this.long1)
      }, map: this.map, icon: 'assets/img/truck-map.png' });

    startMarker = new google.maps.Marker({position: {
        lat:parseFloat(this.lat2),
        lng:parseFloat(this.long2)
      }, map: this.map, icon: 'assets/img/green-dot.png' });

    this.directionsDisplay.setMap(this.map,startMarker);
    this.directionsDisplay.setOptions({
      polylineOptions: {
        strokeColor: '#752264'
      },
      suppressMarkers: true
    });
    // this.addMarker()
  }
  ngOnDestroy(){
    this.storage.set('currentRoute',null);
  }
}
