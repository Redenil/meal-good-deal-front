import { Component, OpaqueToken, Injectable, Inject } from '@angular/core';
import { ViewController, NavController, NavParams, LoadingController } from 'ionic-angular';
import { TwitterConnect, Facebook, NativeStorage } from 'ionic-native';
import { TabsPage } from '../tabs/tabs';
import { UserProfile, ProfileType } from '../../services/models';
import { Context } from '../../services/services';
import { Parse } from 'parse';
import { ConfigHelper } from '../../helpers/configHelper';

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
    private viewCtrl: ViewController,
    public config: ConfigHelper,
    public context: Context) {

    Parse.initialize(config.configurations.parse.parseApplicationId);
    Parse.serverURL = config.configurations.parse.parseServerUrl;
    Parse.javaScriptKey = config.configurations.parse.javaScriptKey;
    Parse.fileKey = config.configurations.parse.fileKey;
    Facebook.browserInit(config.configurations.facebook.facebookAppId,
      config.configurations.facebook.version);
  }

  loginTwitter() {
    let self = this;
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();
    TwitterConnect.login().then(function (response) {
      TwitterConnect.showUser().then(function (user) {
        //Save the user data in NativeStorage
        let userProfile = new UserProfile(
          "twitter-" + user.id,
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
        NativeStorage.setItem('CurrentUser', userProfile)
          .then(function () {
            loading.dismiss();
            self.context.IsDebug = false;
            self.navigateForward();
          }, function (error) {
            console.log(error);
            loading.dismiss();
          })
      }, function (error) {
        loading.dismiss();
      });
    });
  }

  loginFacebook() {
    let self = this;
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    let permissions = new Array<string>();

    //Facebook permission that app need
    permissions = ["public_profile", "email"];
    Facebook.login(permissions)
      .then(function (response) {
        let userId = response.authResponse.userID;
        let params = new Array<string>();
        //Getting name and gender properties
        Facebook.api("/me?fields=id,name,gender,first_name,last_name,locale,age_range,picture,email", params)
          .then(function (user) {
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

            Parse.FacebookUtils.logIn(userProfile)
              .then(function (userParse) {

                userProfile.parseSessionToken = userParse.get('sessionToken');
                userProfile.parseUsername = userParse.id;
              }, function (error) {
                console.log('loginFacebook - logIn: ' + JSON.stringify(error));
                loading.dismiss();
              }).then(function (userParse) {
                NativeStorage.setItem('CurrentUser', userProfile)
                  .then(function () {
                    var currentUser = Parse.User.current();
                    var query = new Parse.Query(Parse.Role);
                    query.equalTo("name", "StandardUser");
                    query.find({
                      success: function (roles) {
                        console.log("roles: " + roles.length);
                        for (var i = 0; i < roles.length; i++) {
                          roles[i].getUsers().add(currentUser);
                          roles[i].save();
                        }
                        loading.dismiss();
                        self.context.IsDebug = false;
                        self.navigateForward();
                      },
                      error: function (error) {
                        console.log('Role error : ' + JSON.stringify(error));
                      }
                    });
                  }, function (error) {
                    console.log(error);
                    loading.dismiss();
                  })
              }, function (error) {
                console.log('loginFacebook - storage : ' + JSON.stringify(error));
                loading.dismiss();
              })
          })
      }, function (error) {
        console.log(error);
        loading.dismiss();
      });
  }

  // to remove
  loginDebug() {
    this.context.IsDebug = true;
    this.navigateForward();
  }

  navigateForward() {
    this.navCtrl.push(TabsPage).then(() => {
      // first we find the index of the current view controller:
      const index = this.viewCtrl.index;
      // then we remove it from the navigation stack
      this.navCtrl.remove(index);
    });
  }
}
