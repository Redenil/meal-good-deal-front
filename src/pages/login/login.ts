import { Component, OpaqueToken, Injectable, Inject } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { TwitterConnect, Facebook, NativeStorage } from 'ionic-native';
import { TabsPage } from '../tabs/tabs';
import { UserProfile, ProfileType } from '../../services/models'
import { Parse } from 'parse';
import { ConfigHelper } from '../../helpers/configHelper'

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private facebookAppId: number;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    public config: ConfigHelper) {
    console.log('constructor LoginPage');
    Parse.initialize(config.configurations.parse.parseApplicationId);
    Parse.masterKey = config.configurations.parse.parseMasterKey;
    Parse.serverURL = config.configurations.parse.parseServerUrl;
    Parse.javaScriptKey = config.configurations.parse.javaScriptKey;
    Parse.fileKey = config.configurations.parse.fileKey;
    Facebook.browserInit(config.configurations.facebook.facebookAppId,
    config.configurations.facebook.version);
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
        let userProfile = new UserProfile(
        "twitter-"+user.id,
        "",
        "",
        user.email,
        user.screen_name,
        user.name,
        user.name,
        "",
        "",
        "",
        "",
        user.location,
        user.profile_image_url,
        true,
        ProfileType.Facebook
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
            let expirationDate = new Date(
                  new Date().getTime() + response.authResponse.expiresIn * 1000
            ).toISOString();
            let userProfile = new UserProfile(
              response.authResponse.userID,
              response.authResponse.accessToken,
              expirationDate,
              user.email,
              user.first_name,
              user.name,
              user.first_name,
              user.last_name,
              user.age_range.min,
              user.age_range.max,
              user.gender,
              user.locale,
              "https://graph.facebook.com/" + user.id + "/picture?type=large",
              true,
              ProfileType.Facebook
            );
            console.log('loginFacebook - userProfile : '+JSON.stringify(userProfile));
            Parse.FacebookUtils.logIn(userProfile)
            .then(function (userParse) {
              console.log('loginFacebook - userParse : '+JSON.stringify(userParse));
            }, function (userParse,error) {
              console.log('loginFacebook - Error : '+JSON.stringify(error));
              loading.dismiss();
            }).then(function (userParse) {
              NativeStorage.setItem('CurrentUser',userProfile)
              .then(function () {
                loading.dismiss();
                nav.push(TabsPage);
              }, function (error) {
                console.log(error);
                loading.dismiss();
              })
            }, function (error) {
              console.log('loginFacebook - Error : '+JSON.stringify(error));
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
