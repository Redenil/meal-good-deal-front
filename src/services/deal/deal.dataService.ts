import { Injectable } from '@angular/core';
import { ConfigHelper } from '../../helpers/configHelper'
import { Parse } from 'parse';
import { DealModel } from './deal.model';

@Injectable()
export class DealDataService {
    public serverApi: any;

    constructor(public config: ConfigHelper) {
        Parse.initialize(config.configurations.parseMasterKey);
        Parse.serverURL = config.configurations.parseServerUrl;
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
}