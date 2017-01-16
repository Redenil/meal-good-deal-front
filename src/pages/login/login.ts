import { Component ,OpaqueToken, Injectable, Inject} from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { NativeStorage, TwitterConnect, Facebook } from 'ionic-native';
import { APP_CONFIG_TOKEN, APP_CONFIG, ApplicationConfig } from '../../app/app-config';
import { DealsPage } from '../pages';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [{ provide: APP_CONFIG_TOKEN, useValue: APP_CONFIG }]
})
export class LoginPage {
  private facebookAppId: number;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    @Inject(APP_CONFIG_TOKEN) config: ApplicationConfig) {
      Facebook.browserInit(config.facebookAppId, "v2.8");
    }

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

  loginFacebook(){
    let nav = this.navCtrl;
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    let permissions = new Array<string>();

    //Facebook permission that app need
    permissions = ["public_profile"];
    Facebook.login(permissions)
    .then(function(response){
      let userId = response.authResponse.userID;
      let params = new Array<string>();
      //Getting name and gender properties
      Facebook.api("/me?fields=name,gender", params)
      .then(function(user) {
        user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        //Save user info in the NativeStorage
        NativeStorage.setItem('facebook_user',
        {
          name: user.name,
          gender: user.gender,
          picture: user.picture
        })
        .then(function(){
          loading.dismiss();
          nav.push(DealsPage);
        }, function (error) {
          console.log(error);
          loading.dismiss();
        })
      })
    }, function(error){
      console.log(error);
      loading.dismiss();
    });
  }
}
