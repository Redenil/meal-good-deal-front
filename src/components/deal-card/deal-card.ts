import { Component, Input, Inject, Pipe, PipeTransform, OnChanges, SimpleChange, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DealDataService } from '../../services/services'
import { DealModel } from '../../services/models';
import { DealDetailPage } from '../../pages/pages';

@Component({
  selector: 'deal-card',
  templateUrl: 'deal-card.html',
  providers: [DealDataService]
})
export class dealcard implements OnChanges {
  @Input() deals: Array<DealModel>;
  @Input() hasChanged: boolean;
  @Input() pageNumber: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dealDataService: DealDataService,
    private detector: ChangeDetectorRef) {
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    let log: string[] = [];
    for (let propName in changes) {
      if (propName === "hasChanged") {
        let changedProp = changes[propName];
        if (changedProp.currentValue === true) {
          this.detector.detectChanges();
        }
      }
    }
  }

  showDealDetail(deal) {
    this.navCtrl.push(DealDetailPage, deal);
  }
}