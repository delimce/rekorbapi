'use strict';

const axios = require('axios');

module.exports =
{
    getInfo: async function () {
        let url_dtoday = "https://s3.amazonaws.com/dolartoday/data.json"
        let result = await axios({
            method: 'get',
            timeout: 40000,
            url: url_dtoday,
            json: true,
            gzip: true
        })
        return result.data;
    },
    getUsdPrice: async function () {
        let data = await this.getInfo();
        return Number(data.USD.dolartoday); //Bs
    },
    getById: async function (id) {
        let data = await this.getInfo();
        if (!data[id]) { //undefined
            return false;
        }
        return data[id];
    }

}