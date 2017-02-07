import { Component, Input, Inject, ViewChild, ElementRef } from '@angular/core';
import { DealDataService } from '../../services/services'
import { DealModel, PlaceModel } from '../../services/models';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'place-info',
  templateUrl: 'place-info.html'
})
export class PlaceInfo {
  choosenPlace = new Subject<PlaceModel>();
  observableChoosenPlace = this.choosenPlace.asObservable();
  private infoWindow: any;

  @Input() hostingMap: google.maps.Map;
  @Input() hostingMarker: google.maps.Marker;
  @Input() place: PlaceModel;
  @ViewChild('placeInfo') placeInfoElement: ElementRef;
  constructor() {
    this.infoWindow = new google.maps.InfoWindow();
    this.infoWindow.setContent(this.placeInfoElement.nativeElement);
    this.infoWindow.open(this.hostingMap, this.hostingMarker);
  }

  chooseItem(place) {
    this.choosenPlace.next(place);
  }
}
