import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { NativeStorage, TwitterConnect } from 'ionic-native';
import { DealsPage } from '../pages'

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  loginTwitter() {
    let nav = this.navCtrl;
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    //Request for login
    TwitterConnect.login().then(function (result) {
      //Get user data
      TwitterConnect.showUser().then(function (user) {
        //Save the user data in NativeStorage
        NativeStorage.setItem('twitter_user',
          {
            name: user.name,
            userName: user.screen_name,
            followers: user.followers_count,
            picture: user.profile_image_url_https
          }).then(function () {
            loading.dismiss();
            nav.push(DealsPage);
          })
      }, function (error) {
        loading.dismiss();
      });
    });
  }
}
