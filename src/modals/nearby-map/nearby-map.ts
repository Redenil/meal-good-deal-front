import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { DealDataService, MapsDataService } from '../../services/services';
import { Subject } from 'rxjs/Subject';
import { Geolocation } from 'ionic-native';
import { PlaceModel } from '../../services/models'

@Component({
  selector: 'page-nearby-map',
  templateUrl: 'nearby-map.html'
})
export class NearbyMapPage {
  placesService: google.maps.places.PlacesService;
  // choosenPlace = new Subject<any>();
  choosenPlace: PlaceModel;

  markers: Array<google.maps.Marker>;
  infoWindow: google.maps.InfoWindow;
  // observableChoosenPlace = this.choosenPlace.asObservable();
  map: google.maps.Map;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController) {
    this.markers = new Array<google.maps.Marker>()
  }

  ionViewDidLoad() {
    this.initNearBySearch();
    // this.observableChoosenPlace.subscribe((place) => {
    //   this.viewCtrl.dismiss(place);
    // });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  initNearBySearch() {
    Geolocation.getCurrentPosition().then((resp) => {
      var currentLoc = { lat: resp.coords.latitude, lng: resp.coords.longitude };

      this.map = new google.maps.Map(document.getElementById('map'), {
        center: currentLoc,
        zoom: 15
      });
      this.map.setOptions({ center: currentLoc, zoom: 15 });
      this.placesService = new google.maps.places.PlacesService(this.map);

      var service = new google.maps.places.PlacesService(this.map);
      service.nearbySearch({
        location: currentLoc,
        radius: 500,
        types: ['restaurant']
      }, this.onPlacesFound.bind(this));
    });

  }

  onPlacesFound(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        this.markers.push(this.createMarker(results[i]));
      }
    }
  }

  createMarker(place): google.maps.Marker {
    let self = this;
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: self.map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', this.showContent.bind(this, marker, place));
    return marker;
  }

  showContent(marker, place) {
    this.choosenPlace = new PlaceModel();
    this.choosenPlace.name = place.name;
    this.choosenPlace.placeId = place.place_id;
    this.choosenPlace.address = place.vicinity;
    this.choosenPlace.latitude = place.geometry.location.lat();
    this.choosenPlace.longitude = place.geometry.location.lng();

    var contentString = `<div>` +
      `<h2>${this.choosenPlace.name}</h2>` +
      `<div id="bodyContent">` +
      `<p>${this.choosenPlace.address}</p>` +
      `</div>` +
      `</div>`;

    this.infoWindow = new google.maps.InfoWindow({
      content: contentString
    });
    this.infoWindow.open(this.map, marker);
  }

  chooseItem() {
    this.viewCtrl.dismiss(this.choosenPlace);
  }
}
