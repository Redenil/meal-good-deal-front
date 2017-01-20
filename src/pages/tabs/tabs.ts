import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { HomePage, FavoritesPage, CameraPage, SettingsPage } from '../pages';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  homePageRoot: any = HomePage;
  favoritesDealRoot: any = FavoritesPage;
  cameraPageRoot: any = CameraPage;
  settingsPageRoot: any = SettingsPage;

  constructor() {
  }
}
