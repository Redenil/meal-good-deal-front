import { Component, Input, Inject, Pipe, PipeTransform } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DealDataService } from '../../services/services'
import { DealModel } from '../../services/models';
import { DealDetailPage } from '../../pages/pages';

@Component({
  selector: 'deal-list',
  templateUrl: 'deal-list.html',
  providers: [DealDataService]
})
export class DealList {
  @Input() deals: Array<DealModel>;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dealDataService: DealDataService) {
  }

  showDealDetail(deal) {
    this.navCtrl.push(DealDetailPage, deal);
  }
}