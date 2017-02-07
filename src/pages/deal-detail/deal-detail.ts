import { Component, Input, Inject } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DealDataService } from '../../services/services'
import { DealModel } from '../../services/models';


@Component({
  selector: 'deal-detail',
  templateUrl: 'deal-detail.html'
})
export class DealDetailPage {
  deal: DealModel;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dealDataService: DealDataService) {
      this.deal = this.navParams.data;
  }
}
