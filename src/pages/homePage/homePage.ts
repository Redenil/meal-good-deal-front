import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { LoginPage, ShareDealPage, DealsPage } from '../pages';

@Component({
  selector: 'page-HomePage',
  templateUrl: 'HomePage.html'
})
export class HomePage {
  public connected: boolean;

  constructor(private navCtrl: NavController,
    private storage: Storage) {
    this.connected = false;
  }

  ionViewWillEnter() {
    let self = this;
    self.storage.get('CurrentUser')
      .then((data) => {
        self.connected = true;
        Splashscreen.hide();
      }).catch((error) => {
        self.connected = false;
        Splashscreen.hide();
      });
  }

  newShare() {
    this.navCtrl.push(ShareDealPage);
  }
}
