import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
// import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { DealDataService } from '../../services/services'
import { DealModel } from '../../services/models'
import { Storage } from '@ionic/storage';


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
    private toastCtrl: ToastController) {
    this.mealDeal = new DealModel();
    this.mealDeal.isTwitterShared = false;
    this.mealDeal.isFacebookShared = false;
    this.storage.get(navParams.data).then((val) => {
      this.mealDeal.fileImage = val;
    });

    let toast = this.toastCtrl.create({
      message: navParams.data,
      duration: 3000
    });
    toast.present();
  }

  ionViewDidLoad() {
  }

  savePlan() {
    this.dealDataService.createDeal(this.mealDeal).then(p => {
      let toast = this.toastCtrl.create({
        message: 'Deal shared',
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
}
