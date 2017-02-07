import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController, ActionSheetController, ActionSheet } from 'ionic-angular';
// import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { DealDataService, MapsDataService } from '../../services/services'
import { DealModel } from '../../services/models'
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from 'ionic-native';
import { NearbyMapPage } from '../../modals/modals'

import { AutocompletePage } from '../autocomplete/autocomplete'


@Component({
  selector: 'page-share-deal',
  templateUrl: 'share-deal.html'
})
export class ShareDealPage {
  public mealDeal: DealModel;
  private actionSheet: ActionSheet;
  public locationSearchEnabled: boolean;
  public nearBySearchEnabled: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dealDataService: DealDataService,
    private storage: Storage,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private mapsDataservice: MapsDataService) {
    this.mealDeal = new DealModel();
    this.mealDeal.isTwitterShared = false;
    this.mealDeal.isFacebookShared = false;
    this.mealDeal.location = '';
    this.locationSearchEnabled = false;
    this.nearBySearchEnabled = false;
  }

  ionViewWillEnter() {
    this.takePicture();
  }

  takePicture() {
    let self = this;
    let options: CameraOptions = {};
    this.actionSheet = this.actionSheetCtrl.create({
      title: 'Select your picture',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            options = {
              quality: 75,
              destinationType: Camera.DestinationType.DATA_URL,
              sourceType: Camera.PictureSourceType.CAMERA,
              allowEdit: true,
              encodingType: Camera.EncodingType.JPEG,
              targetWidth: 300,
              targetHeight: 300,
              saveToPhotoAlbum: false
            };
            self.getPicture(options);
          }
        },
        {
          text: 'Gallery',
          icon: 'image',
          handler: () => {
            options = {
              quality: 75,
              destinationType: Camera.DestinationType.DATA_URL,
              sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
              allowEdit: true,
              encodingType: Camera.EncodingType.JPEG,
              targetWidth: 300,
              targetHeight: 300,
              saveToPhotoAlbum: false
            };
            self.getPicture(options);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    this.actionSheet.present();
  }

  enableNearBySearch() {
    this.nearBySearchEnabled = true;
    this.locationSearchEnabled = false;
    let modal = this.modalCtrl.create(NearbyMapPage);
    modal.onDidDismiss(data => {
      var self = this;
      self.mealDeal.location = data.address;
      self.mealDeal.place = data;
    });
    modal.present();
  }

  enableLocationSearch() {
    this.nearBySearchEnabled = false;
    this.locationSearchEnabled = true;
    let modal = this.modalCtrl.create(AutocompletePage);
    let self = this;
    modal.onDidDismiss(data => {
      self.mealDeal.location = data;
      self.mealDeal.place = data;
    });
    modal.present();
  }

  getPicture(options: CameraOptions) {
    let self = this;
    Camera.getPicture(options).then((imageData) => {
      let pictureName = 'dealPictureData';
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      self.storage.set(pictureName, base64Image).then(() => {
        this.actionSheet.dismiss();
        this.mealDeal.fileImage = base64Image;
      });
    }, (err) => {
      // Handle error
    });
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
}
