import { Injectable } from '@angular/core';
import { ConfigHelper } from '../../helpers/configHelper'
import { Parse } from 'parse';
import { DealModel } from './deal.model';
import { NativeStorage } from 'ionic-native';

@Injectable()
export class DealDataService {
    public serverApi: any;
    public sessionToken: string;

    constructor(public config: ConfigHelper) {
        Parse.initialize(config.configurations.parse.parseApplicationId);
        Parse.serverURL = config.configurations.parse.parseServerUrl;
        Parse.javaScriptKey = config.configurations.parse.javaScriptKey;
        Parse.fileKey = config.configurations.parse.fileKey;
    }

    getDeals(page: number): Promise<Array<DealModel>> {
        let self = this;
        let list = new Array<DealModel>();
        let DEAL_NUMBER = 10;
        return new Promise(function (resolve, reject) {
            var currentUser = Parse.User.current();
            console.log('getDeals - currentUser : '+JSON.stringify(currentUser));
            let query = new Parse.Query('MealDeal');
            query.include('file');
            query.include('place');
            query.limit(DEAL_NUMBER);
            query.skip(DEAL_NUMBER * page);
            query.find({
                useMasterKey: false,
                sessionToken:currentUser.get('sessionToken'),
                success: function (results) {
                    for (var i = 0; i < results.length; i++) {
                        let mealDeal = self.convertParseObjectToModel(results[i]);

                        list.push(mealDeal);
                    }
                    resolve(list);
                },
                error: function (error) {
                    console.log(error);
                    reject();
                }
            });
        });
    }

    searchDeals(searchTerm: string): Promise<Array<DealModel>> {
        let self = this;
        let list = new Array<DealModel>();
        let titleQuery = new Parse.Query('MealDeal');
        titleQuery.contains("title", searchTerm);

        let descriptionQuery = new Parse.Query('MealDeal');
        descriptionQuery.contains("description", searchTerm);
        var mainQuery = Parse.Query.or(titleQuery, descriptionQuery);
        mainQuery.include('file');
        return new Promise((resolve, reject) => {
            mainQuery.find({
                success: function (results) {
                    for (var i = 0; i < results.length; i++) {
                        let mealDeal = self.convertParseObjectToModel(results[i]);

                        list.push(mealDeal);
                    }
                    resolve(list);
                },
                error: function (error) {
                    console.log(error);
                    reject();
                }
            });
        });
    }

    createDeal(deal: DealModel): Promise<boolean> {
        let self = this;
        let MealDeal = Parse.Object.extend("MealDeal");
        let Place = Parse.Object.extend("Place");
        let mealDeal = new MealDeal();
        let place = new Place();

        return new Promise(function (resolve, reject) {
            var currentUser = Parse.User.current();
            console.log('currentUser : '+JSON.stringify(currentUser));
            mealDeal.set("title", deal.title);
            mealDeal.set("description", deal.description);
            mealDeal.set("location", deal.location);
            mealDeal.set("price", Number(deal.price));
            mealDeal.set("isTwitterShared", Boolean(deal.isTwitterShared));
            mealDeal.set("isFacebookShared", Boolean(deal.isFacebookShared));
            mealDeal.set("user", currentUser);
            var mealDealACL = new Parse.ACL();
            mealDealACL.setRoleWriteAccess("StandardUser", true);
            mealDealACL.setRoleReadAccess("StandardUser", true);
            mealDeal.setACL(mealDealACL);

            place.set("user", currentUser);
            place.set('placeId', deal.place.placeId);
            place.set('address', deal.place.address);
            place.set('latitude', deal.place.latitude);
            place.set('longitude', deal.place.longitude);
            place.set('name', deal.place.name);
            var placeACL = new Parse.ACL();
            placeACL.setRoleWriteAccess("StandardUser", true);
            placeACL.setRoleReadAccess("StandardUser", true);
            place.setACL(placeACL);

            mealDeal.set('place', place);

            var parseFile = new Parse.File('picture-' + self.createGuid(), { base64: deal.fileImage });
            parseFile.save().then(function () {
                console.log('currentUser.sessionToken : '+JSON.stringify(currentUser.get('sessionToken')));
                mealDeal.set('file', parseFile);
                mealDeal.save(null, {
                    useMasterKey: false,
                    sessionToken:currentUser.get('sessionToken'),
                    success: function (savedObject) {
                        resolve(true);
                    },
                    error: function (error) {
                        console.log(error);
                        reject(error);
                    }
                });
            }, function (error) {
                console.log(error);
                reject(error);
            });
        });
    }

    createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    convertParseObjectToModel(parseMealDeal: any): DealModel {
        var model = parseMealDeal.toJSON();
        var mealDeal = new DealModel();
        mealDeal.title = model.title;
        mealDeal.description = model.description;
        mealDeal.location = model.location;
        mealDeal.price = model.price;
        mealDeal.fileImage = model.file ? model.file.url : null;
        mealDeal.isFacebookShared = model.isFacebookShared;
        mealDeal.isTwitterShared = model.isTwitterShared;

        if (model.place) {
            mealDeal.place.address = model.place.address;
            mealDeal.place.name = model.place.name;
            mealDeal.place.latitude = model.place.latitude;
            mealDeal.place.longitude = model.place.longitude;
        }

        return mealDeal;

    }
}
