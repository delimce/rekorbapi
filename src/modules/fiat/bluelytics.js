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
            return this.getArsCurrencies(result.data);
        } catch (error) {
            console.log(error)
            return result
        }
    },
    getArsCurrencies: function (json) {
        let result = [];
        json.oficial.name = "official";
        json.blue.name = "blue";
        result.push(json.oficial);
        result.push(json.blue);
        return result;
    }

}