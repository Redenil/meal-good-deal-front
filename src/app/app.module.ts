import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ConfigHelper } from '../helpers/configHelper';
import { HomePage, Page2, ShareDealPage, LoginPage } from '../pages/pages';
import { Ionic2Rating } from 'ionic2-rating';
import { DealList } from '../components/deal-list/deal-list';
import { TabsPage } from '../pages/tabs/tabs';
import { DealDataService } from '../services/services';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Page2,
    ShareDealPage,
    Ionic2Rating,
    DealList,
    LoginPage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Page2,
    ShareDealPage,
    DealList,
    LoginPage,
    TabsPage
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    ConfigHelper,
    DealDataService]
})
export class AppModule { }
