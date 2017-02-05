import { Component, OpaqueToken, Injectable, Inject } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { TwitterConnect, Facebook , NativeStorage} from 'ionic-native';
import { APP_CONFIG_TOKEN, APP_CONFIG, ApplicationConfig } from '../../app/app-config';
import { TabsPage } from '../tabs/tabs';
import { TwitterLoginService } from '../../services/services'
import { UserProfile, ProfileType } from '../../services/models'

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [{ provide: APP_CONFIG_TOKEN, useValue: APP_CONFIG }, TwitterLoginService]
})
export class LoginPage {
  private facebookAppId: number;
  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    public loadingCtrl: LoadingController,
    private twitterLoginService: TwitterLoginService,
    @Inject(APP_CONFIG_TOKEN) config: ApplicationConfig) {
    Facebook.browserInit(config.facebookAppId, "v2.8");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  loginTwitter() {
    let self = this;
    let nav = this.navCtrl;
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();
    this.twitterLoginService.login().then(function (user) {
      NativeStorage.setItem('CurrentUser',
        new UserProfile(
          user.name,
          user.screen_name,
          user.profile_image_url,
          ProfileType.Twitter)).then(function () {
            loading.dismiss();
            nav.push(TabsPage);
          });
    }).catch(function () {
      loading.dismiss();
    });
  }

  loginFacebook() {
    let self = this;
    let nav = this.navCtrl;
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    let permissions = new Array<string>();

    //Facebook permission that app need
    permissions = ["public_profile"];
    Facebook.login(permissions)
      .then(function (response) {
        let userId = response.authResponse.userID;
        let params = new Array<string>();
        //Getting name and gender properties
        Facebook.api("/me?fields=name,gender", params)
          .then(function (user) {
            user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
            //Save user info in the NativeStorage
            console.log("CurrentUser : "+user.name);
            NativeStorage.setItem('CurrentUser',
              {
                name: user.name,
                gender: user.gender,
                picture: user.picture
              })
              .then(function () {
                loading.dismiss();
                nav.push(TabsPage);
              }, function (error) {
                console.log(error);
                loading.dismiss();
              })
          })
      }, function (error) {
        console.log(error);
        loading.dismiss();
      });
  }
}
