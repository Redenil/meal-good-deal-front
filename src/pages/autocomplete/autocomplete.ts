import { Component, NgZone } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { PlaceModel } from '../../services/models';

@Component({
  templateUrl: 'autocomplete.html'
})

export class AutocompletePage {
  autocompleteItems;
  autocomplete;
  service: google.maps.places.AutocompleteService;

  constructor(public viewCtrl: ViewController, private zone: NgZone) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
    this.service = new google.maps.places.AutocompleteService();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  chooseItem(item: any) {
    let place = new PlaceModel();
    this.viewCtrl.dismiss(item);
  }

  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;
    this.service.getPlacePredictions({
      input: this.autocomplete.query,
      componentRestrictions: {
        country: 'FR'
      }
      // types: ['food']
    }, function (predictions, status) {
      me.autocompleteItems = [];
      me.zone.run(function () {
        predictions.forEach(function (prediction) {
          me.autocompleteItems.push(prediction.description);
        });
      });
    });
  }
}
