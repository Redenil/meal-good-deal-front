import { Component, ViewChild } from '@angular/core';
import { Nav,NavController, NavParams} from 'ionic-angular';
import { TwitterConnect, NativeStorage } from 'ionic-native';
import { UserProfile, ProfileType } from '../../services/models';
import { TwitterLoginService } from '../../services/services'
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [TwitterLoginService]
})
export class SettingsPage {
  @ViewChild(Nav) nav: Nav;
  public profile: UserProfile;
  public isConnected: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public twitterLoginService: TwitterLoginService) {
    this.profile = new UserProfile();
    this.isConnected = false;
  }

  ionViewWillEnter() {
    let self = this;
    NativeStorage.getItem('CurrentUser')
      .then(function (data) {
        self.profile.name = data.name;
        self.profile.userName = data.userName;
        self.profile.picture = data.picture;
        self.profile.profileType = data.profileType;
        self.isConnected = true;
      }, function (error) {
        console.log('twitter not connected');
      });
  }

  logout() {
    let self = this;
    let nav = this.navCtrl;
    NativeStorage.remove('CurrentUser').then(function () {
      nav.setRoot(LoginPage);
    }, function (error) {
      console.log(error);
    });
    //logout Facebook or Twitter
  }
}
