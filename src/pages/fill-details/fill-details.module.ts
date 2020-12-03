import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FillDetailsPage } from './fill-details';

@NgModule({
  declarations: [
    FillDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(FillDetailsPage),
  ],
})
export class FillDetailsPageModule {}
