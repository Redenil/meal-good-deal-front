import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
// import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { DealDataService } from '../../services/services'
import { DealModel } from '../../services/models'
import { Storage } from '@ionic/storage';

import { AutocompletePage } from '../autocomplete/autocomplete'


@Component({
  selector: 'page-share-deal',
  templateUrl: 'share-deal.html',
  providers: [DealDataService]
})
export class ShareDealPage {
  public mealDeal: DealModel;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dealDataService: DealDataService,
    private storage: Storage,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController) {
    this.mealDeal = new DealModel();
    this.mealDeal.isTwitterShared = false;
    this.mealDeal.isFacebookShared = false;
    this.mealDeal.location = '';

    this.storage.get(navParams.data).then((val) => {
      this.mealDeal.fileImage = val;
    });
  }

  ionViewDidLoad() {
  }

  savePlan() {
    this.dealDataService.createDeal(this.mealDeal).then(p => {
      let toast = this.toastCtrl.create({
        message: 'Your deal has been shared',
        duration: 3000
      });
      toast.present();
    })
      .catch(p => {
        let toast = this.toastCtrl.create({
          message: p.message,
          duration: 3000
        });
        toast.present();
      });
  }

  showAddressModal() {
    let modal = this.modalCtrl.create(AutocompletePage);
    let self = this;
    modal.onDidDismiss(data => {
      self.mealDeal.location = data;
    });
    modal.present();
  }
}
