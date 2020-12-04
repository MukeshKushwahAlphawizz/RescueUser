import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";
declare var Stripe;
declare var paypal: any;
@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
  testKey = 'pk_test_51Hf70NJ84uzHeLyRpzq39V3lEz6Ke4yikebOFypKLDPF28FyzPJFySYm2Hxf3qOgUlGkL6Ho8GeBrr5YFQgqvgvT00eH2zEIjz'
  stripe = Stripe(this.testKey);
  card: any;
  paymentAmount: any = '28';
  payPalConfig = {
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
  }
  isPaypal: boolean = false;
  userData: any = '';

  constructor(public navCtrl: NavController,
              public user: User,
              public util: UtilProvider,
              public storage: Storage,
              public navParams: NavParams) {
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
  }

  cardPay() {
    this.isPaypal = false;
  }

  payNow() {
  }

  setupStripePaypal(){
    paypal.Buttons(this.payPalConfig).render('#paypal-button');
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
        this.stripPay(data.token.id,last4,cardName);
      }).catch(err=>{
        console.error(err);
        this.util.dismissLoader();
      })
    });
  }

  stripPay(token,last4,cardName) {
    /*let formData = new FormData();
    formData.append('token',token);
    formData.append('amount',this.paymentAmount);
    formData.append('user_id',this.userData.id);*/
    let data = {
      "user_id":this.userData.id,
      "booking_id":"1",
      "card_holder_name":"",
      "amount":"516.85",
      "token":token,
      "payment_type":"stripe"
    }

    this.user.paymentBooking(data).subscribe(res=>{
      let resp : any = res;
      this.util.presentToast(resp.message);
      if (resp.status){
        /*this.userData.is_purchased = '1';
        this.storage.set('userData',JSON.stringify(this.userData)).then(()=>{
          this.navCtrl.popToRoot();
          this.navCtrl.push('PaymentSuccessfulPage',{last4:last4,cardName:cardName,
            amount:this.paymentAmount,transactionId:resp.data.transaction_id,receiverName:resp.data.ReceiverName});
        });*/
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
