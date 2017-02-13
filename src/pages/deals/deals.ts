import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { DealList } from '../../components/deal-list/deal-list';
import { DealFiltersPage } from '../deal-filters/deal-filters'
import { DealDataService } from '../../services/services'
import { DealModel } from '../../services/models'
import { Subject } from 'rxjs/Subject';

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
  public hasChanged: boolean;
  pageNumber: number = 0;

  public observableDeals = new Subject<Array<DealModel>>();

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public dealDataService: DealDataService,
    public loadingCtrl: LoadingController) {
    this.inSearch = false;
    this.searchTerm = '';
    this.hasChanged = false;
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
      this.dealDataService.getDeals(0).then(result => {
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

  onSearchCancel() {
    this.inSearch = !this.inSearch;
    this.getDeals();
  }

  doInfinite(infiniteScroll) {
    this.pageNumber++;
    console.log('Begin async operation');
    this.hasChanged = true;
    this.dealDataService.getDeals(this.pageNumber).then((result) => {
      this.hasChanged = true;
      let tmp = this.deals;
      this.deals = null;
      this.deals = tmp.concat(result);
      infiniteScroll.complete();
    });
  }
}
