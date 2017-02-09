import { Component, OpaqueToken, Injectable, Inject } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { TwitterConnect, Facebook, NativeStorage } from 'ionic-native';
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
    private navCtrl: NavController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private twitterLoginService: TwitterLoginService,
    @Inject(APP_CONFIG_TOKEN) config: ApplicationConfig) {
    console.log('constructor LoginPage');
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
    TwitterConnect.login().then(function(response) {
      console.log('loginTwitter - response : '+JSON.stringify(response));
      TwitterConnect.showUser().then(function(user){
        console.log('loginTwitter - user : '+JSON.stringify(user));
        //Save the user data in NativeStorage
        let userProfile = new UserProfile(user.email,
        user.screen_name,
        "twitter-"+user.id,
        user.name,
        user.name,
        "",
        "",
        "",
        "",
        user.location,
        user.profile_image_url,
        true,
        ProfileType.Facebook,
        "",
        response.token
        );
       NativeStorage.setItem('CurrentUser',userProfile)
       .then(function () {
         loading.dismiss();
         nav.push(TabsPage);
       }, function (error) {
         console.log(error);
         loading.dismiss();
       })
     }, function(error){
       loading.dismiss();
     });
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
    permissions = ["public_profile","email"];
    Facebook.login(permissions)
      .then(function (response) {
        console.log('loginFacebook - response : '+JSON.stringify(response));
        let userId = response.authResponse.userID;
        let params = new Array<string>();
        //Getting name and gender properties
        Facebook.api("/me?fields=id,name,gender,first_name,last_name,locale,age_range,picture,email", params)
          .then(function (user) {
            console.log('loginFacebook - user : '+JSON.stringify(user));
            //Save user info in the NativeStorage
            let userProfile = new UserProfile(user.email,
              user.first_name,
              "facebook-"+user.id,
              user.name,
              user.first_name,
              user.last_name,
              user.age_range.min,
              user.age_range.max,
              user.gender,
              user.locale,
              "https://graph.facebook.com/" + user.id + "/picture?type=large",
              true,
              ProfileType.Facebook,
              response.authResponse.accessToken,
              ""
            );
            NativeStorage.setItem('CurrentUser',userProfile)
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

  // to remove
  loginDebug(){
    this.navCtrl.push(TabsPage);
  }
}
