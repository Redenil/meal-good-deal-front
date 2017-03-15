import { Component, ViewChild } from '@angular/core';
import { Nav,NavController, NavParams,App,ModalController, SegmentButton, LoadingController, MenuController} from 'ionic-angular';
import { TwitterConnect, NativeStorage } from 'ionic-native';
import { UserProfile, ProfileType } from '../../services/models';
import { LoginPage } from '../login/login';
import { EditProfile } from '../edit-profile/edit-profile';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  public profile: UserProfile;
  public isConnected: boolean;

  constructor(private app: App,
    public menu: MenuController,
    private navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController) {
    this.profile = new UserProfile();
    this.isConnected = false;
  }

  ionViewWillEnter() {
    let self = this;
    NativeStorage.getItem('CurrentUser')
      .then(function (data) {
        self.profile = data;
        self.isConnected = true;
      }, function (error) {
        console.log('user not connected');
      });
  }

    goToSettings() {
    // close the menu when clicking a link from the menu
    this.menu.close();
    this.app.getRootNav().push(EditProfile);
  }

  logout() {
    NativeStorage.remove('CurrentUser');
    const root = this.app.getRootNav();
    root.popToRoot();
  }
  edit(){
    let modal = this.modalCtrl.create(EditProfile, { CurrentUser: this.profile });
    modal.present();
  }
}
