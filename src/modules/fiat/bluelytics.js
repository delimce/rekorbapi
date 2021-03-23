'use strict';

const axios = require('axios');

module.exports =
{
    getInfoArg: async function () {
        let result = {}
        try {
            result = await axios({
                method: 'get',
                timeout: 40000,
                url: 'https://api.bluelytics.com.ar/v2/latest'
            })
            let results = await this.getArsCurrencies(result.data);
            return this.formatResults(results);
        } catch (error) {
            console.log(error)
            return result
        }
    },
    async getArsCurrencies(json) {
        let result = [];
        json.oficial.name = "official";
        json.blue.name = "blue";
        result.push(json.oficial);
        result.push(json.blue);
        return result;
    },
    formatResults(results) {
        return results.map(el => {
            return {
                id: "ARG_" + String(el.name),
                name: el.name,
                symbol: 'ARG',
                precent: 0.0,
                price_sell: el.value_sell,
                price_buy: el.value_buy
            };
        })
    }

}