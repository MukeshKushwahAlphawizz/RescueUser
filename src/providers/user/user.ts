import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';

@Injectable()
export class User {

  register : string = 'Authentication/UserRegistration';
  loginUrl : string = 'Authentication/login';
  changePasswordUrl : string = 'Authentication/changePassword';
  getBookingUrl : string = 'Authentication/getBooking';
  bookingAcceptRejectUrl : string = 'Authentication/bookingAcceptReject';
  forgetPasswordUrl : string = 'Authentication/ForgetPassword';
  getBookingRouteByIdUrl : string = 'Authentication/getBookingRouteById';
  getBookingbyuseridUrl : string = 'Authentication/getBookingbyuserid';
  editProfileUser : string = 'Authentication/editProfileUser';
  deleteAccountUrl : string = 'Authentication/DeleteAccount';
  getContentUrl : string = 'Authentication/getcontent';
  send_pickup_location : string = 'Users/send_pickup_location';

  booking_request : string = 'Users/booking_request';
  booking_request_confirm : string = 'Users/booking_request_confirm';
  update_user_lat_lang : string = 'Users/update_user_lat_lang';
  get_notification_list : string = 'Users/get_notification_list';
  clear_notification : string = 'Users/clear_notification';
  payment_booking : string = 'Users/payment_booking';
  enter_vehicle_no_verify : string = 'Authentication/enter_vehicle_no_verify';
  get_route_details : string = 'Drivers/get_route_details';
  my_history : string = 'Users/my_history';
  driver_current_status : string = 'Users/driver_current_status';

  constructor(public api: Api) { }

  login(data: any) {
    let res = this.api.post(this.loginUrl, data).share();
    return res;
  }
  signup(data: any) {
    let res = this.api.post(this.register, data).share();
    return res;
  }
  changePassword(data: any) {
    let res = this.api.post(this.changePasswordUrl, data).share();
    return res;
  }
  getBooking(data: any) {
    let res = this.api.post(this.getBookingUrl, data).share();
    return res;
  }
  bookingAcceptReject(data: any) {
    let res = this.api.post(this.bookingAcceptRejectUrl, data).share();
    return res;
  }
  forgetPassword(data: any) {
    let res = this.api.post(this.forgetPasswordUrl, data).share();
    return res;
  }
  getBookingRouteById(data: any) {
    let res = this.api.post(this.getBookingRouteByIdUrl, data).share();
    return res;
  }
  getBookingbyuserid(data: any) {
    let res = this.api.post(this.getBookingbyuseridUrl, data).share();
    return res;
  }
  deleteAccount(data: any) {
    let res = this.api.post(this.deleteAccountUrl, data).share();
    return res;
  }
  editProfile(data: any) {
    let res = this.api.post(this.editProfileUser, data).share();
    return res;
  }

  getContent(data: any) {
    let res = this.api.post(this.getContentUrl, data).share();
    return res;
  }
  sendpickupRequest (data: any) {
    let res = this.api.post(this.send_pickup_location, data).share();
    return res;
  }
  bookingRequest (data: any) {
    let res = this.api.post(this.booking_request, data).share();
    return res;
  }
  bookingRequestConfirm (data: any) {
    let res = this.api.post(this.booking_request_confirm, data).share();
    return res;
  }
  updateUserLatLang (data: any) {
    let res = this.api.post(this.update_user_lat_lang, data).share();
    return res;
  }
  getAllNotifications (data: any) {
    let res = this.api.post(this.get_notification_list, data).share();
    return res;
  }
  clearNotification (data: any) {
    let res = this.api.post(this.clear_notification, data).share();
    return res;
  }
  paymentBooking (data: any) {
    let res = this.api.post(this.payment_booking, data).share();
    return res;
  }

  getAllNotificationList(data: any) {
    let res = this.api.post(this.get_notification_list, data).share();
    return res;
  }
  checkVehicle(data: any) {
    let res = this.api.post(this.enter_vehicle_no_verify, data).share();
    return res;
  }
  getRouteDetail(data: any) {
    let res = this.api.post(this.get_route_details, data).share();
    return res;
  }
  getHistory(data: any) {
    let res = this.api.post(this.my_history, data).share();
    return res;
  }
  getDriverLatLng(data: any) {
    let res = this.api.post(this.driver_current_status, data).share();
    return res;
  }
}
