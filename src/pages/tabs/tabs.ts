import { Component } from '@angular/core';

import { HomePage } from '../homePage/homePage';
import { Page2 } from '../page2/page2';
import { ShareDealPage } from '../share-deal/share-deal';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  homePageRoot: any = HomePage;
  tab2Root: any = Page2;
  sharePlanRoot: any = ShareDealPage;

  constructor() {

  }
}
