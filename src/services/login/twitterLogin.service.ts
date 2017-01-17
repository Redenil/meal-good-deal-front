import { IloginService } from './Ilogin.service';
import { Injectable } from '@angular/core';
import { TwitterConnect } from 'ionic-native';
import { Storage } from '@ionic/storage';

@Injectable()
export class TwitterLoginService implements IloginService {

    constructor(private storage: Storage) {
    }
    login(): Promise<any> {
        let self = this;
        return new Promise(function (resolve, reject) {
            TwitterConnect.login().then(function (result) {
                TwitterConnect.showUser().then(function (user) {
                    resolve(user);
                }, function (error) {
                    reject();
                });
            });
        });
    }

    logout(): Promise<boolean> {
        let self = this;
        return new Promise(function (resolve, reject) {
            TwitterConnect.logout().then(function (response) {
                self.storage.remove('twitter_user');
                resolve(true);
            }, function (error) {
                reject();
            });
        });
    }

    getConnectionStatus() {
    }
}