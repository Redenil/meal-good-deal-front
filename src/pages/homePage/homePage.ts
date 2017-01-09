import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ShareDealPage } from '../share-deal/share-deal';
import { Parse } from 'parse';
import { DealList } from '../../components/deal-list/deal-list';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-HomePage',
  templateUrl: 'HomePage.html'
})
export class HomePage {
  public connected: boolean;
  public inSearch: boolean;

  constructor(private navCtrl: NavController) {
    this.connected = false;
    this.inSearch = false;
  }

  ionViewDidLoad() {
  }

  newShare() {
    this.navCtrl.push(ShareDealPage);
  }

  launchSearch() {
  }
}
