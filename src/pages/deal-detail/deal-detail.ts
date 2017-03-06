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

  constructor(
    public navCtrl: NavController,
    public nav: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public GoogleMapsService: GoogleMapsService,
    public viewCtrl: ViewController,
    public navParams: NavParams
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
  }

}
