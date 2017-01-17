import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TwitterConnect } from 'ionic-native';
import { UserProfile, ProfileType } from '../../services/models';
import { Storage } from '@ionic/storage';
import { TwitterLoginService } from '../../services/services'

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [TwitterLoginService]
})
export class SettingsPage {
  public profile: UserProfile;
  public isConnected: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public twitterLoginService: TwitterLoginService) {
    this.profile = new UserProfile();
    this.isConnected = false;
  }

  ionViewWillEnter() {
    let self = this;
    self.storage.get('CurrentUser')
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
    self.twitterLoginService.logout().then(() => {
      self.storage.remove('CurrentUser').then(() => {
        self.isConnected = false
      });
    });
  }
}
