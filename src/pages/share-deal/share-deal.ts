import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { Ionic2Rating } from 'ionic2-rating';
import { Parse } from 'parse';


@Component({
  selector: 'page-share-deal',
  templateUrl: 'share-deal.html'
})
export class ShareDealPage {
  public planGroup: FormGroup;
  public rate: Number;
  public mealDeal: any;
  public title: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder) {
    Parse.initialize('raouafi23');
    Parse.serverURL = 'http://localhost:1337/parse';

    this.mealDeal = new Parse.Object('MealDeal');
  }

  ionViewDidLoad() {
  }

  savePlan() {
    var mealDeal2 = new Parse.Object('MealDeal');

    mealDeal2.set('title', this.mealDeal.title);
    mealDeal2.set('description', this.mealDeal.description);
    mealDeal2.set('location', this.mealDeal.location);
    mealDeal2.set('price', Number(this.mealDeal.price));

    // Save object to DB
    mealDeal2.save().then(
      function (obj) {
        console.log("'New object created with objectId: " + mealDeal2.id);
      },
      function (err) {
        console.log('Failed to create new object, with error code: ' + err.message);
      });
  }
}
