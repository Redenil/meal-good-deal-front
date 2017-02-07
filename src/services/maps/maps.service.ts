import { Injectable, ViewChild, ElementRef } from '@angular/core';
import { ConfigHelper } from '../../helpers/configHelper'
import { Geolocation } from 'ionic-native';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MapsDataService {
    placesService: google.maps.places.PlacesService;
    choosenPlace = new Subject<any>();
    observableChoosenPlace = this.choosenPlace.asObservable();
    private infoWindow: any;
    private map: google.maps.Map;

    constructor() {
    }

    initNearBySearch() {
        Geolocation.getCurrentPosition().then((resp) => {
            var currentLoc = { lat: resp.coords.latitude, lng: resp.coords.longitude };

            this.map = new google.maps.Map(document.getElementById('map'), {
                center: currentLoc,
                zoom: 15
            });
            this.map.setOptions({ center: currentLoc, zoom: 15 });
            this.placesService = new google.maps.places.PlacesService(this.map);

            var service = new google.maps.places.PlacesService(this.map);
            service.nearbySearch({
                location: currentLoc,
                radius: 500,
                types: ['restaurant']
            }, this.onPlacesFound.bind(this));
        });

    }

    onPlacesFound(results, status) {
        let self = this;
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                self.createMarker(results[i]);
            }
        }
    }

    createMarker(place) {
        let self = this;
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: self.map,
            position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', this.showContent.bind(this, marker, place));
    }

    showContent(marker, place) {
        this.choosenPlace = place;
        var contentString = `<div>` +
            `<h2 id="selected-place">${place.name}</h2>` +
            `<div id="bodyContent">` +
            `<p>${place.vicinity}</p>` +
            `<p>${place.place_id}</p>` +
            `</div>` +
            `</div>`;

        this.infoWindow = new google.maps.InfoWindow({
            content: contentString
        });

        this.infoWindow.open(this.map, marker);
    }

    chooseItem(place) {
        this.choosenPlace.next(place);
    }
}