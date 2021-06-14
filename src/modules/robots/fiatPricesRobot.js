'use strict'
const pricesModule = require('../fiat/prices')
const utils = require('../app/utils');
const dtoday = require('../fiat/dolarToday');
const bcv = require('../fiat/bcv');
const monitor = require('../fiat/dolarMonitor');

const codes = require('../../../public/enums/fiatCodes.json');

module.exports = {
    async setFiatPrices() {
        let state = {
            prices: codes.length,
            updated: 0,
            time: 0.0,
        }
        const startTime = Date.now()
        let i = 0;
        while (i < codes.length) {
            try {
                let el = codes[i];
                const data = await this.getPriceByCode(el);
                await pricesModule.newOrUpdate(el, data);
                state.updated++;
            } catch (err) {

            } finally {
                i++;
            }
        }
        const stopTime = Date.now()
        state.time = (stopTime - startTime) / 1000;
        return state;
    },
    async getPriceByCode(code) {
        let fiat = {};
        switch (code) {
            case codes[0]: //DTODAY
                fiat.price = await dtoday.getUsdPrice()
                fiat.currency = 'ves'
                break;
            case codes[1]://MONITOR
                fiat.price = await monitor.getUsdPrice()
                fiat.currency = 'ves'
                break;
            default:
                fiat.price = await bcv.getUsdPrice()
                fiat.currency = 'ves'
                break;
        }
        return fiat;
    }
}