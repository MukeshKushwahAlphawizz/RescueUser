import {Component, NgZone} from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ViewChild, ElementRef } from '@angular/core';
import {App} from "ionic-angular/index";
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";
import {Geolocation} from "@ionic-native/geolocation";
declare var google;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  source: any = '';
  destination: any = '';
  service = new google.maps.places.AutocompleteService();
  autocompleteItemsSearch: any = [];
  autocompleteItemsSearchDrop: any = [];
  sourceLatLng: any = {};
  destinationLatLng: any = {};
  userData: any = {};
  sourceLat: any = {};
  sourceLng: any = {};
  destinationLat: any = {};
  destinationLng: any = {};
  showTruckBox: boolean = false;
  selectedItem: any = {};
  vehicleList : any = [];
  bookingId : any = '';
  nearbyDrivers:any=[];
  markers: any[] = [];
  mapEventTimeout: any;
  myuserdate: any;

  constructor(public viewCtrl: ViewController,
              public navCtrl: NavController,
              public user: User,
              public geolocation:Geolocation,
              public util: UtilProvider,
              public app: App,
              public storage: Storage,
              public zone: NgZone,
              public navParams: NavParams) {
  }
  ionViewDidLoad() {
    this.storage.set('currentRoute',null);
    this.getUserData();
    this.loadMap();
  }
  request() {
    if (this.source.trim() === ''){
      this.util.presentToast('Please select Pickup Location');
      return;
    }
    if (this.destination.trim() === ''){
      this.util.presentToast('Please select Drop Location');
      return;
    }
    this.util.presentLoader();
    if(this.userData){
      this.myuserdate =this.userData.id;
    }else{
      this.myuserdate ='';
    }
    let data = {
      "user_id":this.myuserdate,
      "pick_location":this.source,
      "pick_latitude":this.sourceLat,
      "pick_longitude":this.sourceLng,
      "drop_location":this.destination,
      "drop_latitude":this.destinationLat,
      "drop_longitude":this.destinationLng
    }
    this.user.sendpickupRequest(data).subscribe(res=>{
      let resp : any = res;
      // console.log(res);
      if (resp.status){
        this.bookingId = resp.data.id;
        this.vehicleList = resp.data.vehicle_category;
        if (this.vehicleList.length && this.vehicleList.length>0){
          this.showTruckBox = true
        }else {
          this.util.presentAlert('','No Drivers are available.');
          this.showTruckBox=false;
        }
      }
      setTimeout(()=>{
        this.util.dismissLoader();
      },500);
    },error => {
      console.error(error);
      this.util.dismissLoader();
    })
    // this.navCtrl.setRoot('TowListPage')
  }
  notification() {
    this.navCtrl.push('NotificationsPage')
  }
  selectTruck(item: any) {
    this.vehicleList.filter(vehicle=>{
      if (vehicle.id === item.id){
        vehicle.isSelect = true;
        this.selectedItem = item;
      }else {
        vehicle.isSelect = false;
      }
    })
  }
  confirm() {
    if (this.selectedItem.id){
      if(this.userData){
        this.myuserdate =this.userData.id;
      }else{
        this.myuserdate ='';
      }
      let data = {
        user_id:this.myuserdate,
        // user_id:this.userData.id,
        vehicle_type:this.selectedItem.id,
        booking_id:this.bookingId,
        pick_date:"",
        pick_time:"",
      }
      this.showTruckBox=false;
      this.navCtrl.push('FillDetailsPage',{requestData : data,source:this.source, destination:this.destination});
    }else {
      this.util.presentToast('Please select any one Available Driver');
    }
  }
  getUserData() {
    this.storage.get('userData').then(userData=>{
      this.userData = JSON.parse(userData);
    })
  }
  onChangeLocation(event) {
    if (event == '') {
      this.autocompleteItemsSearch = [];
      return;
    }
    const me = this;
    this.service.getPlacePredictions({ input: event }, function (predictions, status) {
      me.autocompleteItemsSearch = [];
      me.zone.run(function () {
        if (predictions) {
          predictions.forEach(function (prediction) {
            me.autocompleteItemsSearch.push(prediction);
          });
        }
      });
    });
  }
  onChangeLocationDrop(event) {
    if (event == '') {
      this.autocompleteItemsSearchDrop = [];
      return;
    }
    const me = this;
    this.service.getPlacePredictions({ input: event }, function (predictions, status) {
      me.autocompleteItemsSearchDrop = [];
      me.zone.run(function () {
        if (predictions) {
          predictions.forEach(function (prediction) {
            me.autocompleteItemsSearchDrop.push(prediction);
          });
        }
      });
    });
  }
  chooseItemSource(sourceData: any) {
    this.source = sourceData.description;
    this.autocompleteItemsSearch = [];
    let geocoder = new google.maps.Geocoder;
    this.util.geocodeAddress(geocoder,this.source).then(result=>{
      this.sourceLatLng = result;
      this.sourceLat = this.sourceLatLng.lat;
      this.sourceLng = this.sourceLatLng.lng;
    }).catch(err=>{
    });
  }
  chooseItemSourceDrop(sourceData: any) {
    this.destination = sourceData.description;
    this.autocompleteItemsSearchDrop = [];
    let geocoder = new google.maps.Geocoder;
    this.util.geocodeAddress(geocoder,this.destination).then(result=>{
      this.destinationLatLng = result;
      this.destinationLat = this.destinationLatLng.lat;
      this.destinationLng = this.destinationLatLng.lng;
    }).catch(err=>{
    });
  }


  // Adds a marker to the map and push to the array.
  addMarker(location) {
    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: 'assets/img/truck-map.png'
    });
    this.markers.push(marker);
  }

// Sets the map on all markers in the array.
  setMapOnAll(map: any) {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

// Removes the markers from the map, but keeps them in the array.
  clearMarkers() {
    this.setMapOnAll(null);
  }

// Shows any markers currently in the array.
  showMarkers() {
    this.setMapOnAll(this.map);
  }

// Deletes all markers in the array by removing references to them.
  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
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
    this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then((resp) => {
      // console.log('lat >>',resp.coords.latitude,'lng >>',resp.coords.longitude);
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      this.addNewMarker(latLng);
    }).catch(err=>{
      console.log('google map error :',err);
    });

    this.map.addListener("center_changed", () => {
      // 3 seconds after the center of the map has changed, pan back to the
      // marker.
      if (this.mapEventTimeout){
        clearTimeout(this.mapEventTimeout);
      }
      this.mapEventTimeout = setTimeout(() => {
        let lat = this.map.getCenter().lat();
        let lng = this.map.getCenter().lng();
        // console.log('map center changed !!!',lat,lng);
        if (this.userData && this.userData.id){
          let data = {
            "user_id":this.userData.id,
            "latitude": lat,
            "longitude": lng
          }
          this.user.getNearbyDriverList(data).subscribe(res=>{
            let resp : any = res;
            if (resp.status){
              this.nearbyDrivers = resp.data;
            }else {
              this.nearbyDrivers = [];
            }
            this.clearMarkers();
            this.nearbyDrivers.map(item=>{
              let latLng = new google.maps.LatLng(item.latitude, item.longitude);
              this.addMarker(latLng);
            })
          })
        }
      }, 500);
    });
  }
  addNewMarker(location) {
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      animation: google.maps.Animation.DROP,
    });
    this.map.setCenter(location);
    // console.log(marker);
    // this.markers.push(marker);
  }
  /*addMarker(){
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
  }*/
}
