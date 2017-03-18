import { Injectable, isDevMode } from '@angular/core';
import { ConfigHelper } from '../../helpers/configHelper'
import { Parse } from 'parse';
import { DealModel } from './deal.model';
import { NativeStorage } from 'ionic-native';
import { Context } from '../context/context'

@Injectable()
export class DealDataService {
    public serverApi: any;
    public sessionToken: string;

    constructor(public config: ConfigHelper,
        public context: Context) {
        Parse.initialize(config.configurations.parse.parseApplicationId);
        Parse.serverURL = config.configurations.parse.parseServerUrl;
        Parse.masterKey = config.configurations.parse.parseMasterKey;
        Parse.javaScriptKey = config.configurations.parse.javaScriptKey;
        Parse.fileKey = config.configurations.parse.fileKey;
    }

    getDeals(page: number): Promise<Array<DealModel>> {
        let self = this;
        let list = new Array<DealModel>();
        let DEAL_NUMBER = 10;
        return new Promise(function (resolve, reject) {
            let query = new Parse.Query('MealDeal');
            query.include('file');
            query.include('place');
            query.limit(DEAL_NUMBER);
            query.skip(DEAL_NUMBER * page);
            var queryObject = {
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
            };
            Object.assign(queryObject, self.buildToken());
            query.find(queryObject);
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
            var queryObject = {
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
            };
            Object.assign(queryObject, self.buildToken());
            mainQuery.find(queryObject);
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
            mealDeal.set("title", deal.title);
            mealDeal.set("description", deal.description);
            mealDeal.set("location", deal.location);
            mealDeal.set("price", Number(deal.price));
            mealDeal.set("isTwitterShared", Boolean(deal.isTwitterShared));
            mealDeal.set("isFacebookShared", Boolean(deal.isFacebookShared));
            mealDeal.set("user", currentUser);
            mealDeal.set("userPicture", currentUser.get("authData").facebook.picture);
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
                mealDeal.set('file', parseFile);
                var queryObject = {
                    success: function (savedObject) {
                        resolve(true);
                    },
                    error: function (error) {
                        console.log(error);
                        reject(error);
                    }
                };
                Object.assign(queryObject, self.buildToken());
                mealDeal.save(null, queryObject);
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
        mealDeal.id = model.objectId;
        mealDeal.title = model.title;
        mealDeal.description = model.description;
        mealDeal.location = model.location;
        mealDeal.price = model.price;
        mealDeal.fileImage = model.file ? model.file.url : null;
        mealDeal.isFacebookShared = model.isFacebookShared;
        mealDeal.isTwitterShared = model.isTwitterShared;
        mealDeal.userPicture = model.userPicture;

        if (model.place) {
            mealDeal.place.address = model.place.address;
            mealDeal.place.name = model.place.name;
            mealDeal.place.latitude = model.place.latitude;
            mealDeal.place.longitude = model.place.longitude;
        }

        return mealDeal;

    }

    addFavorite(dealModel: DealModel): Promise<boolean> {
        var currentUser = Parse.User.current();
        var favorite = currentUser.relation("favorites");
        var dealParseObject = this.convertModelToParseObject(dealModel);
        favorite.add(dealParseObject);

        return new Promise(function (resolve, reject) {
            currentUser.save(null, {
                sessionToken: currentUser.get('sessionToken'),
                success: function (savedObject) {
                    resolve(true);
                },
                error: function (error) {
                    console.log(error);
                    reject(error);
                }
            });
        });
    }

    switchFavorite(dealModel: DealModel, isFavorite: boolean): Promise<boolean> {
        var currentUser = Parse.User.current();
        var favorite = currentUser.relation("favorites");
        var dealParseObject = this.convertModelToParseObject(dealModel);
        isFavorite ? favorite.add(dealParseObject) : favorite.remove(dealParseObject);

        return new Promise(function (resolve, reject) {
            currentUser.save(null, {
                sessionToken: currentUser.get('sessionToken'),
                success: function (savedObject) {
                    resolve(true);
                },
                error: function (error) {
                    console.log(error);
                    reject(error);
                }
            });
        });
    }


    removeFavorite(dealModel: DealModel): Promise<boolean> {
        var currentUser = Parse.User.current();
        var favorite = currentUser.relation("favorites");
        var dealParseObject = this.convertModelToParseObject(dealModel);
        favorite.remove(dealParseObject);

        return new Promise(function (resolve, reject) {
            currentUser.save(null, {
                sessionToken: currentUser.get('sessionToken'),
                success: function (savedObject) {
                    resolve(true);
                },
                error: function (error) {
                    console.log(error);
                    reject(error);
                }
            });
        });
    }

    convertModelToParseObject(dealModel: DealModel): any {
        let MealDeal = Parse.Object.extend("MealDeal");
        let mealDeal = new MealDeal();
        mealDeal.set("id", dealModel.id);

        return mealDeal;
    }

    buildToken(): any {
        if (this.context.IsDebug) {
            return { useMasterKey: true }
        } else {
            var currentUser = Parse.User.current();
            return { sessionToken: currentUser.get('sessionToken') };
        }

    }

    getUserFavorites(): Promise<Array<DealModel>> {
        let self = this;
        let list = new Array<DealModel>();
        var currentUser = Parse.User.current();
        var favoritesQuery = currentUser.relation("favorites");

        return new Promise(function (resolve, reject) {
            var queryObject = {
                sessionToken: currentUser.get('sessionToken'),
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
            };
            favoritesQuery.query().find(queryObject);
        });
    }

        getUserDeals(): Promise<Array<DealModel>> {
        let self = this;
        let list = new Array<DealModel>();
        var currentUser = Parse.User.current();
        var mealQuery = new Parse.Query('MealDeal');
        mealQuery.equalTo("user", currentUser);

        return new Promise(function (resolve, reject) {
            var queryObject = {
                
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
            };
            mealQuery.find(queryObject);
        });
    }
}
