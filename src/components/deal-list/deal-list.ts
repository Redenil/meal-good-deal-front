import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Parse } from 'parse';

@Component({
  selector: 'deal-list',
  templateUrl: 'deal-list.html'
})
export class DealList {
  public deals = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    Parse.initialize('raouafi23');
    Parse.serverURL = 'http://localhost:1337/parse';
  }

  ngOnInit() {
    var list = [];
    var query = new Parse.Query('MealDeal');
    query.find({
      success: function (results) {
        for (var i = 0; i < results.length; i++) {
          var model = results[i];
          var mealDeal = {
            title: model.get('title'),
            description: model.get('description'),
            location: model.get('location'),
          }
          list.push(mealDeal);
        }
      },

      error: function (error) {
        // error is an instance of Parse.Error.
      }
    });

    this.deals = list;
  }
}
