import { PlaceModel } from './place.model'
export class DealModel {
    public title: string;
    public description: string;
    public location: string;
    public place: PlaceModel;
    public price: Number;
    public rate: number;
    public fileImage: any;
    public isFacebookShared: boolean;
    public isTwitterShared: boolean;

    constructor() {
        this.place = new PlaceModel();
    }
}