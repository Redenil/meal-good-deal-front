import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { DealList } from '../../components/deal-list/deal-list';
import { DealFiltersPage } from '../deal-filters/deal-filters'
import { DealDataService } from '../../services/services'
import { DealModel } from '../../services/models'

@Component({
  selector: 'deals',
  templateUrl: 'deals.html',
  providers: [DealDataService]
})
export class DealsPage {
  public deals: Array<DealModel>;
  public filteredDeals: Array<DealModel>;
  public inSearch: boolean;
  public searchTerm: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public dealDataService: DealDataService,
    public loadingCtrl: LoadingController) {
    this.inSearch = false;
    this.searchTerm = '';
  }

  ngOnInit() {
    let loader = this.loadingCtrl.create({
      content: "Please wait while fetching deals..."
    });
    loader.present();
    this.getDeals().then(result => {
      loader.dismiss();
    });
  }

  getDeals(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dealDataService.getDeals().then(result => {
        this.deals = result;
        resolve();
      });
    });
  }

  presentFilter() {
    let modal = this.modalCtrl.create(DealFiltersPage);
    modal.present();

    modal.onWillDismiss((data: any[]) => {
      if (data) {
        this.searchTerm = '';
        this.applyFilters();
        this.getDeals();
      }
    });
  }

  applyFilters() {
  }

  applySearch() {
    let self = this;
    this.dealDataService.searchDeals(this.searchTerm).then(deals => {
      self.deals = deals;
    });
  }

  submitSearch() {
    let self = this;
    this.dealDataService.searchDeals(this.searchTerm).then(deals => {
      self.deals = deals;
    });
  }

  onSearchCancel(){
    this.inSearch = !this.inSearch;
    this.getDeals();
  }
}
