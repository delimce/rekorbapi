'use strict';

const axios = require('axios');
const host = process.env.SERVER_HOST;
const port = process.env.SERVER_PORT;
const base = `${host}:${port}/`;
const MAX_TIMEOUT = 5000;


module.exports =
{
    async dtodayInfo() {
        let result = await axios({
            method: 'get',
            timeout: MAX_TIMEOUT,
            url: base + 'fiat/dtoday/info'
        })
        return result.data;
    },
    async floatrates() {
        let result = await axios({
            method: 'get',
            timeout: MAX_TIMEOUT,
            url: base + 'fiat/floatrates'
        })
        return result.data;
    },
    async cmcAll() {
        let result = await axios({
            method: 'get',
            timeout: MAX_TIMEOUT,
            url: base + 'crypto/cmc/all'
        })
        return result.data;
    },
    async dtodayPrice() {
        let result = await axios({
            method: 'get',
            timeout: MAX_TIMEOUT,
            url: base + 'fiat/dtoday'
        })
        return result.data;
    },
    async dmonitorPrice() {
        let result = await axios({
            method: 'get',
            timeout: MAX_TIMEOUT,
            url: base + 'fiat/dmonitor'
        })
        return result.data;
    },
    async bcvPrice() {
        let result = await axios({
            method: 'get',
            timeout: MAX_TIMEOUT,
            url: base + 'fiat/bcv'
        })
        return result.data;
    }
}
