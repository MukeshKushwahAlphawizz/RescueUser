import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompletePaymentPage } from './complete-payment';

@NgModule({
  declarations: [
    CompletePaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(CompletePaymentPage),
  ],
})
export class CompletePaymentPageModule {}
