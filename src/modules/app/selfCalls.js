'use strict';

const axios = require('axios');
const host = process.env.SERVER_HOST;
const port = process.env.SERVER_PORT;
const base = `${host}:${port}/`;
const MAX_TIMEOUT = 5000;


module.exports =
{
    dtodayInfo: async function () {
        let result = await axios({
            method: 'get',
            timeout: MAX_TIMEOUT,
            url: base + 'fiat/dtoday/info'
        })
        return result.data;
    },
    floatrates: async function () {
        let result = await axios({
            method: 'get',
            timeout: MAX_TIMEOUT,
            url: base + 'fiat/floatrates'
        })
        return result.data;
    },
    cmcAll: async function () {
        let result = await axios({
            method: 'get',
            timeout: MAX_TIMEOUT,
            url: base + 'crypto/cmc/all'
        })
        return result.data;
    }
}
