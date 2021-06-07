'use strict'
const localbtcModule = require('../crypto/localbtc')
const localBtcModel = require('../../models/localBtc')
const utils = require('../app/utils');
const geckoModule = require('../crypto/coingecko');
const currencies = require('../../../public/enums/currencies.json');
const email = require('../app/email');
const jsrender = require('jsrender');

module.exports = {
    findPosts: async function () {
        const posts = await localBtcModel.find({ 'notified': false });
        let results = {
            posts: posts.length,
            notified: 0,
            time: 0.0
        };
        if (posts.length > 0) {
            posts.forEach(async el => {
                let postData = await this.findFirstResultPost(el);
                let updateData = { attempt: el.attempt + 1, }
                if (postData) {
                    //notify user
                    let mail = el.user.get('email')
                    updateData.notified = true;
                    results.notified += 1;
                }
                //saving attempt & status
                await localBtcModel.findByIdAndUpdate({ _id: el._id }, updateData)
            });
        }
        return results;
    },
    findFirstResultPost: async function (search) {
        const country = utils.getCountryByCode(search.location).name;
        const btcPrice = await this.getCurrencyPriceOfBTC(search.currency);
        let result = false;
        let posts = await localbtcModule.getTradingPostsByLocation(search.type, search.location, country, 1)
        if (posts.results.length > 0) {
            result = posts.results.find((post) => {
                return ((post.bank && utils.anyElementsInText(post.bank.toLowerCase(), search.bank.toLowerCase()))
                    || (post.msg && utils.anyElementsInText(post.msg.toLowerCase(), search.bank.toLowerCase())))
                    && (search.amount >= post.min && search.amount <= post.max)
            });
        }
        return result;
    },
    getCurrencyPriceOfBTC: async function (currency) {
        let price = 0;
        const btcPriceData = await geckoModule.getPricesByIds(['bitcoin']);
        switch (currency) {
            case currencies.usd:
            case currencies.eur:
                price = Number(btcPriceData[currency]);
                break;
            case currencies.ves:
                let vesFactor = 1000;
                price = Number(btcPriceData[currency]) * vesFactor;
                break;
            default:
                price = Number(btcPriceData[currencies.usd]);
                break;
        }
        return price;
    },
    notifyWithEmail: async function (post, userEmail) {
        email.setSubject("Localbitcoins search of posts completed");
        email.setTo(userEmail);
    }
};