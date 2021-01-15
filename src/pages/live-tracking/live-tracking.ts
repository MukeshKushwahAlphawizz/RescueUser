import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewChild, ElementRef } from '@angular/core';
import {App, Events} from "ionic-angular/index";
import {Storage} from "@ionic/storage";
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {FirebaseProvider} from "../../providers/firebase/firebase";
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
  routeDetail:any={}
  driver_id:any={}
  booking_id:any={}
  currentRoute:any={}
  userData:any={}
  interval: any;

  constructor(public navCtrl: NavController,
              public app: App,
              public util:UtilProvider,
              public user : User,
              public events : Events,
              public firedb: FirebaseProvider,
              public storage: Storage,
              public navParams: NavParams) {
    this.events.subscribe('tripEnded',data=>{
      if (this.interval){
        clearInterval(this.interval);
      }
    })
    this.events.subscribe('tripStarted',data=>{
      console.log('Trip started >> data is >>',JSON.stringify(data));
      this.driver_id = JSON.parse(data.booking_info).driver_id;
      if (this.interval){
        clearInterval(this.interval);
      }
      this.interval = setInterval(()=>{
        this.getDriverLatLng();
      },5000)
    })
  }
  ionViewDidEnter(){
    this.getUserData();
    this.storage.get('currentRoute').then(currentRoute=>{
      console.log('currentRoute>>>>>',currentRoute);
      this.currentRoute = currentRoute;
      if (currentRoute && currentRoute.types_id){
        this.booking_id = currentRoute.types_id;
        this.getRouteDetail(this.booking_id);
      }else {
        this.loadMap();
      }
    })
  }
  ionViewDidLeave(){
    clearInterval(this.interval);
  }
  ngOnDestroy(){
    clearInterval(this.interval);
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
    let driverData = {
      date_of_join:new Date().getTime(),
      id:this.currentRoute.driver_id+'_D',
      image:this.currentRoute.driver_image,
      isDriver:true,
      name:this.currentRoute.driver_name,
    }
    this.firedb.addUser(driverData,this.userData.id+'_C');
    let chatRef = this.userData.id+'_C'+'-'+driverData.id;
    this.navCtrl.push("ChatPage",{chatRef:chatRef,driver:driverData,customer:this.userData});
  }
  payment() {
    let paymentData : any = {
      amount:this.routeDetail.amount,
      booking_id:this.booking_id
    }
    // console.log(paymentData);
    this.navCtrl.push('PaymentPage',{paymentData:paymentData})
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
        this.routeDetail = resp.data;
        this.calculateAndDisplayRoute(resp.data.pick_location,resp.data.drop_location,this.routeDetail);
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
        strokeColor: '#f27120'
      },
      suppressMarkers: true
    });
  }

  call(mobile: any) {
    if (mobile && mobile !==''){
    }else {
      this.util.presentToast('Driver Mobile number is not available');
    }
  }

  getDriverLatLng() {
    // console.log('this.driver_id',this.driver_id);
    let data = {
      driver_id:this.driver_id
    }
    this.user.getDriverLatLng(data).subscribe(res=>{
      let resp : any = res;
      if (resp.status){
        this.routeDetail.drop_latitude = resp.data.latitude;
        this.routeDetail.drop_longitude = resp.data.longitude;
        let to = new google.maps.LatLng(this.routeDetail.pick_latitude, this.routeDetail.pick_longitude);
        let from = new google.maps.LatLng(this.routeDetail.drop_latitude, this.routeDetail.drop_longitude);
        this.calculateAndDisplayRoute(to,from,this.routeDetail);
      }
    },error => {})
  }

  getUserData() {
    this.storage.get('userData').then(userData=>{
      this.userData = JSON.parse(userData);
    })
  }
}
