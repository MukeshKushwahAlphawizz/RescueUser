import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CancelPaymentPage } from './cancel-payment';

@NgModule({
  declarations: [
    CancelPaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(CancelPaymentPage),
  ],
})
export class CancelPaymentPageModule {}
