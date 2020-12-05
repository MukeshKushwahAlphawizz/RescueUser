import {Component, NgZone} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActionSheetController} from "ionic-angular/index";
declare var google;
@IonicPage()
@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details.html',
})
export class UserDetailsPage {
  service = new google.maps.places.AutocompleteService();
  autocompleteItemsSearch: any = [];
  source: string = '';
  sourceLatLng: any = {};
  requestData:any = {
    email : '',
    password : '',
    fcm_token : '',
  }
  signUpForm: FormGroup;
  error_messages: any = {};

  lat: any = '';
  lng: any = '';
  profileImg: any = '';
  profileImgToShow: any = '';
  vehicleData: any = '';

  constructor(public navCtrl: NavController,
              public util:UtilProvider,
              public user : User,
              public zone: NgZone,
              public formBuilder: FormBuilder,
              public storage : Storage,
              public actionSheetCtrl:ActionSheetController,
              public navParams: NavParams) {
    this.requestData = navParams.data.requestData;
    this.setupSignUpForm();
  }
  setupSignUpForm() {
    this.error_messages = {
      firstName: [
        { type: "required", message: 'First Name is required' },
        { type: "pattern", message: '*Enter valid name' },
      ],
      lastName: [
        { type: "required", message: 'Last Name is required' },
        { type: "pattern", message: '*Enter valid name' },
      ],
      mobileNumber: [
        { type: "required", message: 'Mobile Number is required' },
        { type: "minlength", message: '*Minimum length should be 8' },
        { type: "maxlength", message: '*Maximum length should be 12' }
      ],
      address: [
        { type: "required", message: 'Address Number is required' },
      ],
      vehicleNumber: [
        { type: "required", message: 'Vehicle Number is required' },
      ]
    };
    this.signUpForm = this.formBuilder.group(
      {
        firstName: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern('[a-zA-Z ]*')
          ])
        ),
        lastName: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern('[a-zA-Z ]*')
          ])
        ),
        mobileNumber: new FormControl(
          "",
          Validators.compose([Validators.required,
            Validators.minLength(10),
            Validators.maxLength(12)
          ])
        ),
        address: new FormControl(
          "",
          Validators.compose([Validators.required,
          ])
        ),
        vehicleNumber: new FormControl(
          "",
          Validators.compose([Validators.required,
          ])
        )
      },
    );
  }

  ionViewDidLoad() {

  }

  confirm() {
    this.util.presentLoader('');
    let formData = new FormData();
    formData.append('email',this.requestData.email);
    formData.append('password',this.requestData.password);
    formData.append('fcm_token',this.requestData.fcm_token);
    formData.append('address',this.signUpForm.value.address);
    formData.append('phone_number',this.signUpForm.value.mobileNumber);
    formData.append('firstname',this.signUpForm.value.firstName);
    formData.append('lastname',this.signUpForm.value.lastName);
    formData.append('lat',this.lat);
    formData.append('lang',this.lng);
    formData.append('vehiclenumber',this.signUpForm.value.vehicleNumber);
    formData.append('user_image',this.profileImg);

    this.user.signup(formData).subscribe(res=>{
      let resp :any = res;
      this.util.presentAlert('',resp.message);
      if (resp.status){
        this.storage.set('userData',JSON.stringify(resp.data)).then(()=>{
          this.navCtrl.setRoot('MenuPage');
        });
      }
      setTimeout(()=>{
        this.util.dismissLoader();
      },500);
    },error => {
      console.error(error);
      this.util.dismissLoader();
    })
  }

  openPicker() {
    let select = 'Choose or take a picture';
    let takePicture = 'Take a picture';
    let choosePicture = 'Choose picture';
    let actionSheet = this.actionSheetCtrl.create({
      title: select,
      buttons: [
        {
          text: takePicture,
          handler: () => {
            this.util.takePicture().then(data => {
              this.profileImg = data;
              this.profileImgToShow = 'data:image/png;base64,' + data;
            });
          }
        },
        {
          text: choosePicture,
          handler: () => {
            this.util.aceesGallery().then(data => {
              this.profileImg = data;
              this.profileImgToShow = 'data:image/png;base64,' + data;
            });
          }
        }
      ]
    });
    actionSheet.present();
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
  chooseItemSource(sourceData: any) {
    this.source = sourceData.description;
    this.signUpForm.controls.address.setValue(this.source);
    this.autocompleteItemsSearch = [];
    let geocoder = new google.maps.Geocoder;
    this.util.geocodeAddress(geocoder,this.source).then(result=>{
      this.sourceLatLng = result;
      this.lat = this.sourceLatLng.lat;
      this.lng = this.sourceLatLng.lng;
    }).catch(err=>{
    });
  }

  verify() {
    if (this.signUpForm.value.vehicleNumber.trim() !==''){
      let data = {
        vehicle_no:this.signUpForm.value.vehicleNumber
      }
      this.util.presentLoader();
      this.user.checkVehicle(data).subscribe(res=>{
        let resp : any = res;
        if (resp.status){
          this.vehicleData = resp.data;
        }else {
          this.vehicleData = '';
          this.util.presentToast(resp.message);
        }
        setTimeout(()=>{
          this.util.dismissLoader();
        },500)
      },error => {
        console.log(error);
        this.util.dismissLoader();
      })
    }
  }
}
