import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NativeStorage, TwitterConnect } from 'ionic-native';
import { UserProfile, ProfileType } from '../../services/models';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  public profile: UserProfile;
  public isConnected: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.profile = new UserProfile();
    this.isConnected = false;
  }

  ionViewWillEnter() {
    let self = this;
    NativeStorage.getItem('twitter_user')
      .then(function (data) {
        self.profile.name = data.name;
        self.profile.userName = data.userName;
        self.profile.picture = data.picture;
        self.profile.profileType = ProfileType.Twitter;

        self.isConnected = true;
      }, function (error) {
        console.log('twitter not connected');
      });
  }

  logout() {
    let self = this;
    TwitterConnect.logout().then(function (response) {
      NativeStorage.remove('twitter_user');
      self.isConnected = false;
    }, function (error) {
      console.log(error);
    });
  }
}
