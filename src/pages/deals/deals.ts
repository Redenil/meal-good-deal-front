import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DealList } from '../../components/deal-list/deal-list';

@Component({
  selector: 'page-deals',
  templateUrl: 'deals.html'
})
export class DealsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad DealsPage');
  }

}
