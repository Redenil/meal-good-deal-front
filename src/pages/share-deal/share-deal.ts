import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { Ionic2Rating } from 'ionic2-rating';
import { Parse } from 'parse';
import { DealDataService } from '../../services/services'
import { DealModel } from '../../services/models'


@Component({
  selector: 'page-share-deal',
  templateUrl: 'share-deal.html',
  providers: [DealDataService]
})
export class ShareDealPage {
  public planGroup: FormGroup;
  public rate: Number;
  public mealDeal: DealModel;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private dealDataService: DealDataService) {
    this.mealDeal = new DealModel();
  }

  ionViewDidLoad() {
  }

  savePlan() {
    this.dealDataService.createDeal(this.mealDeal).then(p => {
      console.log('save ok' + p);
    });
  }
}
