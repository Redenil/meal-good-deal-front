import { Component, Input, Inject, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, ViewController } from 'ionic-angular';
import { DealDataService } from '../../services/services';
import { DealModel } from '../../services/models';
import { GoogleMap } from "../../components/google-map/google-map";
import { GoogleMapsService } from "../maps/maps.service";
import { Keyboard, Geolocation, CameraPosition, GoogleMapsMarker, GoogleMapsLatLng, GoogleMapsMarkerOptions } from 'ionic-native';
import { PlaceModel } from '../../services/models';
import { MapsModel, MapPlace } from '../maps/maps.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

export interface FavoriteInfo {
  objectId: string;
  isFavorite: boolean;
}
@Component({
  selector: 'deal-detail',
  templateUrl: 'deal-detail.html'
})
export class DealDetailPage {
  deal: DealModel;
  @ViewChild(GoogleMap) _GoogleMap: GoogleMap;
  map_model: MapsModel = new MapsModel();
  choosenPlace: PlaceModel;
  map: any;
  staticMapUrl: string;
  userFavorites: Array<DealModel>;
  isFavorite: boolean;

  constructor(
    public navCtrl: NavController,
    public nav: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public dealService: DealDataService
  ) {
    this.deal = this.navParams.data;
  }

  ngOnInit() {
    let latLon = this.deal.place.latitude + "," + this.deal.place.longitude;
    this.staticMapUrl = "https://maps.googleapis.com/maps/api/staticmap?center=" +
      latLon +
      "&markers=color:blue%7C" +
      latLon +
      "&zoom=14&size=400x400&key=AIzaSyDCAQRH4xvW_uk8g9CY-pjkmZd48BJop28";

    this.dealService.getUserFavorites().then((result) => {
      var anyFavorites = result.filter((item) => {
        return item.id === this.deal.id
      });
      this.isFavorite = anyFavorites.length > 0;
    });
  }

  switchFavorite() {
    this.dealService.switchFavorite(this.deal, !this.isFavorite).then(() => {
      this.isFavorite = !this.isFavorite;
      let toast = this.toastCtrl.create({
        message: this.isFavorite ? "You can now find this deal in your favorites" : "This deal has been deleted from your favorites",
        duration: 3000
      });

      toast.present();
    }).catch(p => {
      let toast = this.toastCtrl.create({
        message: p.message,
        duration: 3000
      });

      toast.present();
    });
  }
}
