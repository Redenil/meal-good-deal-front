import { Injectable } from '@angular/core';
import { ConfigHelper } from '../../helpers/configHelper'
import { Parse } from 'parse';
import { DealModel } from './deal.model';

@Injectable()
export class DealDataService {
    public serverApi: any;

    constructor(public config: ConfigHelper) {
        Parse.initialize(config.configurations.Parse.parseApplicationId);
        Parse.masterKey = config.configurations.Parse.parseMasterKey;
        Parse.serverURL = config.configurations.Parse.parseServerUrl;
        Parse.javaScriptKey = config.configurations.Parse.javaScriptKey;
    }

    getDeals(): Promise<Array<DealModel>> {
        return new Promise(function (resolve, reject) {
            var list = new Array<DealModel>();
            var query = new Parse.Query('MealDeal');
            query.find({
                success: function (results) {
                    for (var i = 0; i < results.length; i++) {
                        var model = results[i];
                        var mealDeal = new DealModel()
                        mealDeal.title = model.get('title');
                        mealDeal.description = model.get('description');
                        mealDeal.location = model.get('location');
                        mealDeal.price = model.get('price');
                        mealDeal.rate = model.get('rate');
                        list.push(mealDeal);
                    }
                    resolve(list);
                },

                error: function (error) {
                    reject();
                }
            });
        });
    }

    createDeal(deal: DealModel): Promise<boolean> {
        var parseObject = new Parse.Object('MealDeal');
        return new Promise(function (resolve, reject) {
            parseObject.set('title', deal.title);
            parseObject.set('description', deal.description);
            parseObject.set('location', deal.location);
            parseObject.set('price', Number(deal.price));

            // var parseFile = new Parse.File('dealPicture', deal.fileImage);
            // parseObject.set('file', parseFile);
            parseObject.save(null, { useMasterKey: true }).then(
                function (obj) {
                    resolve(true);
                },
                function (err) {
                    reject(err);
                });
        });
    }
}