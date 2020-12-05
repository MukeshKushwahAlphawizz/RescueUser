import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";
import {App} from "ionic-angular/index";
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';

declare var Stripe;
declare var paypal: any;
@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
  testKey = 'pk_test_51HU6ieLh9b4PD8QRemTXIzp5TidbPqNcz2E0yG9V53HVoehsrgdrT76tvta2j5uXtzqVE3KHaWdvyDRmRW56aLM700Igbn2w1a'
  stripe = Stripe(this.testKey);
  card: any;
  paymentAmount: any = '28';
  /*payPalConfig = {
    env: 'sandbox',
    client: {
      sandbox: 'AWtxst4d1DsZBHTSYyuy9tC2Kv2qzEDQdZMNeQhlOzrq4iqwHD09_iIjPpF3QNtlqMMOxOGruNtD3kQz',
    },
    commit: false,
    payment: (data, actions) => {
      console.log("data is", data, actions);
      return actions.payment.create({
        payment: {
          transactions: [
            { amount: { total: this.paymentAmount, currency: 'INR' } }
          ]
        }
      });
    }
  }*/
  isPaypal: boolean = false;
  userData: any = '';
  bookingId: any = '';
  amount: any = '';

  constructor(public navCtrl: NavController,
              public user: User,
              public util: UtilProvider,
              public app: App,
              private payPal: PayPal,
              public storage: Storage,
              public navParams: NavParams) {
    this.bookingId = navParams.data.paymentData?navParams.data.paymentData.booking_id:'';
    this.amount = navParams.data.paymentData?navParams.data.paymentData.amount:'';
  }

  ionViewDidLoad() {
    this.setupStripePaypal();
    this.getUserData();
  }
  getUserData() {
    this.storage.get('userData').then(data=>{
      this.userData = JSON.parse(data);
    })
  }

  paypal() {
    this.isPaypal = true;
    this.payPal.init({
      PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
      PayPalEnvironmentSandbox: 'AWtxst4d1DsZBHTSYyuy9tC2Kv2qzEDQdZMNeQhlOzrq4iqwHD09_iIjPpF3QNtlqMMOxOGruNtD3kQz'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment('3.33', 'USD', 'Description', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((suu) => {
          console.log('PayPal payment success >>>',suu);
          // Successfully paid

          // Example sandbox response
          //
          // {
          //   "client": {
          //     "environment": "sandbox",
          //     "product_name": "PayPal iOS SDK",
          //     "paypal_sdk_version": "2.16.0",
          //     "platform": "iOS"
          //   },
          //   "response_type": "payment",
          //   "response": {
          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
          //     "state": "approved",
          //     "create_time": "2016-10-03T13:33:33Z",
          //     "intent": "sale"
          //   }
          // }
        }, () => {
          // Error or render dialog closed without being successful
        });
      }, () => {
        // Error in configuration
      });
    }, () => {
      // Error in initialization, maybe PayPal isn't supported or something else
    });
  }

  cardPay() {
    this.isPaypal = false;
  }

  payNow() {
  }

  setupStripePaypal(){
    // paypal.Buttons(this.payPalConfig).render('#paypal-button');
    let elements = this.stripe.elements();
    var style = {
      base: {
        color: '#32325d',
        lineHeight: '24px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    this.card = elements.create('card', { style: style });

    this.card.mount('#card-element');

    this.card.addEventListener('change', event => {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    var form = document.getElementById('payment-form');
    form.addEventListener('submit', event => {
      event.preventDefault();
      this.util.presentLoader('');
      this.stripe.createToken(this.card).then(result=>{
        console.log('token >>>',JSON.stringify(result));
        let data : any = result;
        let last4 = data.token.card.last4;
        let cardName = data.token.card.brand;
        this.stripPay(data.token.id,last4,cardName,"stripe");
      }).catch(err=>{
        console.error(err);
        this.util.dismissLoader();
      })
    });
  }

  stripPay(token,last4,cardName,method) {
    let data = {
      "user_id":this.userData.id,
      "booking_id":this.bookingId,
      "card_holder_name":"",
      "amount":this.amount,
      "token":token,
      "payment_type":method
    }
    this.user.paymentBooking(data).subscribe(res=>{
      let resp : any = res;
      this.util.presentToast(resp.message);
      if (resp.status){
        this.util.presentAlert('Payment Status',resp.message);
        this.storage.set('currentRoute',null).then(()=>{
          // this.navCtrl.popToRoot();
          this.app.getRootNav().setRoot('MenuPage');
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
}
