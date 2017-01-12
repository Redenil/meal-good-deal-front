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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage) {
  }

  ionViewDidLoad() {
    this.storage.set('test', 'reda');
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

    Camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let pictureName = 'dealPictureData';
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.storage.set('dealPictureData', base64Image);

      this.navCtrl.push(ShareDealPage, pictureName);
    }, (err) => {
      // Handle error
    });
  }
}
