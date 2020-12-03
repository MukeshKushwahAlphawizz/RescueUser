import {Component, NgZone} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActionSheetController} from "ionic-angular/index";

declare var google;
@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  userData: any = '';
  signUpForm: FormGroup;
  error_messages: any = {};
  lat: any = '';
  lng: any = '';
  profileImg: any = '';
  profileImgToShow: any = '';
  service = new google.maps.places.AutocompleteService();
  autocompleteItemsSearch: any = [];
  source: string = '';
  sourceLatLng: any = {};
  constructor(public navCtrl: NavController,
              public storage : Storage,
              public util : UtilProvider,
              public user : User,
              public zone: NgZone,
              public actionSheetCtrl:ActionSheetController,
              public formBuilder: FormBuilder,
              public navParams: NavParams) {
    this.setupEditForm();
  }

  ionViewDidLoad() {
    this.getUserData()
  }
  notification() {
    this.navCtrl.push('NotificationsPage');
  }

  getUserData() {
    this.storage.get('userData').then(userData=>{
      this.userData = JSON.parse(userData);
      this.signUpForm.controls.firstName.setValue(this.userData.first_name);
      this.signUpForm.controls.lastName.setValue(this.userData.last_name);
      this.signUpForm.controls.address.setValue(this.userData.address);
      this.signUpForm.controls.vehicleNumber.setValue(this.userData.vehicle_number);
      this.signUpForm.controls.carName.setValue(this.userData.car_name);
      this.signUpForm.controls.modelNumber.setValue(this.userData.model_no);
      this.signUpForm.controls.weight.setValue(this.userData.weight);
      this.lat = this.userData.lat;
      this.lng = this.userData.lang;
      this.profileImgToShow = this.userData.image;
    })
  }

  deleteAccount() {
    this.util.presentConfirm('Are you sure?','You want to delete your account').then(()=>{
      this.util.presentLoader();
      let data = {
        user_type:1,
        profile_id:this.userData.id
      }
      this.user.deleteAccount(data).subscribe(res=>{
        let resp : any = res;
        this.util.presentToast(resp.message);
        setTimeout(()=>{
          this.util.dismissLoader();
        },500)
        if (resp.status){
          this.storage.set('userData',null);
          this.navCtrl.setRoot('LoginPage');
        }
      },error => {
        console.log(error);
        this.util.dismissLoader();
      })
    }).catch(()=>{
    })
  }

  save() {
    this.util.presentLoader();
    let formData = new FormData();
    formData.append('user_type','1');
    formData.append('profile_id',this.userData.id);
    formData.append('firstname',this.signUpForm.value.firstName);
    formData.append('lastname',this.signUpForm.value.lastName);
    formData.append('lat',this.lat);
    formData.append('lang',this.lng);
    formData.append('vehiclenumber',this.signUpForm.value.vehicleNumber);
    formData.append('carname',this.signUpForm.value.carName);
    formData.append('model_no',this.signUpForm.value.modelNumber);
    formData.append('weight',this.signUpForm.value.weight);
    formData.append('user_image',this.profileImg);

    this.user.editProfile(formData).subscribe(res=>{
      let resp : any = res;
      this.util.presentAlert('',resp.message);
      if (resp.status){
        this.storage.set('userData',JSON.stringify(resp.data)).then(()=>{
          this.navCtrl.pop();
        });
      }
      setTimeout(()=>{
        this.util.dismissLoader();
      },500)
    },error => {
      console.log(error);
      this.util.dismissLoader();
    })
  }

  setupEditForm() {
    this.error_messages = {
      firstName: [
        { type: "required", message: 'First Name is required' },
      ],
      lastName: [
        { type: "required", message: 'Last Name is required' },
      ],
      address: [
        { type: "required", message: 'Address is required' },
      ],
      vehicleNumber: [
        { type: "required", message: 'Vehicle Number is required' },
      ],
      carName: [
        { type: "required", message: 'Car Name is required' },
      ],
      modelNumber: [
        { type: "required", message: 'Model Number is required' },
      ],
      weight: [
        { type: "required", message: 'Weight is required' },
      ]
    };
    this.signUpForm = this.formBuilder.group(
      {
        firstName: new FormControl(
          "",
          Validators.compose([
            Validators.required,
          ])
        ),
        lastName: new FormControl(
          "",
          Validators.compose([
            Validators.required,
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
        ),
        carName: new FormControl(
          "",
          Validators.compose([Validators.required,
          ])
        ),
        modelNumber: new FormControl(
          "",
          Validators.compose([Validators.required,
          ])
        ),
        weight: new FormControl(
          "",
          Validators.compose([Validators.required,
          ])
        ),
      },
    );
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
      console.log(this.sourceLatLng);
      this.lat = this.sourceLatLng.lat;
      this.lng = this.sourceLatLng.lng;
    }).catch(err=>{
    });
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
}
