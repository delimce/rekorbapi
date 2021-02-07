'use strict';

const axios = require('axios');

const getInfo = async function () {
    let url_dtoday = "https://s3.amazonaws.com/dolartoday/data.json"
    let result = {}
    try {
        result = await axios({
            method: 'get',
            timeout: 40000,
            url: url_dtoday,
            json: true,
            gzip: true
        })
    } catch (error) {
        console.log(error)
    } finally {
        return result.data;
    }
}

exports.getInfo = getInfo;

exports.getUsdPrice = async function () {
    let data = await getInfo();
    return Number(data.USD.dolartoday); //Bs
}
