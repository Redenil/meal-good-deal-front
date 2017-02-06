import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ConfigHelper } from '../helpers/configHelper';
import { HomePage, ShareDealPage, LoginPage, CameraPage, DealsPage, SettingsPage, DealFiltersPage, FavoritesPage, AutocompletePage, EditProfile } from '../pages/pages';
import { Ionic2Rating } from 'ionic2-rating';
import { DealList } from '../components/deal-list/deal-list';
import { TabsPage } from '../pages/tabs/tabs';
import { DealDataService } from '../services/services';
import { Storage } from '@ionic/storage';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ShareDealPage,
    Ionic2Rating,
    DealList,
    LoginPage,
    CameraPage,
    TabsPage,
    DealsPage,
    SettingsPage,
    DealFiltersPage,
    FavoritesPage,
    AutocompletePage,
    EditProfile
  ],
  imports: [
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ShareDealPage,
    DealList,
    LoginPage,
    CameraPage,
    TabsPage,
    DealsPage,
    SettingsPage,
    DealFiltersPage,
    FavoritesPage,
    AutocompletePage,
    EditProfile
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    Storage,
    ConfigHelper,
    DealDataService]
})
export class AppModule { }
