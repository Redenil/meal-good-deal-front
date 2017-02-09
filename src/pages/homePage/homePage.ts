import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { LoginPage, DealsPage } from '../pages';

@Component({
  selector: 'page-HomePage',
  templateUrl: 'homePage.html'
})
export class HomePage {
  public connected: boolean;

  constructor(private navCtrl: NavController,
    private storage: Storage) {
  }

  ionViewWillEnter() {
    let self = this;
    self.storage.get('CurrentUser')
      .then((data) => {
        self.connected = true;
        Splashscreen.hide();
      }).catch((error) => {
        self.connected = true;
        Splashscreen.hide();
      });
  }
}
