import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ConfigHelper } from '../helpers/configHelper';
import { HomePage, DealDetailPage, ShareDealPage, LoginPage, DealsPage, SettingsPage, DealFiltersPage, FavoritesPage, EditProfile, MapsPage } from '../pages/pages';
import { DealList, GoogleMap, BackgroundImage, Rating } from '../components/components';
import { TabsPage } from '../pages/tabs/tabs';
import { DealDataService, MapsDataService } from '../services/services';
import { Storage } from '@ionic/storage';
import { ReactiveFormsModule } from '@angular/forms';
import { EvenOddPipe } from '../pipes/evenodd';
import { GoogleMapsService } from '../pages/maps/maps.service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ShareDealPage,
    LoginPage,
    MapsPage,
    TabsPage,
    DealsPage,
    SettingsPage,
    DealFiltersPage,
    FavoritesPage,
    EditProfile,
    DealDetailPage,

    DealList,
    BackgroundImage,
    GoogleMap,
    Rating,

    EvenOddPipe
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
    TabsPage,
    DealsPage,
    SettingsPage,
    DealFiltersPage,
    FavoritesPage,
        EditProfile,
    DealDetailPage,
    MapsPage
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    Storage,
    ConfigHelper,
    DealDataService,
    MapsDataService,
    GoogleMapsService]
})
export class AppModule { }
