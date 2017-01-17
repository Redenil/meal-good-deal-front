import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { DealList } from '../../components/deal-list/deal-list';
import { DealFiltersPage } from '../deal-filters/deal-filters'
import { DealDataService } from '../../services/services'
import { DealModel } from '../../services/models'

@Component({
  selector: 'page-deals',
  templateUrl: 'deals.html',
  providers: [DealDataService]
})
export class DealsPage {
  public deals: Array<DealModel>;
  public inSearch: boolean;
  public searchTerm: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public dealDataService: DealDataService) {
    this.inSearch = false;
  }

  ngOnInit() {
    let self = this;
    this.dealDataService.getDeals().then(result => {
      self.deals = result;
    });
  }

  presentFilter() {
    let modal = this.modalCtrl.create(DealFiltersPage);
    modal.present();

    modal.onWillDismiss((data: any[]) => {
      if (data) {
        this.applyFilters();
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
}
