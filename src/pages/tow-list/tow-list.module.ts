import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TowListPage } from './tow-list';

@NgModule({
  declarations: [
    TowListPage,
  ],
  imports: [
    IonicPageModule.forChild(TowListPage),
  ],
})
export class TowListPageModule {}
