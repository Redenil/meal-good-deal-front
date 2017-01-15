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
            let list = new Array<DealModel>();
            let query = new Parse.Query('MealDeal');
            query.include('file');
            query.find({
                success: function (results) {
                    for (var i = 0; i < results.length; i++) {
                        var model = results[i].toJSON();
                        var mealDeal = new DealModel();
                        mealDeal.title = model.title;
                        mealDeal.description = model.description;
                        mealDeal.location = model.location;
                        mealDeal.price = model.price;
                        mealDeal.fileImage = model.file ? model.file.url : null;

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
        let MealDeal = Parse.Object.extend("MealDeal");
        let parseObject = new MealDeal();
        return new Promise(function (resolve, reject) {

            parseObject.set("title", deal.title);
            parseObject.set("description", deal.description);
            parseObject.set("location", deal.location);
            parseObject.set("price", Number(deal.price));

            var parseFile = new Parse.File(deal.title + 'Picture', { base64: deal.fileImage });
            parseFile.save().then(function () {
                parseObject.set('file', parseFile);
                parseObject.save(null, {
                    useMasterKey: true,
                    success: function (savedObject) {
                        resolve(true);
                    },
                    error: function (error) {
                        reject(error);
                    }
                });
            }, function (error) {
                reject(error);
            });
        });
    }
}