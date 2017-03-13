import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { DealDataService } from '../../services/services';
import { DealModel } from '../../services/models';
import { DealList } from '../../components/deal-list/deal-list';

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html'
})
export class FavoritesPage {
  public deals: Array<DealModel>;

  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public dealDataService: DealDataService) {
  }

  ionViewWillEnter() {
    let loader = this.loadingCtrl.create({
      content: "Please wait while fetching deals..."
    });
    loader.present();
    this.dealDataService.getUserFavorites().then(result => {
      this.deals = result;
      loader.dismiss();
    });
  }
}
