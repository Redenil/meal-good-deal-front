import { Component } from '@angular/core';

import { HomePage } from '../homePage/homePage';
import { ShareDealPage } from '../share-deal/share-deal';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  homePageRoot: any = HomePage;
  shareDealRoot: any = ShareDealPage;

  constructor() {
  }
}
