import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DealDataService } from '../../services/services'


@Component({
  selector: 'deal-list',
  templateUrl: 'deal-list.html',
  providers: [DealDataService]
})
export class DealList {
  public deals = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dealDataService: DealDataService) {

  }

  ngOnInit() {
    
    // this.dealDataService.getDeals().then(result => { this.deals = result; })
  }
}
