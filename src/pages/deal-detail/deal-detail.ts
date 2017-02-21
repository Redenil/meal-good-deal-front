import { Component, Input, Inject, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, ViewController } from 'ionic-angular';
import { DealDataService } from '../../services/services';
import { DealModel } from '../../services/models';
import { GoogleMap } from "../../components/google-map/google-map";
import { GoogleMapsService } from "../maps/maps.service";
import { Keyboard, Geolocation, CameraPosition, GoogleMapsMarker, GoogleMapsLatLng, GoogleMapsMarkerOptions } from 'ionic-native';
import { PlaceModel } from '../../services/models';
import { MapsModel, MapPlace} from '../maps/maps.model';
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
    var mapCanvas = document.getElementById("map");
    var mapOptions = {
        center: new google.maps.LatLng(this.deal.place.latitude, this.deal.place.longitude),
        zoom: 18
    };
    this.map = new google.maps.Map(mapCanvas, mapOptions);
     
     let ionic: GoogleMapsLatLng = new GoogleMapsLatLng(this.deal.place.latitude, this.deal.place.longitude);
     let position: CameraPosition = {
      target: ionic,
      zoom: 18,
      tilt: 30
    }
    
    let markerOptions: GoogleMapsMarkerOptions = {
   position: ionic,
   title: 'Ionic'
    };

    var marker = new google.maps.Marker({

      position: ionic,
      map: this.map,
      icon: '../assets/icon/pin.min.png',
      title: 'Chouf m3ah'
      
    });
    

  }

  
   
  
}
