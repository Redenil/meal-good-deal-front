import { Component, ViewChild } from '@angular/core';
import { Nav,NavController, NavParams,App,ModalController, SegmentButton, LoadingController, MenuController} from 'ionic-angular';
import { TwitterConnect, NativeStorage } from 'ionic-native';
import { UserProfile, ProfileType } from '../../services/models';
import { LoginPage } from '../login/login';
import { EditProfile } from '../edit-profile/edit-profile';
import { DealDataService } from '../../services/services';
import { DealModel } from '../../services/models';
import { dealcard } from '../../components/deal-card/deal-card';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  public profile: UserProfile;
  public isConnected: boolean;
  public deals: Array<DealModel>;
  display: string;

  constructor(
    public dealDataService: DealDataService,
    private app: App,
    public menu: MenuController,
    private navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController) {

    this.display = "list";
    this.profile = new UserProfile();
    this.isConnected = false;
    
  }

  ionViewWillEnter() {
    let self = this;
    NativeStorage.getItem('CurrentUser')
      .then(function (data) {
        self.profile = data;
        self.isConnected = true;
      }, function (error) {
        console.log('user not connected');
      });

      this.dealDataService.getUserDeals().then(result => {
      this.deals = result;
      
    });
  }

    goToSettings() {
    // close the menu when clicking a link from the menu
    this.menu.close();
    this.app.getRootNav().push(EditProfile);
  }

   onSegmentChanged(segmentButton: SegmentButton) {
    // console.log('Segment changed to', segmentButton.value);
  }

  onSegmentSelected(segmentButton: SegmentButton) {
    // console.log('Segment selected', segmentButton.value);
  }

  logout() {
    NativeStorage.remove('CurrentUser');
    const root = this.app.getRootNav();
    root.popToRoot();
  }
  edit(){
    let modal = this.modalCtrl.create(EditProfile, { CurrentUser: this.profile });
    modal.present();
  }
}
