import { Component } from '@angular/core';

import { HomePage, ShareDealPage, CameraPage, SettingsPage } from '../pages';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  homePageRoot: any = HomePage;
  shareDealRoot: any = ShareDealPage;
  cameraPageRoot: any = CameraPage;
  settingsPageRoot: any = SettingsPage;

  constructor() {
  }
}
