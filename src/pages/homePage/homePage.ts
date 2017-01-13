import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Splashscreen, NativeStorage } from 'ionic-native';
import { LoginPage, ShareDealPage, DealsPage } from '../pages';

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
    let self = this;
    NativeStorage.getItem('twitter_user')
      .then(function (data) {
        self.connected = true;
        Splashscreen.hide();
      }, function (error) {
        self.connected = false;
        Splashscreen.hide();
      });
  }

  newShare() {
    this.navCtrl.push(ShareDealPage);
  }

  launchSearch() {
  }
}
