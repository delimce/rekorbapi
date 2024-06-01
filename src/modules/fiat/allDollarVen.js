'use strict';
const axios = require('axios');

const allVendorsUrl = "https://exchange.vcoud.com/coins/latest";

module.exports = {

    getAll: async function () {
        let result = await axios({
            method: 'get',
            timeout: 40000,
            url: allVendorsUrl,
            json: true,
            gzip: true
        })
        return result.data;
    },
    onlyDollarVenFilter: async function () {
        let data = await this.getAll();
        return data.filter(el => el.type === "bolivar");
    },
    getBySlug: async function (slug) {
        let data = await this.onlyDollarVenFilter();
        return data.find(el => el.slug === slug);
    },
}
