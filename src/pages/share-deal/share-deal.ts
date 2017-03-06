import { Component} from '@angular/core';
import { NavController, NavParams, ToastController, ModalController, ActionSheetController, ActionSheet, AlertController, AlertOptions } from 'ionic-angular';
// import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { DealDataService, MapsDataService } from '../../services/services'
import { DealModel } from '../../services/models'
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from 'ionic-native';
import { HomePage, MapsPage } from '../../pages/pages';


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
    private alertCtrl : AlertController,
    private mapsDataservice: MapsDataService) {
    this.mealDeal = new DealModel();
    this.mealDeal.isTwitterShared = false;
    this.mealDeal.isFacebookShared = false;
    this.locationSearchEnabled = false;
    this.nearBySearchEnabled = false;
  }

  ionViewWillEnter() {
    this.takePicture();
  }

  ionViewWillLeave(){
    this.mealDeal =  new DealModel();
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
    let modal = this.modalCtrl.create(MapsPage);
    modal.onDidDismiss(data => {
      this.mealDeal.place = data;
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
      let alert = this.alertCtrl.create({
      title: 'Deal shared!',
      subTitle: "Let's see whether you get a tones of likes !",
      buttons: [{
        text : 'ok',
        handler: () =>{
          this.navCtrl.push(HomePage);
        }}]  
      });
        alert.present();
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
