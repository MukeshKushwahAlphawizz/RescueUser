import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LiveTrackingPage } from './live-tracking';

@NgModule({
  declarations: [
    LiveTrackingPage,
  ],
  imports: [
    IonicPageModule.forChild(LiveTrackingPage),
  ],
})
export class LiveTrackingPageModule {}
