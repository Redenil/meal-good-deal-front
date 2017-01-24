import { Injectable } from '@angular/core';

@Injectable()
export class ConfigHelper {
    public configurations:any;
    constructor() {
        this.configurations = require('./config.json');
    }
}
