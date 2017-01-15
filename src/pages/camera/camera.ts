import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { ShareDealPage } from '../../pages/pages'

@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
  providers: [Storage]
})
export class CameraPage {
  private storage: Storage;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public strg: Storage) {
    this.storage = strg;
  }

  ionViewDidLoad() {
    this.takePicture();
  }

  takePicture() {
    let options: CameraOptions = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      saveToPhotoAlbum: false
    };
    let self = this;
    Camera.getPicture(options).then((imageData) => {
      let pictureName = 'dealPictureData';
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      self.storage.set('dealPictureData', base64Image);

      this.navCtrl.push(ShareDealPage, pictureName);
    }, (err) => {
      // Handle error
    });
  }
}
