import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage, Page2, SharePlanPage, LoginPage } from '../pages/pages';
import { Ionic2Rating } from 'ionic2-rating';
import { DealList } from '../components/deal-list/deal-list';
import { TabsPage } from '../pages/tabs/tabs';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Page2,
    SharePlanPage,
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
    SharePlanPage,
    DealList,
    LoginPage,
    TabsPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }
