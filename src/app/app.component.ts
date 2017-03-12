import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, NativeStorage } from 'ionic-native';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;


  constructor(public platform: Platform) {
    //this.initializeApp();
    // used for an example of ngFor and navigation
    let env = this;
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      NativeStorage.getItem('CurrentUser')
        .then(function (data) {
          // user is previously logged and we have his data
          // we will let him access the app
          console.log("CurrentUser : " + data.name);
          console.log("SessionToken : " + data.parseSessionToken);
          if ((new Date().getTime() - new Date(data.expiration_date).getTime()) < 1
            && data.parseSessionToken != undefined) {
            env.openPage(TabsPage);
            Splashscreen.hide();
          } else {
            env.openPage(LoginPage);
            Splashscreen.hide();
          }

        }, function (error) {
          //we don't have the user data so we will ask him to log in
          env.openPage(LoginPage);
          Splashscreen.hide();
        });
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page);
  }
}
